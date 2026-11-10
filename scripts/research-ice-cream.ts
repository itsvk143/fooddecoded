import https from "https";
import fs from "fs";
import path from "path";

function get(url: string, headers: Record<string, string> = {}): Promise<{ status: number; headers: any; data: string }> {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*",
        ...headers
      }
    }, (res) => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => resolve({ status: res.statusCode || 0, headers: res.headers, data }));
    }).on("error", reject);
  });
}

async function main() {
  console.log("Testing Zepto search for ice cream...");
  const res = await get("https://www.zeptonow.com/search?q=ice+cream");
  console.log("Zepto status:", res.status, "len:", res.data.length);
  const matches = res.data.match(/https:\/\/cdn\.zeptonow\.com\/production\/[^\s"'\\]+/g);
  if (matches) {
    console.log("Found Zepto CDN images count:", matches.length);
    console.log("Sample:", matches.slice(0, 5));
  }
}
main();

