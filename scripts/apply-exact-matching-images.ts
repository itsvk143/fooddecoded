import fs from "fs";
import path from "path";
import { getCollection } from "../src/lib/mongodb";

export const PRODUCT_IMAGE_MAP: Record<string, string> = {
  // === 50 COLD DRINKS ===
  "049000028904": "/images/cold-drinks/coca-cola-classic.svg",
  "8901764012211": "/images/cold-drinks/coca-cola-india.svg",
  "8901764022210": "/images/cold-drinks/coca-cola-zero.svg",
  "8901764032219": "/images/cold-drinks/diet-coke.svg",
  "8901764041211": "/images/cold-drinks/thums-up.svg",
  "8901764042218": "/images/cold-drinks/thums-up-charged.svg",
  "8901764051210": "/images/cold-drinks/sprite.svg",
  "8901764052217": "/images/cold-drinks/sprite-zero.svg",
  "8901764061219": "/images/cold-drinks/limca.svg",
  "8901764071218": "/images/cold-drinks/fanta-orange.svg",
  "8901764081217": "/images/cold-drinks/maaza.svg",
  "8901764091216": "/images/cold-drinks/minutemaid-orange.svg",
  "8901764092213": "/images/cold-drinks/minutemaid-guava.svg",
  "8901764101212": "/images/cold-drinks/schweppes-tonic.svg",
  "8901764102219": "/images/cold-drinks/schweppes-ginger-ale.svg",
  "8901764103216": "/images/cold-drinks/schweppes-bitter-lemon.svg",
  "8901491102018": "/images/cold-drinks/pepsi-original.svg",
  "8901491102216": "/images/cold-drinks/pepsi-black.svg",
  "8901491102117": "/images/cold-drinks/diet-pepsi.svg",
  "8901491102315": "/images/cold-drinks/7up.svg",
  "8901491102414": "/images/cold-drinks/7up-nimbooz.svg",
  "8901491102513": "/images/cold-drinks/mountain-dew.svg",
  "8901491102612": "/images/cold-drinks/mirinda.svg",
  "8901491102711": "/images/cold-drinks/slice.svg",
  "8901491102810": "/images/cold-drinks/sting.svg",
  "8901491102919": "/images/cold-drinks/tropicana-apple.svg",
  "8901491103015": "/images/cold-drinks/tropicana-mixed-fruit.svg",
  "8902579100018": "/images/cold-drinks/frooti.svg",
  "8902579101015": "/images/cold-drinks/appy.svg",
  "8902579102012": "/images/cold-drinks/appy-fizz.svg",
  "8902579103019": "/images/cold-drinks/b-fizz.svg",
  "8902080000010": "/images/cold-drinks/dukes-raspberry.svg",
  "8906080600012": "/images/cold-drinks/paperboat-aamras.svg",
  "8906080600029": "/images/cold-drinks/paperboat-jaljeera.svg",
  "8906080600036": "/images/cold-drinks/paperboat-aam-panna.svg",
  "8906080600043": "/images/cold-drinks/paperboat-alphonso.svg",
  "8906080600050": "/images/cold-drinks/paperboat-swing-orange.svg",
  "8906080600067": "/images/cold-drinks/paperboat-swing-lychee.svg",
  "8906080600074": "/images/cold-drinks/paperboat-swing-mixed.svg",
  "8906080600081": "/images/cold-drinks/paperboat-zero-lime.svg",
  "8906017290019": "/images/cold-drinks/bisleri-limonata.svg",
  "8906017290026": "/images/cold-drinks/bisleri-pop.svg",
  "8906017290033": "/images/cold-drinks/bisleri-fonzo.svg",
  "8906017290040": "/images/cold-drinks/bisleri-jeera.svg",
  "8904084500017": "/images/cold-drinks/campa-cola.svg",
  "8904084500024": "/images/cold-drinks/campa-orange.svg",
  "8904084500031": "/images/cold-drinks/campa-lemon.svg",
  "8906005880017": "/images/cold-drinks/sosyo.svg",
  "8906006450011": "/images/cold-drinks/bovonto.svg",
  "8906132690013": "/images/cold-drinks/lahori-zeera.svg",

  // === 50 CHIPS ===
  "028400043809": "/images/chips/doritos-nacho-cheese.svg",
  "8901491101844": "/images/chips/lays-magic-masala.svg",
  "8901491100250": "/images/chips/lays-cream-onion.svg",
  "8906010502607": "/images/chips/balaji-masala-wafers.svg",
  "8901725013691": "/images/chips/bingo-mad-angles-chaat.svg",
  "8908001017893": "/images/chips/cornitos-peri-peri.svg",
  "8906004563683": "/images/chips/yellow-diamond-chips.svg",
  "8901491101837": "/images/chips/lays-classic-salted.svg",
  "8901491101820": "/images/chips/lays-spanish-tomato.svg",
  "8901491001816": "/images/chips/lays-hot-sweet-chilli.svg",
  "8901491981538": "/images/chips/lays-chile-limon.svg",
  "8901491100281": "/images/chips/lays-sizzling-hot.svg",
  "8901491435109": "/images/chips/uncle-chipps-spicy-treat.svg",
  "8901491405003": "/images/chips/uncle-chipps-plain-salted.svg",
  "8901725198411": "/images/chips/bingo-mad-angles-chaat.svg",
  "8901725013714": "/images/chips/bingo-mad-angles-peri-peri.svg",
  "8901725007447": "/images/chips/bingo-original-salted.svg",
  "8901725007102": "/images/chips/bingo-original-chilli.svg",
  "8901725119829": "/images/chips/bingo-hashtags-masala.svg",
  "8886467124921": "/images/chips/pringles-original.svg",
  "8886467122408": "/images/chips/pringles-sour-cream.svg",
  "8886467116315": "/images/chips/pringles-cheesy-cheese.svg",
  "8886467122439": "/images/chips/pringles-desi-masala.svg",
  "8886467122446": "/images/chips/pringles-peri-peri.svg",
  "8906090571258": "/images/chips/tooyumm-multigrain-tomato.svg",
  "8906090571241": "/images/chips/tooyumm-dahi-papdi.svg",
  "8906090573009": "/images/chips/tooyumm-potato-tomato.svg",
  "8906090572835": "/images/chips/tooyumm-stix-peri-peri.svg",
  "8904132920156": "/images/chips/tagz-cream-onion.svg",
  "8908013524563": "/images/chips/tagz-beer-barbeque.svg",
  "8908013524389": "/images/chips/tagz-salt-trippin.svg",
  "8908013524549": "/images/chips/tagz-masala-trekker.svg",
  "8906010500016": "/images/chips/balaji-simply-salted.svg",
  "8906010500498": "/images/chips/balaji-tomato-twist.svg",
  "8906010500535": "/images/chips/balaji-chaat-chaska.svg",
  "8906010500870": "/images/chips/balaji-crunchex-cream-onion.svg",
  "8904063258434": "/images/chips/haldirams-potato-salted.svg",
  "8904063201157": "/images/chips/haldirams-pudina-treat.svg",
  "8904063219664": "/images/chips/haldirams-aloo-masala.svg",
  "8904063201355": "/images/chips/haldirams-tangy-tomato.svg",
  "8906004560682": "/images/chips/yellow-diamond-plain-salted.svg",
  "8906004560163": "/images/chips/yellow-diamond-tom-chi.svg",
  "8901719111112": "/images/chips/parle-wafers-simply-salted.svg",
  "8901719111419": "/images/chips/parle-wafers-masala-masti.svg",
  "8901719111310": "/images/chips/parle-wafers-tangy-tomato.svg",
  "8901491100083": "/images/chips/doritos-sweet-chilli.svg",
  "8901491003025": "/images/chips/doritos-sizzlin-hot.svg",
  "8908001017053": "/images/chips/cornitos-jalapeno.svg",
  "8908001017183": "/images/chips/cornitos-peri-peri.svg",
  "8908001017077": "/images/chips/cornitos-tikka-masala.svg",

  // === 25 BANANA CHIPS ===
  "8906001230456": "/images/banana-chips/a1-coconut-oil.svg",
  "8904123534256": "/images/banana-chips/a1-jaggery.svg",
  "8904123534072": "/images/banana-chips/a1-pepper-masala.svg",
  "8908023145062": "/images/banana-chips/beyond-snack-original.svg",
  "8908023145024": "/images/banana-chips/beyond-snack-peri-peri.svg",
  "8908023145031": "/images/banana-chips/beyond-snack-sour-cream.svg",
  "8908023145017": "/images/banana-chips/beyond-snack-pepper.svg",
  "8908023145284": "/images/banana-chips/beyond-snack-coconut-oil.svg",
  "8908023145222": "/images/banana-chips/beyond-snack-sweet-chilli.svg",
  "8904011506723": "/images/banana-chips/double-horse-sharkara-upperi.svg",
  "8906064700950": "/images/banana-chips/kozhikodens-coconut-oil.svg",
  "8904063200525": "/images/banana-chips/haldirams-salted.svg",
  "8904063200532": "/images/banana-chips/haldirams-masala.svg",
  "8904004408874": "/images/banana-chips/haldirams-pepper.svg",
  "8906010504441": "/images/banana-chips/balaji-salted.svg",
  "8906010500153": "/images/banana-chips/balaji-mast-mari.svg",
  "8906010500177": "/images/banana-chips/balaji-mast-masala.svg",
  "8904071704527": "/images/banana-chips/chhedas-yellow-rock-salt.svg",
  "8904071700031": "/images/banana-chips/chhedas-long-masala.svg",
  "8904071704565": "/images/banana-chips/chhedas-tomato.svg",
  "8904067709529": "/images/banana-chips/jabsons-salted.svg",
  "8904067709543": "/images/banana-chips/jabsons-black-pepper.svg",
  "8906169990973": "/images/banana-chips/sweet-karam-coffee-ripe.svg",
  "8906169990980": "/images/banana-chips/sweet-karam-coffee-nendran.svg",
  "8908019517118": "/images/banana-chips/vs-mani-salted.svg",

  // === 15 BISCUITS ===
  "8901063013862": "/images/biscuit.jpg",
  "8901719101007": "/images/biscuits/parle-g.svg",
  "8901063162723": "/images/biscuits/marie-gold.svg",
  "8909081005046": "/images/biscuits/dark-fantasy.svg",
  "8906033740475": "/images/biscuits/mcvities-digestive.svg",
  "7622202348846": "/images/biscuits/oreo-original.svg",
  "8906009079165": "/images/biscuits/unibic-choco-chip.svg",
  "8908006217038": "/images/biscuits/slurrp-farm-ragi.svg",
  "8904335604198": "/images/biscuits/yogabar-cookie.svg",
  "8906032018513": "/images/biscuits/patanjali-doodh.svg",
  "8901725002206": "/images/biscuits/farmlite-digestive.svg",
  "8901719121432": "/images/biscuits/parle-monaco.svg",
  "8901063139466": "/images/biscuits/britannia-bourbon.svg",
  "8906078260181": "/images/biscuits/cremica-marie.svg",
  "8901928983004": "/images/biscuits/biskfarm-sugarfree.svg",

  // === 10 COOKIES ===
  "8901063092822": "/images/cookies/good-day-butter.svg",
  "8901063151321": "/images/cookies/good-day-cashew.svg",
  "8901719117183": "/images/cookies/hide-and-seek.svg",
  "8901725013899": "/images/cookies/moms-magic-cashew.svg",
  "8906009078014": "/images/cookies/unibic-butter.svg",
  "8906009077017": "/images/cookies/unibic-fruit-nut.svg",
  "8906065031138": "/images/cookies/karachi-fruit.svg",
  "8908013328130": "/images/cookies/open-secret-choco.svg",
  "7622202274176": "/images/cookies/cadbury-chocobakes.svg",
  "8906092421379": "/images/cookies/slurrp-choco-millet.svg",

  // === 15 SNACKS & NAMKEEN ===
  "8904063201452": "/images/namkeen_mixture.png",
  "8901491361026": "/images/snacks/kurkure-masala-munch.svg",
  "8904063240187": "/images/snacks/haldirams-aloo-bhujia.svg",
  "8904004400455": "/images/snacks/haldirams-bhujia-sev.svg",
  "8904063216403": "/images/snacks/haldirams-khatta-meetha.svg",
  "8904004403718": "/images/snacks/haldirams-moong-dal.svg",
  "8901725118921": "/images/snacks/bingo-tedhe-medhe.svg",
  "8906005500052": "/images/snacks/bikaji-bhujia.svg",
  "8901414000827": "/images/snacks/bikano-navratan.svg",
  "8906090579346": "/images/snacks/tooyumm-karare.svg",
  "8906090577281": "/images/snacks/tooyumm-veggie-stix.svg",
  "8906120108126": "/images/snacks/farmley-peri-peri-makhana.svg",
  "8906112663831": "/images/snacks/true-elements-super-seeds.svg",
  "8901512562609": "/images/snacks/act-ii-popcorn.svg",
  "8904063200464": "/images/snacks/haldirams-boondi.svg",
};

async function main() {
  console.log("Starting image alignment sync...");

  // 1. Update src/lib/seed-data.ts in place
  const seedPath = path.join(process.cwd(), "src/lib/seed-data.ts");
  let seedContent = fs.readFileSync(seedPath, "utf8");

  // Regex replace imageUrl for each barcode in seed-data.ts
  let replacedCount = 0;
  for (const [barcode, imagePath] of Object.entries(PRODUCT_IMAGE_MAP)) {
    // Look for product block with barcode: "..." and its imageUrl: "..."
    const pattern = new RegExp(`(barcode:\\s*"${barcode}"[\\s\\S]*?imageUrl:\\s*)"[^"]+"`, "m");
    if (pattern.test(seedContent)) {
      seedContent = seedContent.replace(pattern, `$1"${imagePath}"`);
      replacedCount++;
    }
  }

  fs.writeFileSync(seedPath, seedContent, "utf8");
  console.log(`Updated ${replacedCount} products in src/lib/seed-data.ts`);

  // 2. Update MongoDB Atlas collection if connected
  const col = await getCollection("products");
  if (col) {
    let dbUpdated = 0;
    for (const [barcode, imagePath] of Object.entries(PRODUCT_IMAGE_MAP)) {
      const res = await col.updateOne({ barcode }, { $set: { imageUrl: imagePath } });
      if (res.modifiedCount > 0) {
        dbUpdated++;
      }
    }
    console.log(`Updated ${dbUpdated} products in MongoDB Atlas database.`);
  } else {
    console.log("MongoDB not connected or skipped.");
  }

  console.log("Image alignment sync complete!");
}

main().catch(console.error).finally(() => process.exit(0));

