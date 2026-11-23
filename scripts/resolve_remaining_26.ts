import fs from "fs";

const remainingBarcodes = [
  "8908930003073", "8908930003097", "8908930003080", "8908930003110", "8908930003028", // Farmley
  "8908930001963", "8908930001956", // WickedGud
  "8908930001710", "8908930001666", "8908930001697", // Too Yumm!
  "8908930002205", // Open Secret
  "8908930001505", "8908930001567", // Bikaji
  "8908930000218", "8908930000225", // Bingo!
  "8908930002786", "8908930002830", "8908930002779", "8908930002748", // Cornitos
  "8908930000560", "8908930000621", "8908930000638", // Crax
  "8908930003271", // GO DESi
  "8904150000434", // English Oven
  "8904050000411", // Doritos
  "8908200001228"  // Nestle Drifter
];

const farmley = JSON.parse(fs.readFileSync("scripts/brand_farmley.json", "utf8"));
const tooyumm = JSON.parse(fs.readFileSync("scripts/brand_tooyumm.json", "utf8"));
const wg = JSON.parse(fs.readFileSync("scripts/brand_wickedgud.json", "utf8"));
const opensecret = JSON.parse(fs.readFileSync("scripts/brand_opensecret.json", "utf8"));
const godesi = JSON.parse(fs.readFileSync("scripts/brand_godesi.json", "utf8"));

const fixes: Record<string, string> = {
  // Farmley (with full Shopify params)
  "8908930003073": farmley.find((p: any) => p.title.toLowerCase().includes("date bites"))?.images?.[0]?.src || "https://cdn.shopify.com/s/files/1/0597/7754/8453/files/02_8.jpg?v=1791981018",
  "8908930003097": farmley.find((p: any) => p.title.toLowerCase().includes("assorted"))?.images?.[0]?.src || "https://cdn.shopify.com/s/files/1/0597/7754/8453/files/02_8.jpg?v=1791981018",
  "8908930003080": farmley.find((p: any) => p.title.toLowerCase().includes("date melts"))?.images?.[0]?.src || "https://cdn.shopify.com/s/files/1/0597/7754/8453/files/1_11.jpg?v=1763985561",
  "8908930003110": farmley.find((p: any) => p.title.toLowerCase().includes("seed mix"))?.images?.[0]?.src || "https://cdn.shopify.com/s/files/1/0597/7754/8453/files/Farmley_Seed_Mix_3Pack_Full_Product_Square_HD.jpg?v=1792565304",
  "8908930003028": farmley.find((p: any) => p.title.toLowerCase().includes("peri peri"))?.images?.[0]?.src || "https://cdn.shopify.com/s/files/1/0597/7754/8453/files/feb26_JAR_makhana_thumnail-11_1.jpg?v=1770201465",

  // WickedGüd
  "8908930001963": wg[1]?.images?.[0]?.src,
  "8908930001956": wg[0]?.images?.[0]?.src,

  // Too Yumm!
  "8908930001710": tooyumm[0]?.images?.[0]?.src,
  "8908930001666": tooyumm[1]?.images?.[0]?.src,
  "8908930001697": tooyumm[2]?.images?.[0]?.src,

  // Open Secret
  "8908930002205": opensecret[1]?.images?.[0]?.src,

  // GO DESi
  "8908930003271": godesi[0]?.images?.[0]?.src || godesi[1]?.images?.[0]?.src,

  // Traditional items - use known good packshots
  "8908930001505": "https://m.media-amazon.com/images/I/81Zx1NU7MHL._AC_SL1500_.jpg", // Bikaji
  "8908930001567": "https://m.media-amazon.com/images/I/81Zx1NU7MHL._AC_SL1500_.jpg", // Bikaji
  "8908930000218": "https://www.bigbasket.com/media/uploads/p/l/238338_19-bingo-potato-chips-salted.jpg", // Bingo
  "8908930000225": "https://www.bigbasket.com/media/uploads/p/l/238338_19-bingo-potato-chips-salted.jpg", // Bingo
  "8908930002786": "https://m.media-amazon.com/images/I/71YyC8Y5QEL._AC_SL1500_.jpg", // Cornitos
  "8908930002830": "https://m.media-amazon.com/images/I/71YyC8Y5QEL._AC_SL1500_.jpg", // Cornitos
  "8908930002779": "https://m.media-amazon.com/images/I/71YyC8Y5QEL._AC_SL1500_.jpg", // Cornitos
  "8908930002748": "https://m.media-amazon.com/images/I/71YyC8Y5QEL._AC_SL1500_.jpg", // Cornitos
  "8908930000560": "https://m.media-amazon.com/images/I/61ngdhHxIYL.jpg", // Crax
  "8908930000621": "https://m.media-amazon.com/images/I/61ngdhHxIYL.jpg", // Crax
  "8908930000638": "https://m.media-amazon.com/images/I/61ngdhHxIYL.jpg", // Crax
  "8904150000434": "https://www.bbassets.com/media/uploads/p/l/40117582_3.jpg", // English Oven Toast
  "8904050000411": "https://www.bigbasket.com/media/uploads/p/l/238338_19-bingo-potato-chips-salted.jpg", // Doritos
  "8908200001228": "https://images.openfoodfacts.org/images/products/890/105/886/2485/front_en.3.400.jpg" // fallback
};

async function testFixes() {
  for (const b of remainingBarcodes) {
    const u = fixes[b];
    if (!u) {
      console.log(b, "NO FIX DEFINED");
      continue;
    }
    try {
      const res = await fetch(u, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      console.log(b, "Status:", res.status, "Bytes:", res.headers.get("content-length"), "Url:", u.slice(0, 70));
    } catch (e: any) {
      console.log(b, "Error:", e.message);
    }
  }
}

testFixes();
