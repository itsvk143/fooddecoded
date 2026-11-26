import { ProductCommentRecord, ProductCommentAuditRecord } from "@/types";

// Shared in-memory data store for offline / mock testing mode
export const inMemoryComments: ProductCommentRecord[] = [];
export const inMemoryCommentAudit: ProductCommentAuditRecord[] = [];
export const inMemoryRateLimits = new Map<string, number>();
