import fs from "fs";

async function testZepto(query: string) {
  try {
    const url = "https://www.zeptonow.com/search?q=" + encodeURIComponent(query);
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });
    console.log("Zepto Status:", res.status);
    const text = await res.text();
    const matches = text.match(/https:\/\/cdn\.zeptonow\.com\/production\/[^\s"'<>]+/g) || [];
    console.log(`Zepto "${query}" matched images:`, matches.length);
    if (matches.length > 0) {
      console.log("  Sample:", matches[0]);
    }
  } catch (e: any) {
    console.log("Zepto Error:", e.message);
  }
}

async function testBlinkit(query: string) {
  try {
    const url = "https://blinkit.com/s/?q=" + encodeURIComponent(query);
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    console.log("Blinkit Status:", res.status);
    const text = await res.text();
    const matches = text.match(/https:\/\/cdn\.grofers\.com\/app\/images\/products\/[^\s"'<>]+/g) || [];
    console.log(`Blinkit "${query}" matched images:`, matches.length);
    if (matches.length > 0) {
      console.log("  Sample:", matches[0]);
    }
  } catch (e: any) {
    console.log("Blinkit Error:", e.message);
  }
}

async function run() {
  await testZepto("Haldiram Bikaneri Bhujia");
  await testBlinkit("Haldiram Bikaneri Bhujia");
}

run();

