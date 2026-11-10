import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyAdminAccess } from "@/lib/auth";
import { validateProductImage } from "@/lib/image-validator";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const barcode = formData.get("barcode") as string;
    const file = formData.get("file") as File | null;
    const source = (formData.get("source") as string) || "admin_upload";
    const note = (formData.get("note") as string) || "Manual photograph upload by Administrator";

    if (!barcode?.trim()) {
      return NextResponse.json({ error: "Barcode is required to associate image." }, { status: 400 });
    }
    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (buffer.length < 5000) {
      return NextResponse.json({ error: "Image file is too small or invalid (< 5KB)." }, { status: 400 });
    }
    if (buffer.length > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image file exceeds 10MB limit." }, { status: 400 });
    }

    const magic = buffer.slice(0, 4).toString("hex");
    let ext = "jpg";
    if (magic.startsWith("89504e47")) ext = "png";
    else if (magic.startsWith("52494646")) ext = "webp";
    else if (!magic.startsWith("ffd8")) {
      return NextResponse.json({ error: "Invalid image format. Supported formats: JPEG, PNG, WEBP." }, { status: 400 });
    }

    const cleanBarcode = barcode.trim().replace(/[^a-zA-Z0-9_-]/g, "");
    const packshotsDir = path.join(process.cwd(), "public/images/packshots");
    if (!fs.existsSync(packshotsDir)) {
      fs.mkdirSync(packshotsDir, { recursive: true });
    }

    const filename = `${cleanBarcode}.${ext}`;
    const filePath = path.join(packshotsDir, filename);
    fs.writeFileSync(filePath, buffer);

    const imageUrl = `/images/packshots/${filename}?t=${Date.now()}`;

    await logAuditEvent({
      action: "ADMIN_UPLOAD_PRODUCT_IMAGE",
      entityType: "product",
      entityId: cleanBarcode,
      performedBy: auth.adminIdentifier,
      details: `Uploaded product packaging photograph (${(buffer.length / 1024).toFixed(1)} KB) for barcode: ${cleanBarcode}`,
    });

    return NextResponse.json({
      success: true,
      imageUrl,
      filename,
      size: buffer.length,
      note,
      message: "Image uploaded and stored successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Image upload failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}

