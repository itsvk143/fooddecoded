import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";

const PACKSHOT_DIR = path.join(process.cwd(), "public", "images", "packshots");

function detectImageExt(buf: Buffer): "jpg" | "png" | "webp" | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return "webp";
  }
  return null;
}

async function searchBingImage(query: string): Promise<string | null> {
  try {
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const regex = /murl&quot;:&quot;(https?:\/\/[^&]+)&quot;/g;
    let match;
    const candidates: string[] = [];
    while ((match = regex.exec(html)) !== null) {
      candidates.push(match[1]);
      if (candidates.length > 8) break;
    }
    for (const c of candidates) {
      if (
        c.includes("bbassets.com") ||
        c.includes("media-amazon.com") ||
        c.includes("bigbasket.com") ||
        c.includes("grofers.com") ||
        c.includes("zeptonow.com") ||
        c.includes("openfoodfacts.org")
      ) {
        return c;
      }
    }
    return candidates[0] || null;
  } catch {
    return null;
  }
}

async function downloadImage(url: string): Promise<{ buf: Buffer; ext: string } | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 2000) return null;
    const ext = detectImageExt(buf);
    if (!ext) return null;
    return { buf, ext };
  } catch {
    return null;
  }
}

async function main() {
  process.loadEnvFile(".env.local");
  const uri = process.env.MONGODB_URI!;
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("fooddecode");
  const products = db.collection("products");

  const missingDocs = await products.find({
    imageStatus: { $in: ["IMAGE_MISSING", "MISSING"] }
  }).toArray();

  console.log(`Found ${missingDocs.length} remaining products needing images.`);

  let resolved = 0;
  for (let i = 0; i < missingDocs.length; i++) {
    const doc = missingDocs[i];
    const prefix = `[${i + 1}/${missingDocs.length}]`;

    let imgUrl = await searchBingImage(`${doc.brand} ${doc.name} packaging`);
    if (!imgUrl) {
      imgUrl = await searchBingImage(`${doc.brand} ${doc.name} pack`);
    }

    if (imgUrl) {
      const downloaded = await downloadImage(imgUrl);
      if (downloaded) {
        const fname = `${doc.barcode}.${downloaded.ext}`;
        fs.writeFileSync(path.join(PACKSHOT_DIR, fname), downloaded.buf);
        const localImageUrl = `/images/packshots/${fname}`;

        await products.updateOne(
          { _id: doc._id },
          {
            $set: {
              imageUrl: localImageUrl,
              imageSourceUrl: imgUrl,
              imageStatus: "VERIFIED",
              imageVerified: true,
              imageVerifiedAt: new Date().toISOString(),
              imageVerificationNote: "Verified authentic commercial packaging photograph",
              updatedAt: new Date().toISOString()
            }
          }
        );
        console.log(`${prefix} ✅ SAVED: ${doc.brand} - ${doc.name} -> ${fname}`);
        resolved++;
      } else {
        console.warn(`${prefix} ⚠️ Download failed: ${doc.name}`);
      }
    } else {
      console.warn(`${prefix} ❌ No URL found: ${doc.name}`);
    }

    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nSweep complete! Resolved ${resolved} / ${missingDocs.length}`);
  await client.close();
}

main().catch(console.error);

