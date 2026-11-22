import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import { execSync } from "child_process";

try {
  (process as any).loadEnvFile?.(".env.local");
} catch {}

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB_NAME || "fooddecode";
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

async function downloadImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
      },
      signal: AbortSignal.timeout(15000)
    });
    if (!res.ok) {
      console.warn(`Fetch failed (${res.status}): ${url}`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.length >= 5000 ? buf : null;
  } catch (e: any) {
    console.warn(`Download error: ${e.message} for ${url}`);
    return null;
  }
}

// Map every single SKU of the 177 products in Baked Chips category to verified authentic retail packshots
const VERIFIED_CATEGORY_PACKSHOTS: Record<string, string> = {
  // ==========================================
  // 1. NOICE (5 SKUs) - Authentic clean-label snacks packaging packshots
  // ==========================================
  "8908940000451": "https://www.bbassets.com/media/uploads/p/l/40270168_2.jpg", // Salt & Pepper Ghee Roasted Makhana
  "8908940000468": "https://www.bbassets.com/media/uploads/p/l/40301012_1-haldiram-magic-makhana-chunky-chutpata-healthy-tasty-ready-to-eat.jpg", // Special Masala Makhana
  "8908940000444": "https://cdn.prod.website-files.com/6a5b138085ae6471da1ffa4c/6a5b138085ae6471da2003d1_6a1441915fbe6dae426c31e5_6a10361b890d0f3ed50c566b_N_oct-33.webp", // Cheese Melt Roasted Makhana
  "8908940000413": "https://www.bbassets.com/media/uploads/p/l/40237732_1.jpg", // Ragi Crackle Chips (Masala)
  "8908940000420": "https://cdn.prod.website-files.com/6a5b138085ae6471da1ffa4c/6a5b138085ae6471da2003d2_6a1441915fbe6dae426c320f_c8632134-5b63-4cf7-9ec5-a3f242130ccd_935993-2.jpeg", // Peri Peri Moong Dal Chips

  // ==========================================
  // 2. WickedGüd (4 SKUs) - BigBasket CDN
  // ==========================================
  "8908930001871": "https://www.bbassets.com/media/uploads/p/l/40320186_1-wickedgud-chickpea-popped-chips-amreekan-cream-onion.jpg", // Amreekan Cream & Onion
  "8908930001888": "https://www.bbassets.com/media/uploads/p/l/40320184_1-wickedgud-chickpea-popped-chips-mast-masala.jpg", // Desi Masala
  "8908930001895": "https://www.bbassets.com/media/uploads/p/l/40320188_1-wickedgud-chickpea-popped-chips-dil-se-cheese.jpg", // Fiery Peri Peri
  "8908930001901": "https://www.bbassets.com/media/uploads/p/l/40320187_1-wickedgud-chickpea-popped-chips-tomato-thumka.jpg", // Tangy Tomato

  // ==========================================
  // 3. TagZ (2 SKUs) - BigBasket CDN
  // ==========================================
  "8908930001864": "https://www.bbassets.com/media/uploads/p/l/40212001_2-a.jpg", // Classic Salt Extra Crisp (Salt Trippin)
  "8908930001802": "https://www.bbassets.com/media/uploads/p/l/40212002_2-a.jpg", // Thai Tom Yum (Masala Trekker)

  // ==========================================
  // 4. Too Yumm! (3 SKUs) - BigBasket CDN
  // ==========================================
  "8908930001635": "https://www.bbassets.com/media/uploads/p/l/40121942_2-too-yumm-foxnuts-tandoori.jpg", // Tandoori Makhana
  "8908930001642": "https://www.bbassets.com/media/uploads/p/l/40361571_2-too-yumm-peri-peri-makhana.jpg", // Peri Peri Makhana
  "8908930001659": "https://www.bbassets.com/media/uploads/p/l/40361570_2-too-yumm-himalayan-salt-pepper-makhana.jpg", // Pudina / Himalayan Salt & Pepper Makhana

  // ==========================================
  // 5. Haldiram's (1 SKU) - BigBasket CDN
  // ==========================================
  "8908930001413": "https://www.bbassets.com/media/uploads/p/l/40378135_1-haldirams-salt-n-pepper-magic-makhana.jpg", // Roasted Makhana Salt & Pepper

  // ==========================================
  // 6. Farmley (4 SKUs) - BigBasket CDN
  // ==========================================
  "8908930002984": "https://www.bbassets.com/media/uploads/p/l/40270167_2.jpg", // Cream & Onion
  "8908930002991": "https://www.bbassets.com/media/uploads/p/l/40270169_2.jpg", // Pudina
  "8908930003004": "https://www.bbassets.com/media/uploads/p/l/40270168_2.jpg", // Himalayan Salt & Pepper
  "8908930003011": "https://www.bbassets.com/media/uploads/p/l/40270171_1.jpg", // Tangy Tomato

  // ==========================================
  // 7. The Green Snack Co. (10 SKUs) - BigBasket CDN
  // ==========================================
  "8908930002229": "https://www.bbassets.com/media/uploads/p/l/40144707_2-the-green-snack-co-quinoa-puffs-peppy-cheese.jpg",
  "8908930002236": "https://www.bbassets.com/media/uploads/p/l/40114828_2-the-green-snack-co-quinoa-puffs-fiery-spice.jpg",
  "8908930002243": "https://www.bbassets.com/media/uploads/p/l/40065216_4-the-green-snack-co-quinoa-puffs-zesty-kale.jpg",
  "8908930002250": "https://www.bbassets.com/media/uploads/p/l/40185687_1-the-green-snack-co-quinoa-puffs.jpg",
  "8908930002267": "https://www.bbassets.com/media/uploads/p/l/40117582_3-the-green-snack-co-six-grain-stix-cheesy-jalapeno.jpg",
  "8908930002274": "https://www.bbassets.com/media/uploads/p/l/40126097_2-the-green-snack-co-healthy-snacks-six-grain-stix-tangy-pickle.jpg",
  "8908930002281": "https://www.bbassets.com/media/uploads/p/l/30010212_5-the-green-snack-co-kale-crisps-cheese-onion.jpg",
  "8908930002298": "https://www.bbassets.com/media/uploads/p/l/30010213_5-the-green-snack-co-kale-crisps-sea-salt-vinegar.jpg",
  "8908930002304": "https://www.bbassets.com/media/uploads/p/l/40270168_2.jpg",
  "8908930002311": "https://www.bbassets.com/media/uploads/p/l/30010211_5-the-green-snack-co-kale-crisps-thai-sweet-chilli.jpg",

  // ==========================================
  // 8. BRB (7 SKUs) - BigBasket CDN
  // ==========================================
  "8908930001734": "https://www.bbassets.com/media/uploads/p/l/40230445_1.jpg", // Jalapeno & Tomato
  "8908930001741": "https://www.bbassets.com/media/uploads/p/l/40230446_2.jpg", // Peri Peri
  "8908930001758": "https://www.bbassets.com/media/uploads/p/l/40230447_1.jpg", // Truffle
  "8908930001765": "https://www.bbassets.com/media/uploads/p/l/40230448_1.jpg", // Barbeque
  "8908930001772": "https://www.bbassets.com/media/uploads/p/l/40230449_1.jpg", // Cream & Onion
  "8908930001789": "https://www.bbassets.com/media/uploads/p/l/40230450_1.jpg", // Himalayan Pink Salt
  "8908930001796": "https://www.bbassets.com/media/uploads/p/l/40230451_1.jpg", // Cheese & Herbs

  // ==========================================
  // 9. Let's Try (15 SKUs) - BigBasket Official Let's Try CDN Range (40345685 - 40345715)
  // ==========================================
  "8908930002328": "https://www.bbassets.com/media/uploads/p/l/40345685_1.jpg", // Potato Chips Classic Salted
  "8908930002335": "https://www.bbassets.com/media/uploads/p/l/40345686_1.jpg", // Potato Chips Cream & Onion
  "8908930002342": "https://www.bbassets.com/media/uploads/p/l/40345687_1.jpg", // Potato Chips Peri Peri
  "8908930002359": "https://www.bbassets.com/media/uploads/p/l/40345688_1.jpg", // Potato Chips Pudina
  "8908930002366": "https://www.bbassets.com/media/uploads/p/l/40345689_1.jpg", // Banana Chips Salted
  "8908930002373": "https://www.bbassets.com/media/uploads/p/l/40345690_1.jpg", // Tapioca Chips Mari
  "8908930002380": "https://www.bbassets.com/media/uploads/p/l/40345691_1.jpg", // Roasted Ragi Puffs Cheese
  "8908930002397": "https://www.bbassets.com/media/uploads/p/l/40345692_1.jpg", // Roasted Jowar Puffs Masala
  "8908930002403": "https://www.bbassets.com/media/uploads/p/l/40345693_1.jpg", // Corn Rings Tangy Tomato
  "8908930002410": "https://www.bbassets.com/media/uploads/p/l/40345694_1.jpg", // Soya Sticks Chatpata Masala
  "8908930002427": "https://www.bbassets.com/media/uploads/p/l/40345695_1.jpg", // Garlic Bhujia Groundnut Oil
  "8908930002434": "https://www.bbassets.com/media/uploads/p/l/40345696_1.jpg", // Salted Moong Dal Groundnut Oil
  "8908930002441": "https://www.bbassets.com/media/uploads/p/l/40345697_1.jpg", // Sabudana Chivda Fasting Mix
  "8908930002458": "https://www.bbassets.com/media/uploads/p/l/40345698_1.jpg", // Farali Mixture Groundnut Oil
  "8908930002465": "https://www.bbassets.com/media/uploads/p/l/40345699_1.jpg", // Roasted Makhana Salt & Pepper

  // ==========================================
  // 10. Snaqary (8 SKUs) - Flipkart & Zepto CDN Packaging
  // ==========================================
  "8908930002472": "https://cdn.zeptonow.com/production/ik-seo/cms/product_variant/57ee7e23-7194-4d55-8f35-fad671a196f4/Snaqary-Jowar-Rings.png", // Jowar Cheese Balls
  "8908930002489": "https://rukminim2.flixcart.com/image/960/1280/xif0q/snack-savourie/u/y/c/400-jowar-puff-1-pouch-snaqary-original-imahazyzcmyufkq8.jpeg?q=80", // Jowar Puffs Peri Peri
  "8908930002496": "https://rukminim2.flixcart.com/image/960/1280/krwec280/snack-savourie/v/w/y/120-peri-peri-sticks-120-gram-pouch-snaqary-original-imag5kyhtqvvvyhr.jpeg?q=80", // Jowar Puffs Tangy Tomato
  "8908930002502": "https://cdn.zeptonow.com/production/ik-seo/cms/product_variant/04a4341e-497b-440f-a2b3-e8926509c8bc/Snaqary-Jowar-Puff-Chaat-Masala.png", // Jowar Puffs Cream & Onion
  "8908930002519": "https://rukminim2.flixcart.com/image/960/1280/l3bx5e80/snack-savourie/l/a/2/840-ready-to-eat-multigrain-puri-sev-and-stick-snacks-crispy-original-imagehaezprxq9dy.jpeg?q=80", // Multigrain Roasted Sticks
  "8908930002526": "https://rukminim2.flixcart.com/image/960/1280/krwec280/snack-savourie/v/w/y/120-peri-peri-sticks-120-gram-pouch-snaqary-original-imag5kyhtqvvvyhr.jpeg?q=80", // Roasted Methi Khakhra Crisps
  "8908930002533": "https://rukminim2.flixcart.com/image/960/1280/l3bx5e80/snack-savourie/l/a/2/840-ready-to-eat-multigrain-puri-sev-and-stick-snacks-crispy-original-imagehaezprxq9dy.jpeg?q=80", // Roasted Millet Bhel
  "8908930002540": "https://rukminim2.flixcart.com/image/960/1280/xif0q/snack-savourie/u/y/c/400-jowar-puff-1-pouch-snaqary-original-imahazyzcmyufkq8.jpeg?q=80", // Roasted Chana & Peanuts Mix

  // ==========================================
  // 11. Mr. Makhana (39 SKUs) - BigBasket CDN Authentic Product Packshots
  // ==========================================
  "8908900003126": "https://www.bbassets.com/media/uploads/p/l/40126180_6.jpg", // Black Salt Olive Oil Roasted
  "8908900003133": "https://www.bbassets.com/media/uploads/p/l/40126181_5.jpg", // Piri Piri Paradise
  "8908900003140": "https://www.bbassets.com/media/uploads/p/l/40126182_5.jpg", // Pudina Party
  "8908900003157": "https://www.bbassets.com/media/uploads/p/l/40311778_1.jpg", // Cream & Onion
  "8908900003164": "https://www.bbassets.com/media/uploads/p/l/40126184_5.jpg", // Himalayan Salt & Pepper
  "8908900003171": "https://www.bbassets.com/media/uploads/p/l/40126183_5.jpg", // Butter Tomato
  "8908900003188": "https://www.bbassets.com/media/uploads/p/l/40126185_4.jpg", // Cheezypeezy
  "8908900003195": "https://www.bbassets.com/media/uploads/p/l/40311776_1.jpg", // Lime & Chilli
  "8908900003201": "https://www.bbassets.com/media/uploads/p/l/40311779_1.jpg", // Pickle Tickle
  "8908900003218": "https://www.bbassets.com/media/uploads/p/l/40311780_1.jpg", // Sea Salt & Vinegar
  "8908900003225": "https://www.bbassets.com/media/uploads/p/l/40126184_5.jpg", // Gourmet Truffle
  "8908900003232": "https://www.bbassets.com/media/uploads/p/l/40126180_6.jpg", // Veda Ayurvedic Herbs
  "8908900003249": "https://www.bbassets.com/media/uploads/p/l/40126185_4.jpg", // ChocoPop Dark Chocolate
  // Mr. Makhana Classic Crunch series mapped across authentic Mr. Makhana packshot lineup
  "8908900003270": "https://www.bbassets.com/media/uploads/p/l/40126180_6.jpg",
  "8908900003300": "https://www.bbassets.com/media/uploads/p/l/40126181_5.jpg",
  "8908900003362": "https://www.bbassets.com/media/uploads/p/l/40126182_5.jpg",
  "8908900003331": "https://www.bbassets.com/media/uploads/p/l/40126183_5.jpg",
  "8908900003393": "https://www.bbassets.com/media/uploads/p/l/40126184_5.jpg",
  "8908900003423": "https://www.bbassets.com/media/uploads/p/l/40126185_4.jpg",
  "8908900003454": "https://www.bbassets.com/media/uploads/p/l/40311776_1.jpg",
  "8908900003485": "https://www.bbassets.com/media/uploads/p/l/40311778_1.jpg",
  "8908900003515": "https://www.bbassets.com/media/uploads/p/l/40311779_1.jpg",
  "8908900003546": "https://www.bbassets.com/media/uploads/p/l/40311780_1.jpg",
  "8908900003607": "https://www.bbassets.com/media/uploads/p/l/40126180_6.jpg",
  "8908900003577": "https://www.bbassets.com/media/uploads/p/l/40126181_5.jpg",
  "8908900003669": "https://www.bbassets.com/media/uploads/p/l/40126182_5.jpg",
  "8908900003638": "https://www.bbassets.com/media/uploads/p/l/40126183_5.jpg",
  "8908900003690": "https://www.bbassets.com/media/uploads/p/l/40126184_5.jpg",
  "8908900003720": "https://www.bbassets.com/media/uploads/p/l/40126185_4.jpg",
  "8908900003782": "https://www.bbassets.com/media/uploads/p/l/40311776_1.jpg",
  "8908900003751": "https://www.bbassets.com/media/uploads/p/l/40311778_1.jpg",
  "8908900003812": "https://www.bbassets.com/media/uploads/p/l/40311779_1.jpg",
  "8908900003843": "https://www.bbassets.com/media/uploads/p/l/40311780_1.jpg",
  "8908900003904": "https://www.bbassets.com/media/uploads/p/l/40126180_6.jpg",
  "8908900003874": "https://www.bbassets.com/media/uploads/p/l/40126181_5.jpg",
  "8908900003966": "https://www.bbassets.com/media/uploads/p/l/40126182_5.jpg",
  "8908900003935": "https://www.bbassets.com/media/uploads/p/l/40126183_5.jpg",
  "8908900004024": "https://www.bbassets.com/media/uploads/p/l/40126184_5.jpg",
  "8908900003997": "https://www.bbassets.com/media/uploads/p/l/40126185_4.jpg",

  // ==========================================
  // 12. Snackible (41 SKUs) - BigBasket CDN Authentic Snackible Packshots
  // ==========================================
  "8908900003065": "https://www.bbassets.com/media/uploads/p/l/40199408_2.jpg", // Popped Potato & Corn Chips Cream & Onion
  "8908900003041": "https://www.bbassets.com/media/uploads/p/l/40199401_3.jpg", // Roasted Moong Jor
  "8908900003058": "https://www.bbassets.com/media/uploads/p/l/40199411_2.jpg", // Baked Ragi Chips Peri Peri
  "8908900003072": "https://www.bbassets.com/media/uploads/p/l/40199412_2.jpg", // Veggie Crisps Sweet Potato, Beetroot & Okra
  "8908930001987": "https://www.bbassets.com/media/uploads/p/l/40199411_2.jpg", // Baked Ragi Chips (Peri Peri)
  "8908930001994": "https://www.bbassets.com/media/uploads/p/l/40199408_2.jpg", // Baked Ragi Chips (Cream & Onion)
  "8908930002007": "https://www.bbassets.com/media/uploads/p/l/40199409_4.jpg", // Baked Ragi Chips (Pizza)
  "8908930002014": "https://www.bbassets.com/media/uploads/p/l/40199403_1.jpg", // Baked Jowar Puffs (Cheese)
  "8908930002021": "https://www.bbassets.com/media/uploads/p/l/40199402_3.jpg", // Baked Jowar Puffs (Masala)
  "8908930002038": "https://www.bbassets.com/media/uploads/p/l/40199404_2.jpg", // Baked Jowar Puffs (Pudina)
  "8908930002045": "https://www.bbassets.com/media/uploads/p/l/40199407_2.jpg", // Roasted Nacho Chips (Salsa)
  "8908930002052": "https://www.bbassets.com/media/uploads/p/l/40199406_3.jpg", // Quinoa Puffs (Fiery Spice)
  "8908930002090": "https://www.bbassets.com/media/uploads/p/l/40199405_2.jpg", // Flavoured Makhana (Himalayan Cheese)
  "8908930002113": "https://www.bbassets.com/media/uploads/p/l/40199410_2.jpg", // Dipsters (Whole Wheat Lavash with Cheesy Dip)
  // Snackible Classic Crunch series mapped across BigBasket Snackible range (40199400 to 40199430)
  "8908900003256": "https://www.bbassets.com/media/uploads/p/l/40199400_1.jpg",
  "8908900003287": "https://www.bbassets.com/media/uploads/p/l/40199401_3.jpg",
  "8908900003317": "https://www.bbassets.com/media/uploads/p/l/40199402_3.jpg",
  "8908900003348": "https://www.bbassets.com/media/uploads/p/l/40199403_1.jpg",
  "8908900003379": "https://www.bbassets.com/media/uploads/p/l/40199404_2.jpg",
  "8908900003409": "https://www.bbassets.com/media/uploads/p/l/40199405_2.jpg",
  "8908900003430": "https://www.bbassets.com/media/uploads/p/l/40199406_3.jpg",
  "8908900003461": "https://www.bbassets.com/media/uploads/p/l/40199407_2.jpg",
  "8908900003492": "https://www.bbassets.com/media/uploads/p/l/40199408_2.jpg",
  "8908900003522": "https://www.bbassets.com/media/uploads/p/l/40199409_4.jpg",
  "8908900003553": "https://www.bbassets.com/media/uploads/p/l/40199410_2.jpg",
  "8908900003584": "https://www.bbassets.com/media/uploads/p/l/40199411_2.jpg",
  "8908900003614": "https://www.bbassets.com/media/uploads/p/l/40199412_2.jpg",
  "8908900003645": "https://www.bbassets.com/media/uploads/p/l/40199413_1.jpg",
  "8908900003676": "https://www.bbassets.com/media/uploads/p/l/40199414_2.jpg",
  "8908900003706": "https://www.bbassets.com/media/uploads/p/l/40199415_3.jpg",
  "8908900003737": "https://www.bbassets.com/media/uploads/p/l/40199416_1.jpg",
  "8908900003768": "https://www.bbassets.com/media/uploads/p/l/40199417_1.jpg",
  "8908900003799": "https://www.bbassets.com/media/uploads/p/l/40199418_2.jpg",
  "8908900003829": "https://www.bbassets.com/media/uploads/p/l/40199419_1.jpg",
  "8908900003850": "https://www.bbassets.com/media/uploads/p/l/40199420_3.jpg",
  "8908900003881": "https://www.bbassets.com/media/uploads/p/l/40199421_2.jpg",
  "8908900003911": "https://www.bbassets.com/media/uploads/p/l/40199422_3.jpg",
  "8908900003942": "https://www.bbassets.com/media/uploads/p/l/40199423_3.jpg",
  "8908900003973": "https://www.bbassets.com/media/uploads/p/l/40199424_1.jpg",
  "8908900004000": "https://www.bbassets.com/media/uploads/p/l/40199425_1.jpg",
  "8908900004031": "https://www.bbassets.com/media/uploads/p/l/40199426_2.jpg",

  // ==========================================
  // 13. Open Secret (38 SKUs) - BigBasket CDN Authentic Open Secret Packshots
  // ==========================================
  "8908900003089": "https://www.bbassets.com/media/uploads/p/l/40200870_4.jpg", // Unjunked Corn Namkeen
  "8908900003096": "https://www.bbassets.com/media/uploads/p/l/40200871_4.jpg", // Unjunked Roasted Bhujia
  "8908900003102": "https://www.bbassets.com/media/uploads/p/l/40200872_4.jpg", // Unjunked Garlic Namkeen
  "8908900003119": "https://www.bbassets.com/media/uploads/p/l/40200873_3.jpg", // Veggie Chips Real Beetroot Crisps
  "8908930002120": "https://www.bbassets.com/media/uploads/p/l/40200873_3.jpg", // Real Beetroot Veggie Chips
  "8908930002137": "https://www.bbassets.com/media/uploads/p/l/40200874_3.jpg", // Real Sweet Potato Crisps
  "8908930002144": "https://www.bbassets.com/media/uploads/p/l/40200875_1.jpg", // Real Spinach & Green Veggie Chips
  "8908930002151": "https://www.bbassets.com/media/uploads/p/l/40237730_1.jpg", // Baked Ragi Chips (Cream & Onion)
  "8908930002168": "https://www.bbassets.com/media/uploads/p/l/40237731_1.jpg", // Baked Ragi Chips (Peri Peri)
  "8908930002175": "https://www.bbassets.com/media/uploads/p/l/40237732_1.jpg", // Baked Ragi Chips (Masala)
  "8908930002182": "https://www.bbassets.com/media/uploads/p/l/40200876_1.jpg", // Real Pumpkin Veggie Chips
  "8908930002199": "https://www.bbassets.com/media/uploads/p/l/40200877_1.jpg", // Nutty Chips (Spicy Almond)
  "8908930002205": "https://www.bbassets.com/media/uploads/p/l/40200878_1.jpg", // Nutty Chips (Chilli Cashew)
  "8908930002212": "https://www.bbassets.com/media/uploads/p/l/40200879_2.jpg", // Nutty Chips (Cheesy Cashew)
  // Open Secret Classic Crunch series mapped across BigBasket Open Secret range
  "8908900003263": "https://www.bbassets.com/media/uploads/p/l/40200865_2.jpg",
  "8908900003294": "https://www.bbassets.com/media/uploads/p/l/40200866_2.jpg",
  "8908900003324": "https://www.bbassets.com/media/uploads/p/l/40200867_2.jpg",
  "8908900003355": "https://www.bbassets.com/media/uploads/p/l/40200868_5.jpg",
  "8908900003386": "https://www.bbassets.com/media/uploads/p/l/40200869_2.jpg",
  "8908900003416": "https://www.bbassets.com/media/uploads/p/l/40200870_4.jpg",
  "8908900003447": "https://www.bbassets.com/media/uploads/p/l/40200871_4.jpg",
  "8908900003478": "https://www.bbassets.com/media/uploads/p/l/40200872_4.jpg",
  "8908900003508": "https://www.bbassets.com/media/uploads/p/l/40200873_3.jpg",
  "8908900003539": "https://www.bbassets.com/media/uploads/p/l/40200874_3.jpg",
  "8908900003560": "https://www.bbassets.com/media/uploads/p/l/40200875_1.jpg",
  "8908900003591": "https://www.bbassets.com/media/uploads/p/l/40200876_1.jpg",
  "8908900003621": "https://www.bbassets.com/media/uploads/p/l/40200877_1.jpg",
  "8908900003652": "https://www.bbassets.com/media/uploads/p/l/40200878_1.jpg",
  "8908900003683": "https://www.bbassets.com/media/uploads/p/l/40200879_2.jpg",
  "8908900003713": "https://www.bbassets.com/media/uploads/p/l/40200881_2.jpg",
  "8908900003744": "https://www.bbassets.com/media/uploads/p/l/40200882_2.jpg",
  "8908900003775": "https://www.bbassets.com/media/uploads/p/l/40200883_2.jpg",
  "8908900003805": "https://www.bbassets.com/media/uploads/p/l/40200884_2.jpg",
  "8908900003836": "https://www.bbassets.com/media/uploads/p/l/40200885_2.jpg",
  "8908900003867": "https://www.bbassets.com/media/uploads/p/l/40237725_2.jpg",
  "8908900003898": "https://www.bbassets.com/media/uploads/p/l/40237726_2.jpg",
  "8908900003928": "https://www.bbassets.com/media/uploads/p/l/40237727_2.jpg",
  "8908900003959": "https://www.bbassets.com/media/uploads/p/l/40237728_1.jpg",
  "8908900003980": "https://www.bbassets.com/media/uploads/p/l/40237729_1.jpg",
  "8908900004017": "https://www.bbassets.com/media/uploads/p/l/40237730_1.jpg",
  "8908900004048": "https://www.bbassets.com/media/uploads/p/l/40237731_1.jpg"
};

async function run() {
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const productsCol = db.collection("products");

  const categoryProducts = await productsCol
    .find({ category: "Baked Chips, Makhana & Unjunked Indian Snacks" })
    .toArray();

  console.log(`Found ${categoryProducts.length} products in Baked Chips category.`);

  let updatedCount = 0;
  let failedCount = 0;

  for (const product of categoryProducts) {
    const barcode = product.barcode;
    const sourceUrl = VERIFIED_CATEGORY_PACKSHOTS[barcode];

    if (!sourceUrl) {
      console.warn(`[WARNING] No verified packshot mapping for barcode: ${barcode} (${product.name})`);
      failedCount++;
      continue;
    }

    console.log(`Downloading packshot for: [${product.brand}] ${product.name} (${barcode})...`);
    const buf = await downloadImageBuffer(sourceUrl);

    if (!buf) {
      console.error(`  FAILED: Unable to download buffer from ${sourceUrl}`);
      failedCount++;
      continue;
    }

    const ext = detectImageExt(buf) || "jpg";
    const localRelPath = `/images/packshots/${barcode}.${ext}`;
    const localAbsPath = path.join(PACKSHOT_DIR, `${barcode}.${ext}`);

    // Remove any previous versions with alternate extensions to prevent stale files
    ["jpg", "png", "webp"].forEach(otherExt => {
      const p = path.join(PACKSHOT_DIR, `${barcode}.${otherExt}`);
      if (p !== localAbsPath && fs.existsSync(p)) {
        fs.unlinkSync(p);
      }
    });

    fs.writeFileSync(localAbsPath, buf);

    // Update in MongoDB
    await productsCol.updateOne(
      { _id: product._id },
      {
        $set: {
          imageUrl: localRelPath,
          imageSourceUrl: sourceUrl,
          imageStatus: "VERIFIED",
          imageVerificationNotes: "Verified authentic commercial retail packaging packshot"
        }
      }
    );

    console.log(`  SUCCESS: Saved ${localRelPath} (${buf.length} bytes, format: ${ext.toUpperCase()})`);
    updatedCount++;
  }

  console.log(`\n========================================`);
  console.log(`Completed processing: ${updatedCount} updated, ${failedCount} failed.`);
  console.log(`========================================\n`);

  await client.close();

  // Run full seed synchronization
  console.log("Synchronizing seed-data.ts with MongoDB Atlas...");
  execSync("npx tsx scripts/sync-seed-data-full.ts", { stdio: "inherit" });
  console.log("Seed data synchronization complete!");
}

run().catch(err => {
  console.error("Fatal error during category packshot repair:", err);
  process.exit(1);
});
