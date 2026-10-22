import { getCollection } from "./mongodb";
import { AuditLog } from "@/types";

// In-memory ring buffer for fallback when MongoDB is in demo/local offline mode
const memoryLogs: AuditLog[] = [];

export async function logAuditEvent(entry: {
  action: string;
  entityType: "product" | "ingredient" | "rule" | "import" | "submission";
  entityId?: string;
  performedBy?: string;
  details: string;
  ipAddress?: string;
}): Promise<void> {
  const log: AuditLog = {
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    performedBy: entry.performedBy || "admin",
    details: entry.details,
    timestamp: new Date().toISOString(),
    ipAddress: entry.ipAddress,
  };

  try {
    const col = await getCollection<AuditLog>("auditLogs");
    if (col) {
      await col.insertOne(log as any);
      return;
    }
  } catch (err) {
    console.warn("[Audit] Failed to persist audit log to MongoDB, keeping in memory buffer:", (err as Error).message);
  }

  // Fallback memory ring buffer (keep last 100 entries)
  memoryLogs.unshift(log);
  if (memoryLogs.length > 100) memoryLogs.pop();
}

export async function getAuditLogs(limit: number = 50): Promise<AuditLog[]> {
  try {
    const col = await getCollection<AuditLog>("auditLogs");
    if (col) {
      const dbLogs = await col
        .find({})
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
      return dbLogs.map((l) => ({
        ...l,
        _id: l._id?.toString(),
      }));
    }
  } catch (err) {
    console.warn("[Audit] Failed to fetch audit logs from MongoDB, using memory buffer:", (err as Error).message);
  }

  return memoryLogs.slice(0, limit);
}
