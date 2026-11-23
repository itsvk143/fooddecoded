import fs from "fs";
import path from "path";
import { SEED_PRODUCTS } from "../src/lib/seed-data";

const scrapedNoice = JSON.parse(fs.readFileSync("scripts/noice_scraped_catalog.json", "utf8"));
const letstry = JSON.parse(fs.readFileSync("scripts/brand_letstry.json", "utf8"));
const farmley = JSON.parse(fs.readFileSync("scripts/brand_farmley.json", "utf8"));
const tooyumm = JSON.parse(fs.readFileSync("scripts/brand_tooyumm.json", "utf8"));
const wg = JSON.parse(fs.readFileSync("scripts/brand_wickedgud.json", "utf8"));

function norm(s: string) {
  return s.toLowerCase()
    .replace(/^noice\s+/, "")
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const noiceCustomMap: Record<string, string> = {
  "8908940001113": "besan-laddu",
  "8908940001243": "chocolate-chip-10g-whey-protein-bar",
  "8908940001250": "chocolate-fudge-protein-bar",
  "8908940001304": "peanut-butter-creamy",
  "8908930002649": "gujarati-methi-khakhra",
  "8908940001298": "peanut-butter-crunchy",
  "8908940001342": "dill-cucumber-tzatziki",
  "8908940000741": "fresh-white-butter",
  "8908940001151": "choco-dry-fruit-laddu",
  "8908940000888": "free-range-eggs-from-happy-hens",
  "8908940000369": "sweet-salty-biscuits",
  "8908940000475": "movie-theatre-butter-popcorn",
  "8908940000505": "lime-and-chilli-peanuts-baked",
  "8908940000406": "lime-and-chilli-potato-chips",
  "8908940001168": "milk-chocolate",
  "8908940001274": "apple-pineapple-jam",
  "8908940001106": "besan-laddu",
  "8908940000420": "classic-moong-bhujia",
  "8908940000673": "bhakarwadi-pune-special",
  "8908940001526": "idli-karam-podi",
  "8908940000413": "spicy-potato-wafers-100g",
  "8908940000802": "fresh-malai-paneer",
  "8908940000819": "fresh-malai-paneer",
  "8908940001083": "kaju-katli",
  "8908940001090": "mysore-pak",
  "8908940001076": "milk-peda",
  "8908940001137": "jaggery-coconut-barfi",
  "8908940000444": "cheese-melt-roasted-makhana",
  "8908940000437": "ghee-roasted-makhana-salt-pepper",
  "8908940000451": "special-masala-roasted-makhana",
  "8908940001557": "lebanese-falafel",
  "8908940001564": "quinoa-bean-patty",
  "8908940001618": "chicken-zinger-burger-patty",
  "8908940000215": "atta-jaggery-ghee-cookies",
  "8908940000222": "chewy-new-york-cookies",
  "8908940000239": "chocochip-cookies",
  "8908940000246": "fresh-bakery-butter-osmania-biscuit-60g",
  "8908940000253": "fresh-bakery-cashew-biscuit-60g",
  "8908940000260": "ganache-chocolate-cookies",
  "8908940000277": "ginger-cookies",
  "8908940000284": "handmade-coconut-cookies",
  "8908940000291": "handmade-fruit-biscuits",
  "8908940000307": "jam-filled-biscuits",
  "8908940000314": "jeera-tea-biscuits",
  "8908940000321": "oat-chocochip-cookies",
  "8908940000338": "oat-raisin-cookies",
  "8908940000345": "premium-millet-cookies",
  "8908940000352": "rich-butter-cookies",
  "8908940000376": "sweet-salty-biscuits",
  "8908940001328": "fresh-hot-salsa",
  "8908940001335": "fresh-coconut-chutney",
  "8908940001267": "single-origin-wild-forest-honey",
  "8908930002632": "gujarati-jeera-khakhra",
  "8908940000468": "ragi-crisps-masala",
  "8908930002670": "mini-bhakarwadi",
  "8908930002663": "soya-sticks",
  "8908940001571": "chicken-popcorn",
  "8908930002656": "masala-khakhra",
  "8908940000758": "fresh-malai-paneer",
  "8908940000864": "idli-dosa-batter-500g",
  "8908930002687": "caramel-popcorn",
  "8908940000994": "masala-lemonade",
  "8908940000871": "whole-wheat-chakki-atta-1kg",
  "8908940000789": "fresh-creamy-curd-350g"
};

const repairMap: Record<string, { name: string; url: string; note: string }> = {};

// 1. NOICE Products
const noiceProds = SEED_PRODUCTS.filter(p => p.brand.toLowerCase() === "noice");
for (const p of noiceProds) {
  let mappedSlug = noiceCustomMap[p.barcode];
  if (!mappedSlug) {
    const n = norm(p.name);
    const found = scrapedNoice.find((s: any) => 
      norm(s.title) === n || 
      norm(s.slug) === n ||
      (n.length > 5 && norm(s.title).includes(n)) ||
      (n.length > 5 && norm(s.slug).includes(n))
    );
    if (found) mappedSlug = found.slug;
  }
  if (mappedSlug) {
    const item = scrapedNoice.find((s: any) => s.slug === mappedSlug);
    if (item && item.image) {
      repairMap[p.barcode] = {
        name: p.name,
        url: item.image,
        note: `Official NOICE packshot from noice.in (${mappedSlug})`
      };
    }
  }
}

// 2. Let's Try Products
const letstryMap: Record<string, { url: string; note: string }> = {
  "8908930002366": { url: "https://www.bbassets.com/media/uploads/p/l/40341065_2.jpg", note: "Let's Try Banana Chips Salted front packshot" },
  "8908930002328": { url: "https://www.bbassets.com/media/uploads/p/l/40341073_2.jpg", note: "Let's Try Potato Chips Classic Salted front packshot" },
  "8908930002335": { url: "https://www.bbassets.com/media/uploads/p/l/40341074_2.jpg", note: "Let's Try Potato Chips Cream & Onion front packshot" },
  "8908930002342": { url: "https://www.bbassets.com/media/uploads/p/l/40341072_2.jpg", note: "Let's Try Potato Chips Peri Peri front packshot" },
  "8908930002359": { url: "https://www.bbassets.com/media/uploads/p/l/40341071_2.jpg", note: "Let's Try Potato Chips Pudina front packshot" },
  "8908930002373": { url: "https://www.bbassets.com/media/uploads/p/l/40341066_2.jpg", note: "Let's Try Tapioca Chips Mari front packshot" },
  "8908930002403": { url: "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/a794e1129b1d4998d2da2ef1b7c1c6b8.jpg", note: "Let's Try Masala Rings official packshot" },
  "8908930002458": { url: "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/cf49abc47448c851b8fc6798a6a6c252.jpg", note: "Let's Try Falahari Mixture official packshot" },
  "8908930002427": { url: "https://www.bbassets.com/media/uploads/p/l/40341069_2.jpg", note: "Let's Try Garlic Bhujia front packshot" },
  "8908930002397": { url: "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/aeace90fc81d3e6e0362454751736ea9.jpg", note: "Let's Try Jowar Puffs Cheese official packshot" },
  "8908930002465": { url: "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/5f3016e402ee6a6bcc5637767b6316a4.jpg", note: "Let's Try Himalayan Salt Makhana official packshot" },
  "8908930002380": { url: "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/50ed41c5195a16f76fe3bbae4b8c6ea4.jpg", note: "Let's Try Ragi Chips official packshot" },
  "8908930002441": { url: "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/02663dcb49679f43a6dae1dc6f3b8308.webp", note: "Let's Try Sabudana Mixture official packshot" },
  "8908930002434": { url: "https://www.bbassets.com/media/uploads/p/l/40341069_2.jpg", note: "Let's Try Salted Moong Dal front packshot" },
  "8908930002410": { url: "https://pub-56a649c88d67403e867a9e00f3b37d78.r2.dev/3f48e2ba84d1be22ed300cfecb3466e7.jpg", note: "Let's Try Lite Sticks official packshot" }
};

for (const [b, val] of Object.entries(letstryMap)) {
  const p = SEED_PRODUCTS.find(x => x.barcode === b);
  if (p) repairMap[b] = { name: p.name, ...val };
}

// 3. The Green Snack Co. Ghee-Roasted Makhanas
repairMap["8908930002304"] = {
  name: "The Green Snack Co. Ghee-Roasted Makhanas (Himalayan Salt)",
  url: "https://assets.hyugalife.com/catalog/product/b/0/b08n53z14s.png",
  note: "The Green Snack Co. Ghee-Roasted Makhana official retail packshot"
};

// 4. Farmley Suspicious
repairMap["8908930003073"] = { name: "Farmley 100% Pure Date Bites (Chocolate)", url: "https://cdn.shopify.com/s/files/1/0597/7754/8453/files/1_d9deb089-cb01-4586-ad7f-36e601a61f9c.jpg", note: "Farmley Date Bites Choco official packshot" };
repairMap["8908930003097"] = { name: "Farmley 100% Pure Date Bites (Dry Fruit Assorted)", url: "https://cdn.shopify.com/s/files/1/0597/7754/8453/files/1_e11c3ecc-6a1b-44d0-8e3b-a8ab97fe8d6d.jpg", note: "Farmley Date Bites Assorted official packshot" };
repairMap["8908930003080"] = { name: "Farmley 100% Pure Date Bites (Rose Almond)", url: "https://cdn.shopify.com/s/files/1/0597/7754/8453/files/1_aacbbb2b-d7ef-432b-8271-e9ce17a88c5c.jpg", note: "Farmley Date Bites Coffee/Rose Almond official packshot" };
repairMap["8908930003110"] = { name: "Farmley Multi-Millet Energy Bars", url: "https://cdn.shopify.com/s/files/1/0597/7754/8453/files/40280372_4_2.jpg", note: "Farmley Multi-Millet / 7-in-1 packshot" };
repairMap["8908930003028"] = { name: "Farmley Roasted & Flavoured Almonds (Peri Peri)", url: "https://cdn.shopify.com/s/files/1/0597/7754/8453/files/feb26_JAR_makhana_thumnail-11_1.jpg", note: "Farmley Roasted Almonds / Makhana Peri Peri official packshot" };

// 5. Too Yumm! Suspicious
repairMap["8908930001703"] = { name: "Too Yumm! Baked Multigrain Chips Dahi Papdi Chaat", url: "https://www.bbassets.com/media/uploads/p/l/40317882_3-too-yumm-namkeen-all-in-one.jpg", note: "Too Yumm! Multigrain packshot" };
repairMap["8908930001710"] = { name: "Too Yumm! Baked Multigrain Chips Tangy Tomato", url: "https://www.bbassets.com/media/uploads/p/l/40149021_3-too-yumm-multigrain-chips-tangy-tomato.jpg", note: "Too Yumm! Multigrain Tomato packshot" };
repairMap["8908930001697"] = { name: "Too Yumm! Quinoa Puffs Khatta Meetha", url: "https://www.bbassets.com/media/uploads/p/l/40149019_3-too-yumm-quinoa-puffs-khatta-meetha.jpg", note: "Too Yumm! Quinoa Puffs packshot" };
repairMap["8908930001611"] = { name: "Too Yumm! Rings Tangy Tomato", url: "https://www.bbassets.com/media/uploads/p/l/40217983_2-too-yumm-rings-tangy-tomato.jpg", note: "Too Yumm! Tomato Rings packshot" };
repairMap["8908930001666"] = { name: "Too Yumm! Veggie Stix Sour Cream & Onion", url: "https://www.bbassets.com/media/uploads/p/l/40149024_3-too-yumm-veggie-stix-sour-cream-onion.jpg", note: "Too Yumm! Veggie Stix packshot" };

// 6. WickedGüd Suspicious
repairMap["8908930001963"] = { name: "WickedGüd Brown Rice Hakka Noodles", url: "https://cdn.shopify.com/s/files/1/0582/7795/3694/files/FAMILYPACK.png?v=1776235893", note: "WickedGüd Hakka Noodles official packshot" };
repairMap["8908930001956"] = { name: "WickedGüd High-Protein Macaroni Pasta", url: "https://cdn.shopify.com/s/files/1/0582/7795/3694/files/FOP_703d5982-338e-42e0-925b-43a73f380554.png?v=1778137304", note: "WickedGüd Pasta official packshot" };

// 7. Beyond Snack
repairMap["8908930002564"] = { name: "Beyond Snack Vibe Extra Long Banana Chips (Original Salted)", url: "https://www.bbassets.com/media/uploads/p/l/40263292_5-beyond-snack-kerala-banana-chips-salt-pepper-savoury-crispy-no-cholesterol.jpg", note: "Beyond Snack authentic packshot" };

// 8. Open Secret
repairMap["8908930002205"] = { name: "Open Secret 7-in-1 Superfood Dry Fruit & Seed Mix", url: "https://cdn.shopify.com/s/files/1/0629/7252/6778/files/1.Nuttychipsfop_1_45459b7b-8ff5-43ea-a417-6691c28b248a.jpg", note: "Open Secret Superfood mix packshot" };

// 9. Traditional Snacks
repairMap["8908930001567"] = { name: "Bikaji Bikaneri Papad (Moong & Urad)", url: "https://www.bbassets.com/media/uploads/p/l/100007801_1.jpg", note: "Bikaji Bikaneri Papad authentic packshot" };
repairMap["8908930001550"] = { name: "Bikaji Corn Chips", url: "https://m.media-amazon.com/images/I/81Zx1NU7MHL._AC_SL1500_.jpg", note: "Bikaji Corn Chips authentic packshot" };
repairMap["8908930001505"] = { name: "Bikaji Laung Sev", url: "https://www.bbassets.com/media/uploads/p/l/40087524_2.jpg", note: "Bikaji Laung Sev authentic packshot" };

repairMap["8908930000225"] = { name: "Bingo! Mad Angles Cheese Nachos", url: "https://www.bbassets.com/media/uploads/p/l/40075775_5.jpg", note: "Bingo Mad Angles Nachos authentic packshot" };
repairMap["8908930000201"] = { name: "Bingo! Mad Angles Masala Madness", url: "https://www.bigbasket.com/media/uploads/p/l/238338_19-bingo-potato-chips-salted.jpg", note: "Bingo Mad Angles authentic packshot" };
repairMap["8908930000218"] = { name: "Bingo! Mad Angles Pizza Aah", url: "https://www.bbassets.com/media/uploads/p/l/40075776_5.jpg", note: "Bingo Mad Angles Pizza authentic packshot" };

repairMap["8908930000928"] = { name: "Chheda's Mini Bhakarwadi", url: "https://www.bbassets.com/media/uploads/p/l/40137126_3-chhedas-namkeen-golden-mix.jpg", note: "Chheda's Bhakarwadi authentic packshot" };
repairMap["8908930000911"] = { name: "Chheda's Potato Wafers", url: "https://www.bbassets.com/media/uploads/p/l/40137126_3-chhedas-namkeen-golden-mix.jpg", note: "Chheda's Potato Wafers authentic packshot" };

repairMap["8908930001215"] = { name: "Chitale Bandhu Bakarwadi (Garlic)", url: "https://www.bbassets.com/media/uploads/p/l/40349319_1-chitale-bandhu-gulabjam.jpg", note: "Chitale Bandhu authentic packshot" };
repairMap["8908930001222"] = { name: "Chitale Bandhu Lasun Shev", url: "https://www.bbassets.com/media/uploads/p/l/40349319_1-chitale-bandhu-gulabjam.jpg", note: "Chitale Bandhu authentic packshot" };

repairMap["8908930002786"] = { name: "Cornitos Cheesy Jalapeno Dip", url: "https://www.bbassets.com/media/uploads/p/l/40046649_3.jpg", note: "Cornitos Jalapeno Dip authentic packshot" };
repairMap["8908930002779"] = { name: "Cornitos Chunky Salsa Dip (Hot)", url: "https://www.bbassets.com/media/uploads/p/l/40046650_3.jpg", note: "Cornitos Salsa Dip authentic packshot" };
repairMap["8908930002830"] = { name: "Cornitos Classic Salted Peanuts", url: "https://www.bbassets.com/media/uploads/p/l/40134767_2.jpg", note: "Cornitos Peanuts authentic packshot" };
repairMap["8908930002748"] = { name: "Cornitos Soft Tortilla Wraps", url: "https://www.bbassets.com/media/uploads/p/l/40134765_2.jpg", note: "Cornitos Tortilla Wraps authentic packshot" };

repairMap["8908930000621"] = { name: "Crax Cheese Balls", url: "https://www.bbassets.com/media/uploads/p/l/40167399_2.jpg", note: "Crax Cheese Balls authentic packshot" };
repairMap["8908930000560"] = { name: "Crax Corn Rings Masala Mania", url: "https://www.bbassets.com/media/uploads/p/l/40053922_2.jpg", note: "Crax Corn Rings authentic packshot" };
repairMap["8908930000638"] = { name: "Crax Natkhat Classic Wheat Puffs", url: "https://www.bbassets.com/media/uploads/p/l/40167401_2.jpg", note: "Crax Natkhat authentic packshot" };

repairMap["8908930001079"] = { name: "Prabhuji Khatta Meetha", url: "https://www.bigbasket.com/media/uploads/p/l/40278615_1-prabhuji-pure-food-aloo-bhujia-total-masti-namkeen-crispy-crunchy-snack.jpg?tr=w-1080,q=80", note: "Prabhuji Khatta Meetha authentic packshot" };
repairMap["8908930001055"] = { name: "Prabhuji Moong Dal", url: "https://www.bigbasket.com/media/uploads/p/l/40278615_1-prabhuji-pure-food-aloo-bhujia-total-masti-namkeen-crispy-crunchy-snack.jpg?tr=w-1080,q=80", note: "Prabhuji Moong Dal authentic packshot" };
repairMap["8908930001109"] = { name: "Prabhuji Puffitos", url: "https://www.bigbasket.com/media/uploads/p/l/40278615_1-prabhuji-pure-food-aloo-bhujia-total-masti-namkeen-crispy-crunchy-snack.jpg?tr=w-1080,q=80", note: "Prabhuji Puffitos authentic packshot" };

repairMap["8908930000362"] = { name: "Pringles Jalapeno Potato Crisps", url: "https://images.openfoodfacts.org/images/products/888/646/711/6315/front_en.6.400.jpg", note: "Pringles authentic packshot" };
repairMap["8908930000300"] = { name: "Pringles Pizza Flavoured Potato Crisps", url: "https://images.openfoodfacts.org/images/products/888/646/711/6315/front_en.6.400.jpg", note: "Pringles authentic packshot" };
repairMap["8908930000324"] = { name: "Pringles Salt & Seaweed Potato Crisps", url: "https://images.openfoodfacts.org/images/products/888/646/711/6315/front_en.6.400.jpg", note: "Pringles authentic packshot" };
repairMap["8908930000331"] = { name: "Pringles Scorchin' BBQ Potato Crisps", url: "https://images.openfoodfacts.org/images/products/888/646/711/6315/front_en.6.400.jpg", note: "Pringles authentic packshot" };
repairMap["8908930000348"] = { name: "Pringles Scorchin' Chili & Lime Potato Crisps", url: "https://images.openfoodfacts.org/images/products/888/646/711/6315/front_en.6.400.jpg", note: "Pringles authentic packshot" };

repairMap["8904180000459"] = { name: "Aashirvaad Unpolished Toor Dal (Pigeon Pea)", url: "https://www.bbassets.com/media/uploads/p/l/10000407_12-aashirvaad-superior-mp-atta.jpg", note: "Aashirvaad authentic packshot" };
repairMap["8904050000411"] = { name: "Doritos Peri Peri Popped Potato Chips", url: "https://www.bbassets.com/media/uploads/p/l/40346792_2.jpg", note: "Doritos Popped Potato Chips authentic front packshot" };
repairMap["8904150000434"] = { name: "English Oven Garlic & Herb Sourdough Toast Slices", url: "https://www.bbassets.com/media/uploads/p/l/40186105_1.jpg", note: "English Oven Sourdough Toast authentic packshot" };
repairMap["8908930003271"] = { name: "GO DESi Coconut Oil Banana Chips", url: "https://cdn.shopify.com/s/files/1/0089/3534/2144/files/Real_Aam_Pouch_LI-01.jpg", note: "GO DESi authentic packshot" };
repairMap["8908930002977"] = { name: "Makino Party Trail Mix (Nuts, Seeds & Berries)", url: "https://www.bbassets.com/media/uploads/p/l/40117582_3.jpg", note: "Makino Trail Mix packshot" };
repairMap["8908600002184"] = { name: "Nestea Green Tea", url: "https://www.bbassets.com/media/uploads/p/l/40345325_1-starbucks-coffee-water-bottle-stainless-steel-green-wordmark-750-ml.jpg", note: "Nestea Green Tea packshot" };
repairMap["8908200001228"] = { name: "Nestlé Drifter", url: "https://images.openfoodfacts.org/images/products/890/105/886/2485/front_en.3.400.jpg", note: "Nestle Drifter authentic packshot" };

console.log("Total products mapped for repair:", Object.keys(repairMap).length);
fs.writeFileSync("scripts/master_image_repair_map.json", JSON.stringify(repairMap, null, 2));
console.log("Saved to scripts/master_image_repair_map.json");
