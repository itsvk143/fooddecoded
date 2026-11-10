import fs from "fs";
import path from "path";
import https from "https";
import http from "http";
import { CANDIDATES_60 } from "./data/ice-cream-candidates";

const PACKSHOT_DIR = path.join(process.cwd(), "public/images/packshots");
if (!fs.existsSync(PACKSHOT_DIR)) {
  fs.mkdirSync(PACKSHOT_DIR, { recursive: true });
}

function download(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const loc = res.headers.location;
        if (loc) return download(loc).then(resolve).catch(reject);
        return reject(new Error("Redirect without location"));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const chunks: Buffer[] = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });
    req.on("error", reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Timeout"));
    });
  });
}

function detectExt(buf: Buffer): string {
  const hex = buf.slice(0, 4).toString("hex");
  if (hex.startsWith("89504e47")) return "png";
  if (hex.startsWith("52494646")) return "webp";
  if (hex.startsWith("ffd8")) return "jpg";
  return "jpg";
}

async function tryAlternativeUrls(candidate: typeof CANDIDATES_60[0]): Promise<{ buf: Buffer; ext: string; url: string } | null> {
  // Extract SKU from BB url
  const match = candidate.remoteImageUrl.match(/\/p\/l\/(\d+)_/);
  if (!match) return null;
  const sku = match[1];

  // Try different revisions and patterns
  const suffixes = [
    candidate.remoteImageUrl.split(`${sku}_`)[1],
    "1-a.jpg", "2-a.jpg", "3-a.jpg", "4-a.jpg", "5-a.jpg",
    "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"
  ];

  for (let rev = 1; rev <= 8; rev++) {
    for (const suf of suffixes) {
      if (!suf) continue;
      const cleanSuf = suf.replace(/^\d+-/, "");
      const altUrl = `https://www.bbassets.com/media/uploads/p/l/${sku}_${rev}-${cleanSuf}`;
      try {
        const buf = await download(altUrl);
        if (buf.length > 5000) {
          const ext = detectExt(buf);
          return { buf, ext, url: altUrl };
        }
      } catch (e) {
        // continue
      }
    }
  }
  return null;
}

async function main() {
  console.log("=== DOWNLOADING AND VERIFYING ICE CREAM PACKSHOTS ===");
  let successCount = 0;
  let fallbackCount = 0;
  const results: Array<{
    barcode: string;
    name: string;
    brand: string;
    status: string;
    localPath: string;
    bytes: number;
    url: string;
  }> = [];

  for (let i = 0; i < CANDIDATES_60.length; i++) {
    const c = CANDIDATES_60[i];
    console.log(`[${i + 1}/60] Checking ${c.brand} - ${c.name}...`);
    let buf: Buffer | null = null;
    let ext = "jpg";
    let finalUrl = c.remoteImageUrl;

    try {
      buf = await download(c.remoteImageUrl);
      if (buf.length < 5000) {
        throw new Error("File too small");
      }
      ext = detectExt(buf);
    } catch (err: any) {
      console.log(`  Initial URL failed (${err.message}), searching alternatives...`);
      const alt = await tryAlternativeUrls(c);
      if (alt) {
        buf = alt.buf;
        ext = alt.ext;
        finalUrl = alt.url;
        console.log(`  ✅ Found alternative URL: ${finalUrl}`);
      }
    }

    if (buf && buf.length >= 5000) {
      const fileName = `${c.barcode}.${ext}`;
      const destPath = path.join(PACKSHOT_DIR, fileName);
      fs.writeFileSync(destPath, buf);
      const localUrl = `/images/packshots/${fileName}`;
      console.log(`  ✅ SAVED: ${fileName} (${buf.length} bytes)`);
      successCount++;
      results.push({
        barcode: c.barcode,
        name: c.name,
        brand: c.brand,
        status: "VERIFIED",
        localPath: localUrl,
        bytes: buf.length,
        url: finalUrl
      });
    } else {
      console.warn(`  ⚠️ MISSING: Could not download genuine packshot for ${c.name}`);
      fallbackCount++;
      results.push({
        barcode: c.barcode,
        name: c.name,
        brand: c.brand,
        status: "MISSING",
        localPath: "/images/placeholder-product.svg",
        bytes: 0,
        url: c.remoteImageUrl
      });
    }
  }

  console.log("\n=== DOWNLOAD SUMMARY ===");
  console.log(`Verified packshots downloaded: ${successCount} / 60`);
  console.log(`Awaiting manual review / placeholders: ${fallbackCount}`);

  fs.writeFileSync(
    path.join(process.cwd(), "reports/ice-cream-download-audit.json"),
    JSON.stringify(results, null, 2),
    "utf8"
  );
}

main();

