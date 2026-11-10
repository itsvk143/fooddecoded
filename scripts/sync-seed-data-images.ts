import fs from "fs";
import path from "path";

const seedPath = path.join(process.cwd(), "src", "lib", "seed-data.ts");
let content = fs.readFileSync(seedPath, "utf8");

const dryRun = JSON.parse(fs.readFileSync("reports/dry-run-product-images.json", "utf8"));
let replaced = 0;

for (const prop of dryRun.proposals) {
  const barcode = prop.barcode;
  const newUrl = prop.proposedImageUrl;

  const regex = new RegExp(`(barcode:\\s*"${barcode}"[\\s\\S]*?imageUrl:\\s*)"[^"]*"`, "m");
  if (regex.test(content)) {
    content = content.replace(regex, `$1"${newUrl}"`);
    replaced++;
  }
}

fs.writeFileSync(seedPath, content, "utf8");
console.log(`Updated seed-data.ts with ${replaced} verified image URLs.`);

