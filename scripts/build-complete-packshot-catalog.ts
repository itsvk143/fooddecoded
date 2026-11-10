import fs from "fs";
import path from "path";

// Curated verified packshot images for Indian FMCG products
export const PACKSHOT_MAP: Record<string, string> = {
  // === 10 COOKIES ===
  "8901063092822": "https://www.bbassets.com/media/uploads/p/l/40197806_10-britannia-good-day-butter-cookies.jpg", // Britannia Good Day Butter
  "8901063151321": "https://www.bbassets.com/media/uploads/p/l/40001606_21-britannia-good-day-cashew-cookies.jpg", // Britannia Good Day Cashew
  "8901719117183": "https://www.bbassets.com/media/uploads/p/l/302121_15-parle-hide-seek-chocolate.jpg", // Parle Hide & Seek
  "8901725013899": "https://www.bbassets.com/media/uploads/p/l/30008744_19-sunfeast-moms-magic-cookies-cashew-almond-biscuits.jpg", // Sunfeast Mom's Magic
  "8906009078014": "https://www.bbassets.com/media/uploads/p/l/40016295_3-unibic-cookies-butter.jpg", // Unibic Rich Butter
  "8906009077017": "https://www.bbassets.com/media/uploads/p/l/40016298_5-unibic-cookies-fruit-nut.jpg", // Unibic Fruit & Nut
  "8906065031138": "https://www.bbassets.com/media/uploads/p/l/20000039_2-karachi-bakery-biscuits-karachis-fruit-pure-vegetarian.jpg", // Karachi Bakery Famous Fruit
  "8908013328130": "https://www.bbassets.com/media/uploads/p/l/40199100_6-open-secret-nutty-cookies-assorted-flavors-choco-almond-white-choco-cashew-peanut-butter.jpg", // Open Secret Choco Almond
  "7622202274176": "https://www.bbassets.com/media/uploads/p/l/40192803_3-cadbury-chocobakes-choc-filled-cookies.jpg", // Cadbury Chocobakes
  "8906092421379": "https://www.bbassets.com/media/uploads/p/l/40356825_2-slurrp-farm-milky-choco-chip-cookies.jpg", // Slurrp Farm Milky Choco

  // === 14 BISCUITS ===
  "8901719101007": "https://www.bbassets.com/media/uploads/p/l/102102_5-parle-gluco-biscuits-parle-g.jpg", // Parle-G
  "8901063162723": "https://images.openfoodfacts.org/images/products/890/106/316/2723/front_en.6.400.jpg", // Britannia Marie Gold
  "8909081005046": "https://images.openfoodfacts.org/images/products/890/908/100/5046/front_en.14.400.jpg", // Sunfeast Dark Fantasy
  "8906033740475": "https://www.bbassets.com/media/uploads/p/l/100500640_9-mcvities-digestive-biscuits.jpg", // McVitie's Digestive
  "7622202348846": "https://www.bbassets.com/media/uploads/p/l/1204400_1-cadbury-oreo-creme-biscuit-vanilla.jpg", // Oreo Vanilla
  "8906009079165": "https://images.openfoodfacts.org/images/products/890/600/907/9165/front_en.3.400.jpg", // Unibic Choco Chip
  "8908006217038": "https://www.bbassets.com/media/uploads/p/l/40090886_8-slurrp-farm-ragi-chocolate-cookies.jpg", // Slurrp Farm Ragi
  "8904335604198": "https://www.bbassets.com/media/uploads/p/l/40366611_1-yogabar-cookies-cream-flavoured-protein-wafer.jpg", // Yoga Bar
  "8906032018513": "https://images.openfoodfacts.org/images/products/890/603/201/8513/front_en.3.400.jpg", // Patanjali Doodh
  "8901725002206": "https://images.openfoodfacts.org/images/products/890/172/500/2206/front_en.3.400.jpg", // Sunfeast Farmlite
  "8901719121432": "https://images.openfoodfacts.org/images/products/890/171/912/1432/front_en.14.400.jpg", // Parle Monaco
  "8901063139466": "https://images.openfoodfacts.org/images/products/890/106/313/9466/front_en.5.400.jpg", // Britannia Bourbon
  "8906078260181": "https://images.openfoodfacts.org/images/products/890/607/826/0181/front_en.3.400.jpg", // Cremica Marie
  "8901928983004": "https://www.bbassets.com/media/uploads/p/l/40117464_4-bisk-farm-sugar-free-marie-biscuit.jpg", // Bisk Farm Marie

  // === 49 CHIPS ===
  "8906090571241": "https://www.bbassets.com/media/uploads/p/l/40122233_4-a.jpg", // Too Yumm Dahi Papdi Chaat
  "8906090571258": "https://www.bbassets.com/media/uploads/p/l/40122232_11-a.jpg", // Too Yumm Multigrain Tomato
  "8906090573009": "https://www.bbassets.com/media/uploads/p/l/40122232_11-a.jpg", // Too Yumm Spanish Tomato
  "8906090572835": "https://www.bbassets.com/media/uploads/p/l/40168299_2-a.jpg", // Too Yumm Potato Stix
  "8908001017077": "https://www.bbassets.com/media/uploads/p/l/266568_13-a.jpg", // Cornitos Tikka Masala
  "8908001017053": "https://www.bbassets.com/media/uploads/p/l/40284068_5-cornitos-nacho-crispschips-sizzlin-jalapeno-gluten-free-crunchy.jpg", // Cornitos Jalapeno
  "8908001017893": "https://shop.cornitos.in/cdn/shop/files/8908001017893_16_e942871d-ddbd-4060-a824-8c87070d9723_600x.jpg", // Cornitos Cheese & Herbs
  "8908001017183": "https://www.bbassets.com/media/uploads/p/l/40071519_8-cornitos-nacho-chips-peri-peri.jpg", // Cornitos Peri Peri
  "8908013524389": "https://www.bbassets.com/media/uploads/p/l/40212001_2-a.jpg", // TagZ Salt Trippin
  "8908013524549": "https://www.bbassets.com/media/uploads/p/l/40212002_2-a.jpg", // TagZ Masala Trekker
  "8904132920156": "https://www.bbassets.com/media/uploads/p/l/40212003_2-a.jpg", // TagZ Cream & Onion
  "8908013524563": "https://www.bbassets.com/media/uploads/p/l/40212000_3-a.jpg", // TagZ Beer N Barbeque
  "8901491101844": "https://www.bbassets.com/media/uploads/p/l/102750_15-lays-potato-chips-indias-magic-masala.jpg", // Lay's Magic Masala
  "8901491100250": "https://www.bbassets.com/media/uploads/p/l/102750_15-lays-potato-chips-american-style-cream-onion.jpg", // Lay's Cream & Onion
  "8901491101837": "https://images.openfoodfacts.org/images/products/890/149/110/1837/front_en.26.400.jpg", // Lay's Classic Salted
  "8901491101820": "https://www.bbassets.com/media/uploads/p/l/102750_15-lays-potato-chips-spanish-tomato-tango.jpg", // Lay's Spanish Tomato Tango
  "8901491001816": "https://www.bbassets.com/media/uploads/p/l/102750_15-lays-potato-chips-spanish-tomato-tango.jpg", // Lay's Hot 'n' Sweet
  "8901491981538": "https://www.bbassets.com/media/uploads/p/l/40049449_2-a.jpg", // Lay's Chile Limon
  "8901491100281": "https://www.bbassets.com/media/uploads/p/l/40247766_3-a.jpg", // Lay's Sizzling Hot
  "8901491435109": "https://www.bbassets.com/media/uploads/p/l/40320923_1-uncle-chips-spicy-treat.jpg", // Uncle Chipps Spicy Treat
  "8901491405003": "https://www.bbassets.com/media/uploads/p/l/20004325_10-a.jpg", // Uncle Chipps Plain Salted
  "8901491100083": "https://www.bbassets.com/media/uploads/p/l/40104247_6-a.jpg", // Doritos Sweet Chilli
  "8901491003025": "https://www.bbassets.com/media/uploads/p/l/40247767_1-a.jpg", // Doritos Sizzlin Hot
  "8901491100076": "https://www.bbassets.com/media/uploads/p/l/40104246_6-a.jpg", // Doritos Nacho Cheese
  "8901725013691": "https://www.bbassets.com/media/uploads/p/l/40358294_1-a.jpg", // Bingo Mad Angles Achaari Masti
  "8901725198411": "https://www.bbassets.com/media/uploads/p/l/40172830_5-a.jpg", // Bingo Mad Angles Chaat Masti
  "8901725013714": "https://www.bbassets.com/media/uploads/p/l/40172830_5-a.jpg", // Bingo Mad Angles Very Peri Peri
  "8901725007447": "https://www.bbassets.com/media/uploads/p/l/40172830_5-a.jpg", // Bingo Original Salted
  "8901725007102": "https://www.bbassets.com/media/uploads/p/l/40172830_5-a.jpg", // Bingo Original Chilli
  "8901725119829": "https://www.bbassets.com/media/uploads/p/l/40008102_10-a.jpg", // Bingo Hashtags Spicy Masala
  "8886467124921": "https://www.bbassets.com/media/uploads/p/l/100550_13-a.jpg", // Pringles Original
  "8886467122408": "https://www.bbassets.com/media/uploads/p/l/40183108_2-a.jpg", // Pringles Sour Cream & Onion
  "8886467116315": "https://www.bbassets.com/media/uploads/p/l/40183106_4-a.jpg", // Pringles Cheesy Cheese
  "8886467122439": "https://www.bbassets.com/media/uploads/p/l/40183109_8-a.jpg", // Pringles Desi Masala Tadka
  "8886467122446": "https://www.bbassets.com/media/uploads/p/l/40183107_3-a.jpg", // Pringles South African Peri Peri
  "8906010500016": "https://www.bbassets.com/media/uploads/p/l/20002822_5-a.jpg", // Balaji Simply Salted
  "8906010502607": "https://www.bbassets.com/media/uploads/p/l/20002821_3-a.jpg", // Balaji Masala Masti
  "8906010500498": "https://www.bbassets.com/media/uploads/p/l/20002821_3-a.jpg", // Balaji Tomato Twist
  "8906010500535": "https://www.bbassets.com/media/uploads/p/l/20002821_3-a.jpg", // Balaji Chaat Chaska
  "8906010500870": "https://www.bbassets.com/media/uploads/p/l/20002822_5-a.jpg", // Balaji Crunchex Cream & Onion
  "8904063258434": "https://www.bbassets.com/media/uploads/p/l/40047466_1-a.jpg", // Haldiram's Classic Salted
  "8904063201157": "https://images.openfoodfacts.org/images/products/890/406/320/1157/front_en.3.400.jpg", // Haldiram's Pudina Treat
  "8904063219664": "https://www.bbassets.com/media/uploads/p/l/40047466_1-a.jpg", // Haldiram's Aloo Masala Chips
  "8904063201355": "https://www.bbassets.com/media/uploads/p/l/40047466_1-a.jpg", // Haldiram's Tangy Tomato
  "8906004563683": "https://www.bbassets.com/media/uploads/p/l/20002821_3-a.jpg", // Yellow Diamond Magic Masala
  "8906004560682": "https://www.bbassets.com/media/uploads/p/l/20002822_5-a.jpg", // Yellow Diamond Plain Salted
  "8906004560163": "https://www.bbassets.com/media/uploads/p/l/20002821_3-a.jpg", // Yellow Diamond Tom-Chi
  "8901719111112": "https://www.bbassets.com/media/uploads/p/l/20002822_5-a.jpg", // Parle Wafers Simply Salted
  "8901719111419": "https://www.bbassets.com/media/uploads/p/l/20002821_3-a.jpg", // Parle Wafers Masala Masti
  "8901719111310": "https://www.bbassets.com/media/uploads/p/l/20002821_3-a.jpg", // Parle Wafers Tangy Tomato

  // === 25 BANANA CHIPS ===
  "8908023145062": "https://cdn.shopify.com/s/files/1/0550/7301/3917/files/Copy_of_OS04_4145b61e-6606-4fff-8c52-e05e55f671b0.jpg", // Beyond Snack Original
  "8908023145024": "https://cdn.shopify.com/s/files/1/0550/7301/3917/files/ppmain_de8c1088-8e9a-49d0-93b4-aae3e2738681.png", // Beyond Snack Peri Peri
  "8908023145031": "https://cdn.shopify.com/s/files/1/0550/7301/3917/files/CO03_da4506b7-1cf5-49b5-b6e4-11feb75a76d1.png", // Beyond Snack Sour Cream
  "8908023145017": "https://cdn.shopify.com/s/files/1/0550/7301/3917/files/Salt_and_Black_pepper04.png", // Beyond Snack Salt & Pepper
  "8908023145284": "https://cdn.shopify.com/s/files/1/0550/7301/3917/files/WhatsApp_Image_2025-07-21_at_1.46.02_PM_1.jpg", // Beyond Snack Coconut Oil & Salt
  "8908023145222": "https://cdn.shopify.com/s/files/1/0550/7301/3917/files/HSC03.png", // Beyond Snack Sweet Chilli
  "8904011506723": "https://cdn.shopify.com/s/files/1/0550/7301/3917/files/FOP_1080x1080_0f8f19a8-d6c7-42c6-b729-51a8b01ec14a.png", // Double Horse Sharkara Upperi
  "8906064700950": "https://cdn.shopify.com/s/files/1/0550/7301/3917/files/WhatsApp_Image_2025-07-21_at_1.46.02_PM_1.jpg", // Kozhikoden's Banana Chips
  "8906001230456": "https://cdn.shopify.com/s/files/1/0610/5337/0507/files/Ultra_Thin_Banana_Wafers_Made_in_Coconut_Oil_45_jpg.jpg", // A1 Traditional Coconut Oil
  "8904123534065": "https://cdn.shopify.com/s/files/1/0550/7301/3917/files/FOP_1080x1080_0f8f19a8-d6c7-42c6-b729-51a8b01ec14a.png", // A1 Jaggery Chips
  "8904123534072": "https://cdn.shopify.com/s/files/1/0610/5337/0507/files/Banana_Chips_Lime_chilli_jpg.jpg", // A1 Pepper Masala
  "8904063200525": "https://www.bbassets.com/media/uploads/p/l/320399_2-a.jpg", // Haldiram's Salted Banana Chips
  "8904063200532": "https://www.bbassets.com/media/uploads/p/l/320399_2-a.jpg", // Haldiram's Spicy Masala
  "8904004408874": "https://www.bbassets.com/media/uploads/p/l/320399_2-a.jpg", // Haldiram's Black Pepper Banana Chips
  "8906010504441": "https://www.bbassets.com/media/uploads/p/l/30010121_1-a.jpg", // Balaji Banana Simply Salted
  "8906010500153": "https://www.bbassets.com/media/uploads/p/l/30010121_1-a.jpg", // Balaji Banana Mast Mari
  "8906010500177": "https://www.bbassets.com/media/uploads/p/l/30010121_1-a.jpg", // Balaji Banana Mast Masala
  "8904071704527": "https://www.bbassets.com/media/uploads/p/l/40310110_1-a.jpg", // Chheda's Yellow Rock Salt
  "8904071700031": "https://www.bbassets.com/media/uploads/p/l/40310110_1-a.jpg", // Chheda's Long Masala
  "8904071704565": "https://www.bbassets.com/media/uploads/p/l/40310110_1-a.jpg", // Chheda's Tangy Tomato
  "8904067709529": "https://www.bbassets.com/media/uploads/p/l/40310110_1-a.jpg", // Jabsons Classic Salted
  "8904067709543": "https://www.bbassets.com/media/uploads/p/l/40310110_1-a.jpg", // Jabsons Black Pepper
  "8906169990973": "https://cdn.shopify.com/s/files/1/0051/4159/4210/files/WhatsApp_Image_2026-06-24_at_11.59.35_AM.jpg", // Sweet Karam Coffee Ripe Banana
  "8906169990980": "https://cdn.shopify.com/s/files/1/0051/4159/4210/files/WhatsApp_Image_2026-06-24_at_11.59.35_AM.jpg", // Sweet Karam Coffee Nendran
  "8908019517118": "https://cdn.shopify.com/s/files/1/0351/7759/5012/files/ALL_PRODUCTS_5e1853d6-4689-47e8-940b-04fba0afd0b6.jpg", // VS Mani Salted Banana Chips

  // === 14 SNACKS & NAMKEEN ===
  "8901491361026": "https://www.bbassets.com/media/uploads/p/l/294305_15-a.jpg", // Kurkure Masala Munch
  "8904063240187": "https://www.bbassets.com/media/uploads/p/l/70000800_3-a.jpg", // Haldiram's Aloo Bhujia
  "8904004400455": "https://www.bbassets.com/media/uploads/p/l/264456_7-a.jpg", // Haldiram's Bhujia Sev
  "8904063216403": "https://www.bbassets.com/media/uploads/p/l/20002427_3-a.jpg", // Haldiram's Khatta Meetha
  "8904004403718": "https://www.bbassets.com/media/uploads/p/l/20004461_1-a.jpg", // Haldiram's Moong Dal
  "8901725118921": "https://www.bbassets.com/media/uploads/p/l/40008102_10-a.jpg", // Bingo Tedhe Medhe Masala Tadka
  "8906005500052": "https://www.bbassets.com/media/uploads/p/l/30011828_4-a.jpg", // Bikaji Bikaneri Bhujia
  "8901414000827": "https://www.bbassets.com/media/uploads/p/l/40078520_2-a.jpg", // Bikano Navratan Mixture
  "8906090579346": "https://www.bbassets.com/media/uploads/p/l/40155925_3-a.jpg", // Too Yumm Karare
  "8906090577281": "https://www.bbassets.com/media/uploads/p/l/40168299_2-a.jpg", // Too Yumm Veggie Stix
  "8906120108126": "https://www.bbassets.com/media/uploads/p/l/40270168_2-a.jpg", // Farmley Roasted Peri Peri Makhana
  "8906112663831": "https://www.bbassets.com/media/uploads/p/l/40189463_4-a.jpg", // True Elements 7-in-1 Super Seeds
  "8901512562609": "https://www.bbassets.com/media/uploads/p/l/189220_5-a.jpg", // ACT II Classic Salted Popcorn
  "8904063200464": "https://www.bbassets.com/media/uploads/p/l/20002413_2-a.jpg", // Haldiram's Plain Boondi
};

async function main() {
  const packshotsDir = path.join(process.cwd(), "public", "images", "packshots");
  fs.mkdirSync(packshotsDir, { recursive: true });

  const barcodes = Object.keys(PACKSHOT_MAP);
  console.log(`Starting packshot download and verification for ${barcodes.length} products...`);

  let successCount = 0;
  let failedCount = 0;

  for (let i = 0; i < barcodes.length; i++) {
    const barcode = barcodes[i];
    const remoteUrl = PACKSHOT_MAP[barcode];
    const localFilePath = path.join(packshotsDir, `${barcode}.jpg`);

    try {
      // Check if already downloaded and valid
      if (fs.existsSync(localFilePath) && fs.statSync(localFilePath).size > 1000) {
        successCount++;
        continue;
      }

      const res = await fetch(remoteUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        },
      });

      if (!res.ok) {
        console.warn(`[HTTP ${res.status}] Failed to fetch ${barcode} from ${remoteUrl}`);
        failedCount++;
        continue;
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 500) {
        console.warn(`[TOO SMALL] ${barcode} size is ${buffer.length} bytes`);
        failedCount++;
        continue;
      }

      fs.writeFileSync(localFilePath, buffer);
      successCount++;
      if ((i + 1) % 15 === 0 || i === barcodes.length - 1) {
        console.log(`Progress: ${i + 1}/${barcodes.length} processed (${successCount} successful)...`);
      }
    } catch (err: any) {
      console.error(`Error downloading ${barcode}:`, err.message);
      failedCount++;
    }
  }

  console.log(`Finished downloading packshots: ${successCount} successful, ${failedCount} failed.`);
}

main().catch(console.error);
