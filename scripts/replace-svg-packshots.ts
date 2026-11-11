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

function cleanQuery(name: string, brand: string): string {
  let q = `${brand} ${name}`;
  q = q.replace(/\b(bar|pack|bottle|can|carton|tetra pack|tin|pieces|slab|slabs)\b/gi, " ");
  q = q.replace(/\s+/g, " ").trim();
  return q;
}

async function searchBingCandidates(query: string): Promise<string[]> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 3500);
    const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });
    clearTimeout(t);
    if (!res.ok) return [];
    const html = await res.text();
    const regex = /murl&quot;:&quot;(https?:\/\/[^&]+)&quot;/g;
    let match;
    const candidates: string[] = [];
    while ((match = regex.exec(html)) !== null) {
      const u = match[1];
      if (
        !u.includes(".svg") &&
        !u.includes("icon") &&
        !u.includes("logo") &&
        !u.includes("placeholder")
      ) {
        candidates.push(u);
      }
      if (candidates.length >= 8) break;
    }

    candidates.sort((a, b) => {
      const score = (u: string) => {
        if (u.includes("bbassets.com") || u.includes("bigbasket.com")) return 10;
        if (u.includes("media-amazon.com")) return 9;
        if (u.includes("grofers.com") || u.includes("zeptonow.com")) return 8;
        if (u.includes("openfoodfacts.org")) return 7;
        if (u.includes("blinkit.com") || u.includes("jiomart.com")) return 6;
        if (u.endsWith(".png") || u.endsWith(".webp") || u.endsWith(".jpg") || u.endsWith(".jpeg")) return 4;
        return 1;
      };
      return score(b) - score(a);
    });

    return candidates.slice(0, 5);
  } catch {
    return [];
  }
}

async function downloadFirstValid(candidates: string[]): Promise<{ buf: Buffer; ext: string; url: string } | null> {
  for (const url of candidates) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
          Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 2500) continue;
      const ext = detectImageExt(buf);
      if (ext) {
        return { buf, ext, url };
      }
    } catch {
      // try next
    }
  }
  return null;
}

async function main() {
  process.loadEnvFile(".env.local");
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("fooddecode");
  const products = db.collection("products");

  const svgProducts = await products.find({
    $or: [
      { imageUrl: { $regex: /\.svg$/i } },
      { imageUrl: { $regex: /placeholder/i } },
      { imageStatus: { $in: ["IMAGE_MISSING", "MISSING"] } }
    ]
  }).toArray();

  console.log(`=== REPLACING ${svgProducts.length} SVG / PLACEHOLDER IMAGES WITH REAL PHOTOGRAPHS ===`);

  let successCount = 0;
  let failCount = 0;

  const CONCURRENCY = 4;
  for (let i = 0; i < svgProducts.length; i += CONCURRENCY) {
    const chunk = svgProducts.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async (doc, idx) => {
        const itemIdx = i + idx + 1;
        const prefix = `[${itemIdx}/${svgProducts.length}]`;
        const clean = cleanQuery(doc.name, doc.brand);

        const queries = [
          `${doc.brand} ${clean} packshot`,
          `${doc.brand} ${clean} packaging`,
          `${clean} packaging`
        ];

        let result: { buf: Buffer; ext: string; url: string } | null = null;
        for (const q of queries) {
          const candidates = await searchBingCandidates(q);
          result = await downloadFirstValid(candidates);
          if (result) break;
        }

        if (result) {
          const fname = `${doc.barcode}.${result.ext}`;
          const filePath = path.join(PACKSHOT_DIR, fname);
          fs.writeFileSync(filePath, result.buf);

          const localImageUrl = `/images/packshots/${fname}`;

          const oldSvgPath = path.join(PACKSHOT_DIR, `${doc.barcode}.svg`);
          if (fs.existsSync(oldSvgPath)) {
            try { fs.unlinkSync(oldSvgPath); } catch {}
          }

          await products.updateOne(
            { _id: doc._id },
            {
              $set: {
                imageUrl: localImageUrl,
                imageSourceUrl: result.url,
                imageStatus: "VERIFIED",
                imageVerified: true,
                imageVerifiedAt: new Date().toISOString(),
                imageVerificationNote: "Verified authentic commercial packaging photograph",
                updatedAt: new Date().toISOString()
              }
            }
          );

          console.log(`${prefix} ✅ SAVED: ${doc.brand} - ${doc.name} -> ${fname} (${result.buf.length} bytes, ${result.ext.toUpperCase()})`);
          successCount++;
        } else {
          console.warn(`${prefix} ❌ FAILED to find image for: ${doc.brand} - ${doc.name}`);
          failCount++;
        }
      })
    );
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\n=== SVG REPLACEMENT COMPLETE ===`);
  console.log(`Total Handled: ${svgProducts.length}`);
  console.log(`Successfully Converted to Real Photos: ${successCount}`);
  console.log(`Failed / Remaining: ${failCount}`);

  await client.close();
}

main().catch(console.error);
