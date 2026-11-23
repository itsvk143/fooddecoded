import fs from "fs";
import path from "path";

const PACKSHOT_DIR = path.join(process.cwd(), "public/images/packshots");
if (!fs.existsSync(PACKSHOT_DIR)) {
  fs.mkdirSync(PACKSHOT_DIR, { recursive: true });
}

function detectImageExt(buf: Buffer): "jpg" | "png" | "webp" | null {
  if (buf.length < 4) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) return "webp";
  return null;
}

async function downloadPackshot(url: string): Promise<{ buf: Buffer; ext: "jpg" | "png" | "webp" } | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
      },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 3000) return null;
    const ext = detectImageExt(buf) || (url.includes(".png") ? "png" : url.includes(".webp") ? "webp" : "jpg");
    return { buf, ext };
  } catch {
    return null;
  }
}

async function run() {
  const repairMap: Record<string, { name: string; url: string; note: string }> = JSON.parse(
    fs.readFileSync("scripts/master_image_repair_map.json", "utf8")
  );

  const barcodes = Object.keys(repairMap);
  console.log(`Starting download for ${barcodes.length} verified food packshots...`);

  let successCount = 0;
  let failCount = 0;
  const appliedMapping: Record<string, { imageUrl: string; imageSourceUrl: string; imageVerificationNote: string }> = {};

  const concurrency = 10;
  let idx = 0;

  async function worker() {
    while (idx < barcodes.length) {
      const b = barcodes[idx++];
      const entry = repairMap[b];
      const result = await downloadPackshot(entry.url);
      if (result) {
        const filename = `${b}.${result.ext}`;
        const filePath = path.join(PACKSHOT_DIR, filename);
        fs.writeFileSync(filePath, result.buf);
        appliedMapping[b] = {
          imageUrl: `/images/packshots/${filename}`,
          imageSourceUrl: entry.url,
          imageVerificationNote: entry.note
        };
        successCount++;
      } else {
        console.error(`Failed to download: ${b} | ${entry.name} from ${entry.url}`);
        failCount++;
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  console.log(`\n=== Download Finished ===`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);

  fs.writeFileSync("scripts/applied_packshots_mapping.json", JSON.stringify(appliedMapping, null, 2));
  console.log("Saved applied mapping to scripts/applied_packshots_mapping.json");
}

run();
