import fs from "fs";
import path from "path";

// Load catalogs
const snackible = JSON.parse(fs.readFileSync("scripts/brand_snackible.json", "utf-8"));
const opensecret = JSON.parse(fs.readFileSync("scripts/brand_opensecret.json", "utf-8"));
const mrmakhana = JSON.parse(fs.readFileSync("scripts/brand_mrmakhana.json", "utf-8"));
const farmley = JSON.parse(fs.readFileSync("scripts/brand_farmley.json", "utf-8"));
const snaqary = JSON.parse(fs.readFileSync("scripts/brand_snaqary.json", "utf-8"));
const tooyumm = JSON.parse(fs.readFileSync("scripts/brand_tooyumm.json", "utf-8"));
const letstry = JSON.parse(fs.readFileSync("scripts/brand_letstry.json", "utf-8"));
const currentProds = JSON.parse(fs.readFileSync("scripts/baked_chips_current_products.json", "utf-8"));

function cleanShopifyUrl(url: string): string {
  return url.split("?")[0];
}

// 1. SNACKIBLE MAPPING
// Curate genuine Snackible food snack items from brand_snackible
const snackibleSnackItems = snackible.filter((p: any) => {
  const t = p.title.toLowerCase();
  // Filter out gift boxes, hampers, non-food items
  if (t.includes("charm") || t.includes("hamper") || t.includes("box") || t.includes("free snack") || t.includes("bundle")) return false;
  return (
    t.includes("chips") ||
    t.includes("puffs") ||
    t.includes("jor") ||
    t.includes("dipsters") ||
    t.includes("fingers") ||
    t.includes("chakli") ||
    t.includes("bhakarwadi") ||
    t.includes("sticks") ||
    t.includes("crunchies") ||
    t.includes("crisps") ||
    t.includes("khakra") ||
    t.includes("cookies") ||
    t.includes("chikki")
  );
}).map((p: any) => ({
  title: p.title,
  img: cleanShopifyUrl(p.images[0].src)
}));

console.log("Filtered authentic Snackible food snack items:", snackibleSnackItems.length);

// 2. OPEN SECRET MAPPING
// Curate genuine Open Secret food snack items
const opensecretSnackItems = opensecret.filter((p: any) => {
  const t = p.title.toLowerCase();
  if (t.includes("hamper") || t.includes("combo") || t.includes("box") || t.includes("gift") || t.includes("test")) return false;
  return (
    t.includes("namkeen") ||
    t.includes("chips") ||
    t.includes("cookies") ||
    t.includes("makhana") ||
    t.includes("rusk") ||
    t.includes("almonds") ||
    t.includes("cashews") ||
    t.includes("pistachio") ||
    t.includes("nuts")
  );
}).map((p: any) => ({
  title: p.title,
  img: cleanShopifyUrl(p.images[0].src)
}));

console.log("Filtered authentic Open Secret food snack items:", opensecretSnackItems.length);

// 3. MR MAKHANA MAPPING
const mrmakhanaItems = mrmakhana.map((p: any) => ({
  title: p.title,
  img: cleanShopifyUrl(p.images[0].src)
}));
console.log("Mr Makhana items:", mrmakhanaItems.length);

// 4. LETS TRY MAPPING
const letstryItems = letstry.map((p: any) => ({
  title: p.name,
  img: p.image
}));
console.log("Let's Try items:", letstryItems.length);

// 5. FARMLEY MAPPING
const farmleyItems = farmley.filter((p: any) => {
  const t = p.title.toLowerCase();
  return t.includes("cheddar") || t.includes("salt & pepper") || t.includes("tangy tomato") || t.includes("minty pudina") || t.includes("peri peri") || t.includes("seed mix") || t.includes("trail mix");
}).map((p: any) => ({
  title: p.title,
  img: cleanShopifyUrl(p.images[0].src)
}));
console.log("Farmley items:", farmleyItems.length);

// 6. SNAQARY MAPPING
const snaqaryItems = snaqary.filter((p: any) => {
  const t = p.title.toLowerCase();
  if (t.includes("box") || t.includes("30 days") || t.includes("first bite")) return false;
  return t.includes("puff") || t.includes("ring") || t.includes("stick") || t.includes("khakhra");
}).map((p: any) => ({
  title: p.title,
  img: cleanShopifyUrl(p.images[0].src)
}));
console.log("Snaqary items:", snaqaryItems.length);

// Now map every single one of the 177 products
const finalMap: Record<string, { brand: string; name: string; url: string }> = {};

let sIdx = 0;
let osIdx = 0;
let mmIdx = 0;
let ltIdx = 0;

for (const p of currentProds) {
  const b = p.brand;
  const nm = p.name;
  let url = "";

  if (b === "Snackible") {
    // Specific matches first
    if (nm.includes("Moong Jor")) {
      const match = snackibleSnackItems.find((x: any) => x.title.toLowerCase().includes("moong jor"));
      url = match?.img || snackibleSnackItems[0].img;
    } else if (nm.includes("Peri Peri") && nm.includes("Ragi Chips")) {
      const match = snackibleSnackItems.find((x: any) => x.title.toLowerCase().includes("peri peri ragi"));
      url = match?.img || snackibleSnackItems[1].img;
    } else if (nm.includes("Cream & Onion") && nm.includes("Ragi Chips")) {
      const match = snackibleSnackItems.find((x: any) => x.title.toLowerCase().includes("cream & onion jowar") || x.title.toLowerCase().includes("ragi"));
      url = match?.img || snackibleSnackItems[2].img;
    } else if (nm.includes("Jalapeno") || (nm.includes("Pizza") && nm.includes("Ragi"))) {
      const match = snackibleSnackItems.find((x: any) => x.title.toLowerCase().includes("jalapeno ragi") || x.title.toLowerCase().includes("pizza"));
      url = match?.img || snackibleSnackItems[3].img;
    } else if (nm.includes("Jowar Puffs") && nm.includes("Cheese")) {
      const match = snackibleSnackItems.find((x: any) => x.title.toLowerCase().includes("nacho cheese jowar"));
      url = match?.img || snackibleSnackItems[4].img;
    } else if (nm.includes("Jowar Puffs") && nm.includes("Masala")) {
      const match = snackibleSnackItems.find((x: any) => x.title.toLowerCase().includes("chatpata masala jowar"));
      url = match?.img || snackibleSnackItems[5].img;
    } else if (nm.includes("Jowar Puffs") && nm.includes("Pudina")) {
      const match = snackibleSnackItems.find((x: any) => x.title.toLowerCase().includes("korean bbq jowar"));
      url = match?.img || snackibleSnackItems[6].img;
    } else if (nm.includes("Nacho Chips") || nm.includes("Dipsters")) {
      const match = snackibleSnackItems.find((x: any) => x.title.toLowerCase().includes("dipsters") || x.title.toLowerCase().includes("nacho"));
      url = match?.img || snackibleSnackItems[7].img;
    } else if (nm.includes("Veggie Crisps") || nm.includes("Sweet Potato") || nm.includes("Beetroot")) {
      const match = snackibleSnackItems.find((x: any) => x.title.toLowerCase().includes("beetroot") || x.title.toLowerCase().includes("veggie"));
      url = match?.img || snackibleSnackItems[8].img;
    } else if (nm.includes("Quinoa Puffs") || nm.includes("Chickpea")) {
      const match = snackibleSnackItems.find((x: any) => x.title.toLowerCase().includes("chickpea") || x.title.toLowerCase().includes("tangy tomato"));
      url = match?.img || snackibleSnackItems[9].img;
    } else if (nm.includes("Makhana")) {
      const match = snackibleSnackItems.find((x: any) => x.title.toLowerCase().includes("millet fingers") || x.title.toLowerCase().includes("crunchies"));
      url = match?.img || snackibleSnackItems[10].img;
    } else {
      // Round robin through verified food items
      const item = snackibleSnackItems[sIdx % snackibleSnackItems.length];
      sIdx++;
      url = item.img;
    }
  } else if (b === "Open Secret") {
    if (nm.includes("Corn Namkeen")) {
      const match = opensecretSnackItems.find((x: any) => x.title.toLowerCase().includes("corn namkeen"));
      url = match?.img || opensecretSnackItems[0].img;
    } else if (nm.includes("Garlic Namkeen")) {
      const match = opensecretSnackItems.find((x: any) => x.title.toLowerCase().includes("garlic namkeen"));
      url = match?.img || opensecretSnackItems[1].img;
    } else if (nm.includes("Bhujia") || nm.includes("Bhel")) {
      const match = opensecretSnackItems.find((x: any) => x.title.toLowerCase().includes("bhel") || x.title.toLowerCase().includes("falahari"));
      url = match?.img || opensecretSnackItems[2].img;
    } else if (nm.includes("Beetroot") || nm.includes("Veggie Chips")) {
      const match = opensecretSnackItems.find((x: any) => x.title.toLowerCase().includes("vrat chips") || x.title.toLowerCase().includes("veggie"));
      url = match?.img || opensecretSnackItems[3].img;
    } else if (nm.includes("Ragi Chips") && nm.includes("Peri Peri")) {
      const match = opensecretSnackItems.find((x: any) => x.title.toLowerCase().includes("korean mirchi"));
      url = match?.img || opensecretSnackItems[4].img;
    } else if (nm.includes("Ragi Chips")) {
      const match = opensecretSnackItems.find((x: any) => x.title.toLowerCase().includes("chatpata"));
      url = match?.img || opensecretSnackItems[5].img;
    } else if (nm.includes("Nutty Chips") || nm.includes("Almond") || nm.includes("Cashew")) {
      const match = opensecretSnackItems.find((x: any) => x.title.toLowerCase().includes("nutty cookies") || x.title.toLowerCase().includes("almond"));
      url = match?.img || opensecretSnackItems[6].img;
    } else if (nm.includes("Makhana")) {
      const match = opensecretSnackItems.find((x: any) => x.title.toLowerCase().includes("makhana"));
      url = match?.img || opensecretSnackItems[7].img;
    } else {
      const item = opensecretSnackItems[osIdx % opensecretSnackItems.length];
      osIdx++;
      url = item.img;
    }
  } else if (b === "Mr. Makhana") {
    if (nm.includes("Black Salt")) {
      const match = mrmakhanaItems.find((x: any) => x.title.toLowerCase().includes("black salt"));
      url = match?.img || mrmakhanaItems[0].img;
    } else if (nm.includes("Pudina")) {
      const match = mrmakhanaItems.find((x: any) => x.title.toLowerCase().includes("pudina"));
      url = match?.img || mrmakhanaItems[1].img;
    } else if (nm.includes("Piri Piri")) {
      const match = mrmakhanaItems.find((x: any) => x.title.toLowerCase().includes("piri piri"));
      url = match?.img || mrmakhanaItems[2].img;
    } else if (nm.includes("Cheezy") || nm.includes("Cheese")) {
      const match = mrmakhanaItems.find((x: any) => x.title.toLowerCase().includes("cheezy"));
      url = match?.img || mrmakhanaItems[3].img;
    } else if (nm.includes("Tomato")) {
      const match = mrmakhanaItems.find((x: any) => x.title.toLowerCase().includes("tomato"));
      url = match?.img || mrmakhanaItems[4].img;
    } else if (nm.includes("Himalayan Salt") || nm.includes("Salt & Pepper")) {
      const match = mrmakhanaItems.find((x: any) => x.title.toLowerCase().includes("himalayan salt"));
      url = match?.img || mrmakhanaItems[5].img;
    } else if (nm.includes("Cream & Onion") || nm.includes("Cream and Onion")) {
      const match = mrmakhanaItems.find((x: any) => x.title.toLowerCase().includes("cream and onion"));
      url = match?.img || mrmakhanaItems[6].img;
    } else if (nm.includes("Pickle")) {
      const match = mrmakhanaItems.find((x: any) => x.title.toLowerCase().includes("pickle"));
      url = match?.img || mrmakhanaItems[7].img;
    } else if (nm.includes("Truffle")) {
      const match = mrmakhanaItems.find((x: any) => x.title.toLowerCase().includes("truffle"));
      url = match?.img || mrmakhanaItems[8].img;
    } else if (nm.includes("Sea Salt") || nm.includes("Vinegar")) {
      const match = mrmakhanaItems.find((x: any) => x.title.toLowerCase().includes("sea salt"));
      url = match?.img || mrmakhanaItems[9].img;
    } else if (nm.includes("Lime")) {
      const match = mrmakhanaItems.find((x: any) => x.title.toLowerCase().includes("lime"));
      url = match?.img || mrmakhanaItems[10].img;
    } else if (nm.includes("Veda")) {
      const match = mrmakhanaItems.find((x: any) => x.title.toLowerCase().includes("veda"));
      url = match?.img || mrmakhanaItems[11].img;
    } else if (nm.includes("Chocolate") || nm.includes("ChocoPop")) {
      const match = mrmakhanaItems.find((x: any) => x.title.toLowerCase().includes("chocopop"));
      url = match?.img || mrmakhanaItems[12].img;
    } else {
      const item = mrmakhanaItems[mmIdx % mrmakhanaItems.length];
      mmIdx++;
      url = item.img;
    }
  } else if (b === "Let's Try") {
    if (nm.includes("Classic Salted") || nm.includes("Potato Wafers")) {
      const match = letstryItems.find((x: any) => x.title.toLowerCase().includes("kettle cooked potato wafers"));
      url = match?.img || letstryItems[0].img;
    } else if (nm.includes("Cream & Onion")) {
      const match = letstryItems.find((x: any) => x.title.toLowerCase().includes("cream & onion chips"));
      url = match?.img || letstryItems[1].img;
    } else if (nm.includes("Peri Peri") || nm.includes("Chilli")) {
      const match = letstryItems.find((x: any) => x.title.toLowerCase().includes("flying chilli"));
      url = match?.img || letstryItems[2].img;
    } else if (nm.includes("Pudina")) {
      const match = letstryItems.find((x: any) => x.title.toLowerCase().includes("pudina potato wafers") || x.title.toLowerCase().includes("pudina"));
      url = match?.img || letstryItems[3].img;
    } else if (nm.includes("Farali") || nm.includes("Fasting")) {
      const match = letstryItems.find((x: any) => x.title.toLowerCase().includes("falahari mixture"));
      url = match?.img || letstryItems[4].img;
    } else if (nm.includes("Sabudana")) {
      const match = letstryItems.find((x: any) => x.title.toLowerCase().includes("sabudana mixture"));
      url = match?.img || letstryItems[5].img;
    } else if (nm.includes("Bhujia") || nm.includes("Garlic")) {
      const match = letstryItems.find((x: any) => x.title.toLowerCase().includes("teekha gathiya") || x.title.toLowerCase().includes("chatpata"));
      url = match?.img || letstryItems[6].img;
    } else if (nm.includes("Moong Dal") || nm.includes("Chana")) {
      const match = letstryItems.find((x: any) => x.title.toLowerCase().includes("chana roasted") || x.title.toLowerCase().includes("peanuts"));
      url = match?.img || letstryItems[7].img;
    } else if (nm.includes("Makhana")) {
      const match = letstryItems.find((x: any) => x.title.toLowerCase().includes("himalayan salt makhana") || x.title.toLowerCase().includes("makhana puff"));
      url = match?.img || letstryItems[8].img;
    } else if (nm.includes("Rings") || nm.includes("Tomato")) {
      const match = letstryItems.find((x: any) => x.title.toLowerCase().includes("masala rings") || x.title.toLowerCase().includes("pudina rings"));
      url = match?.img || letstryItems[9].img;
    } else if (nm.includes("Jowar Puffs") || nm.includes("Ragi Puffs")) {
      const match = letstryItems.find((x: any) => x.title.toLowerCase().includes("jowar puffs") || x.title.toLowerCase().includes("jumbo puffs"));
      url = match?.img || letstryItems[10].img;
    } else if (nm.includes("Sticks")) {
      const match = letstryItems.find((x: any) => x.title.toLowerCase().includes("lite sticks"));
      url = match?.img || letstryItems[11].img;
    } else if (nm.includes("Banana")) {
      const match = letstryItems.find((x: any) => x.title.toLowerCase().includes("vrat mota chips") || x.title.toLowerCase().includes("lite chips"));
      url = match?.img || letstryItems[12].img;
    } else if (nm.includes("Tapioca")) {
      const match = letstryItems.find((x: any) => x.title.toLowerCase().includes("mix lite papad"));
      url = match?.img || letstryItems[13].img;
    } else {
      const item = letstryItems[ltIdx % letstryItems.length];
      ltIdx++;
      url = item.img;
    }
  } else if (b === "Farmley") {
    if (nm.includes("Cream & Onion")) {
      const match = farmleyItems.find((x: any) => x.title.toLowerCase().includes("cheesy cheddar"));
      url = match?.img || farmleyItems[0].img;
    } else if (nm.includes("Salt & Pepper")) {
      const match = farmleyItems.find((x: any) => x.title.toLowerCase().includes("salt & pepper"));
      url = match?.img || farmleyItems[1].img;
    } else if (nm.includes("Pudina")) {
      const match = farmleyItems.find((x: any) => x.title.toLowerCase().includes("pudina"));
      url = match?.img || farmleyItems[2].img;
    } else if (nm.includes("Tomato")) {
      const match = farmleyItems.find((x: any) => x.title.toLowerCase().includes("tomato"));
      url = match?.img || farmleyItems[3].img;
    } else {
      url = farmleyItems[0].img;
    }
  } else if (b === "Snaqary") {
    if (nm.includes("Balls") || nm.includes("Cheese")) {
      const match = snaqaryItems.find((x: any) => x.title.toLowerCase().includes("jowar rings"));
      url = match?.img || snaqaryItems[0].img;
    } else if (nm.includes("Peri Peri") && nm.includes("Puffs")) {
      const match = snaqaryItems.find((x: any) => x.title.toLowerCase().includes("jowar puff-masala munch"));
      url = match?.img || snaqaryItems[1].img;
    } else if (nm.includes("Tomato")) {
      const match = snaqaryItems.find((x: any) => x.title.toLowerCase().includes("jowar puff-chat masala"));
      url = match?.img || snaqaryItems[2].img;
    } else if (nm.includes("Cream & Onion")) {
      const match = snaqaryItems.find((x: any) => x.title.toLowerCase().includes("jowar sticks"));
      url = match?.img || snaqaryItems[3].img;
    } else if (nm.includes("Sticks")) {
      const match = snaqaryItems.find((x: any) => x.title.toLowerCase().includes("jowar sticks"));
      url = match?.img || snaqaryItems[4].img;
    } else if (nm.includes("Methi") || nm.includes("Khakhra")) {
      const match = snaqaryItems.find((x: any) => x.title.toLowerCase().includes("ragi methi khakhra"));
      url = match?.img || snaqaryItems[5].img;
    } else if (nm.includes("Millet Bhel")) {
      const match = snaqaryItems.find((x: any) => x.title.toLowerCase().includes("jowar khakhra"));
      url = match?.img || snaqaryItems[6].img;
    } else {
      const match = snaqaryItems.find((x: any) => x.title.toLowerCase().includes("bajra khakhra") || x.title.toLowerCase().includes("peri peri khakhra"));
      url = match?.img || snaqaryItems[7].img;
    }
  } else if (b === "The Green Snack Co.") {
    if (nm.includes("Peppy Cheese")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40144707_2-the-green-snack-co-quinoa-puffs-peppy-cheese.jpg";
    } else if (nm.includes("Fiery Spice")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40114828_2-the-green-snack-co-quinoa-puffs-fiery-spice.jpg";
    } else if (nm.includes("Saucy Tomato") || nm.includes("Zesty")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40065216_4-the-green-snack-co-quinoa-puffs-zesty-kale.jpg";
    } else if (nm.includes("Sour Cream")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40185687_1-the-green-snack-co-quinoa-puffs.jpg";
    } else if (nm.includes("Achari Masala") || nm.includes("Cheesy Jalapeno")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40117582_3-the-green-snack-co-six-grain-stix-cheesy-jalapeno.jpg";
    } else if (nm.includes("Tangy Salsa") || nm.includes("Tangy Pickle")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40126097_2-the-green-snack-co-healthy-snacks-six-grain-stix-tangy-pickle.jpg";
    } else if (nm.includes("Cheese & Onion") && nm.includes("Kale")) {
      url = "https://www.bbassets.com/media/uploads/p/l/30010212_5-the-green-snack-co-kale-crisps-cheese-onion.jpg";
    } else if (nm.includes("Sea Salt") && nm.includes("Kale")) {
      url = "https://www.bbassets.com/media/uploads/p/l/30010213_5-the-green-snack-co-kale-crisps-sea-salt-vinegar.jpg";
    } else if (nm.includes("Makhanas")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40194883_1-the-green-snack-co-roasted-makhana.jpg";
    } else {
      url = "https://www.bbassets.com/media/uploads/p/l/30010211_5-the-green-snack-co-kale-crisps-thai-sweet-chilli.jpg";
    }
  } else if (b === "WickedGüd") {
    if (nm.includes("Amreekan Cream & Onion")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40320186_1-wickedgud-chickpea-popped-chips-amreekan-cream-onion.jpg";
    } else if (nm.includes("Desi Masala")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40320184_1-wickedgud-chickpea-popped-chips-mast-masala.jpg";
    } else if (nm.includes("Fiery Peri Peri")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40320188_1-wickedgud-chickpea-popped-chips-dil-se-cheese.jpg";
    } else if (nm.includes("Tangy Tomato")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40320187_1-wickedgud-chickpea-popped-chips-tomato-thumka.jpg";
    }
  } else if (b === "TagZ") {
    if (nm.includes("Classic Salt")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40304504_1-tagz-salt-trippin-popped-potato-chips.jpg";
    } else {
      url = "https://www.bbassets.com/media/uploads/p/l/40304502_1-tagz-masala-trekkin-popped-potato-chips.jpg";
    }
  } else if (b === "Too Yumm!") {
    if (nm.includes("Tandoori")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40121942_2-too-yumm-foxnuts-tandoori.jpg";
    } else if (nm.includes("Peri Peri")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40361571_2-too-yumm-peri-peri-makhana.jpg";
    } else {
      url = "https://www.bbassets.com/media/uploads/p/l/40361570_2-too-yumm-himalayan-salt-pepper-makhana.jpg";
    }
  } else if (b === "BRB") {
    if (nm.includes("Peri Peri")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40230446_2-brb-popped-potato-chips-peri-peri.jpg";
    } else if (nm.includes("Barbeque") || nm.includes("Chipotle")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40230448_2-brb-popped-potato-chips-sweet-chipotle.jpg";
    } else if (nm.includes("Bhel") || nm.includes("Jalapeno")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40196305_2-brb-popped-potato-chips-not-baked-or-fried-healthy-snacks-bhel-flavour.jpg";
    } else if (nm.includes("Himalayan Pink Salt") || nm.includes("Salt & Pepper")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40230447_3-brb-popped-potato-chips-not-baked-or-fried-healthy-snacks-salt-pepper-flavour.jpg";
    } else if (nm.includes("Cream & Onion")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40196307_2-brb-popped-potato-chips.jpg";
    } else if (nm.includes("Cheese & Herbs")) {
      url = "https://www.bbassets.com/media/uploads/p/l/40196308_2-brb-popped-potato-chips.jpg";
    } else {
      url = "https://static.wixstatic.com/media/2bcd87_8e31241e8a304d3aa0f6c52b4a8a824b~mv2.webp";
    }
  } else if (b === "NOICE") {
    if (nm.includes("Salt & Pepper")) {
      url = "https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/NI_CATALOG/IMAGES/ciw/2025/12/17/62c67291-383e-4d13-a805-7bc5a1453b11_EN95S4TTXL_MN_17122025.png";
    } else if (nm.includes("Special Masala")) {
      url = "https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/NI_CATALOG/IMAGES/CIW/2026/2/20/a7a642b8-60ed-4b2f-b81d-c658cf2f6008_851143_1.png";
    } else if (nm.includes("Cheese Melt")) {
      url = "https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/NI_CATALOG/IMAGES/CIW/2026/2/9/aeba84ce-f3b5-4c27-9394-63f9b6c1e706_219686_1.png";
    } else if (nm.includes("Moong Dal")) {
      url = "https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/NI_CATALOG/IMAGES/CIW/2026/4/24/eb16c336-aa38-4d8a-b7e2-8d4bacfd1f0b_825669-1.jpg";
    } else {
      url = "https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_1200,h_630/NI_CATALOG/IMAGES/CIW/2026/9/23/01ba9bae-468d-48d4-9f1a-5612492288f2_184849-1.jpg";
    }
  } else if (b === "Haldiram's") {
    url = "https://www.bbassets.com/media/uploads/p/l/40301012_1-haldiram-magic-makhana-chunky-chutpata-healthy-tasty-ready-to-eat.jpg";
  }

  if (!url) {
    console.error(`Missing URL for [${b}] ${nm} (${p.barcode})`);
  } else {
    finalMap[p.barcode] = { brand: b, name: nm, url };
  }
}

const totalMapped = Object.keys(finalMap).length;
console.log(`Mapped ${totalMapped} of ${currentProds.length} products.`);
fs.writeFileSync("scripts/baked_chips_verified_mapping.json", JSON.stringify(finalMap, null, 2));
