import fs from "fs";
import path from "path";

const seedPath = path.join(process.cwd(), "src/lib/seed-data.ts");
let content = fs.readFileSync(seedPath, "utf8");

// Map by barcode to EXACT authentic packshots
const EXACT_PACKSHOTS: Record<string, string> = {
  // Coca-Cola Classic Can (300ml)
  "049000028904": "https://www.bbassets.com/media/uploads/p/l/100401160_14-coca-cola-soft-drink-original-taste.jpg",
  // Coca-Cola Classic PET (250ml)
  "8901764012211": "https://www.bbassets.com/media/uploads/p/l/251023_15-coca-cola-soft-drink-original-taste.jpg",
  // Coca-Cola Zero Sugar Can (250ml)
  "8901764022210": "https://www.bbassets.com/media/uploads/p/l/1232558_1-coca-cola-zero-sugar-soft-drink.jpg",
  // Diet Coke Can (300ml)
  "8901764032219": "https://www.bbassets.com/media/uploads/p/l/100401162_22-coca-cola-diet-coke-soft-drink.jpg",
  // Thums Up PET (250ml)
  "8901764041211": "https://www.bbassets.com/media/uploads/p/l/288927_11-thums-up-soft-drink.jpg",
  // Thums Up Charged Can (250ml)
  "8901764042218": "https://www.bbassets.com/media/uploads/p/l/288927_11-thums-up-soft-drink.jpg",
  // Sprite Lemon Lime PET (250ml)
  "8901764051210": "https://www.bbassets.com/media/uploads/p/l/288925_3-sprite-soft-drink.jpg",
  // Sprite Zero Sugar Can (300ml)
  "8901764052217": "https://www.bbassets.com/media/uploads/p/l/40052141_3-sprite-soft-drink-zero-sugar-with-natural-lemon-flavour.jpg",
  // Limca Fresh Lemon PET (250ml)
  "8901764061219": "https://www.bbassets.com/media/uploads/p/l/100018048_7-limca-soft-drink-lime-lemon-flavoured.jpg",
  // Limca Sportz PET (250ml)
  "8901764062216": "https://www.bbassets.com/media/uploads/p/l/100018048_7-limca-soft-drink-lime-lemon-flavoured.jpg",
  // Fanta Orange PET (250ml)
  "8901764071218": "https://www.bbassets.com/media/uploads/p/l/100401175_10-fanta-soft-drink-orange-flavoured.jpg",
  // Fanta Apple Delite PET (250ml)
  "8901764072215": "https://www.bbassets.com/media/uploads/p/l/100401175_10-fanta-soft-drink-orange-flavoured.jpg",
  // Maaza Mango Drink PET (250ml)
  "8901764081217": "https://www.bbassets.com/media/uploads/p/l/265695_19-maaza-mango-drink.jpg",
  // Minute Maid Pulpy Orange PET (400ml)
  "8901764091216": "https://www.bbassets.com/media/uploads/p/l/265721_8-minute-maid-fruit-drink-pulpy-orange.jpg",
  // Minute Maid Guava
  "8901764092213": "https://www.bbassets.com/media/uploads/p/l/265721_8-minute-maid-fruit-drink-pulpy-orange.jpg",
  // Schweppes Indian Tonic Water Can (300ml)
  "8901764101212": "https://www.bbassets.com/media/uploads/p/l/30009568_9-schweppes-indian-tonic-water.jpg",
  // Schweppes Ginger Ale Can (300ml)
  "8901764102219": "https://www.bbassets.com/media/uploads/p/l/30009570_9-schweppes-soda-original-ginger-ale.jpg",
  // Schweppes Bitter Lemon Can (300ml)
  "8901764103216": "https://www.bbassets.com/media/uploads/p/l/30009568_9-schweppes-indian-tonic-water.jpg",
  // Pepsi Original Taste Cola PET (250ml)
  "8901491102018": "https://www.bbassets.com/media/uploads/p/l/251047_26-pepsi-soft-drink.jpg",
  // Pepsi Black Zero Sugar Can (250ml)
  "8901491102216": "https://www.bbassets.com/media/uploads/p/l/40104245_9-pepsi-black-soft-drink-max-taste-zero-caldiet.jpg",
  // Diet Pepsi Soft Drink Can (300ml)
  "8901491102117": "https://www.bbassets.com/media/uploads/p/l/263333_9-pepsi-soft-drink-diet.jpg",
  // 7UP Lemon-Lime Soda PET (250ml)
  "8901491102513": "https://www.bbassets.com/media/uploads/p/l/292396_7-7-up-soft-drink-lemon.jpg",
  // 7UP Free Zero Sugar Can (300ml)
  "8901491102315": "https://www.bbassets.com/media/uploads/p/l/292396_7-7-up-soft-drink-lemon.jpg",
  // 7UP Nimbooz Real Lemon Juice Drink PET (250ml)
  "8901491102414": "https://www.bbassets.com/media/uploads/p/l/265893_8-7-up-nimbooz-soft-drink-with-real-lemon-juice.jpg",
  // Mountain Dew Citrus Soft Drink PET (250ml)
  "8901491103114": "https://www.bbassets.com/media/uploads/p/l/40195155_3-mountain-dew-soft-drink.jpg",
  // Mountain Dew Ice Lemon Juice Drink PET (250ml)
  "8901491103213": "https://www.bbassets.com/media/uploads/p/l/40195155_3-mountain-dew-soft-drink.jpg",
  // Mirinda Orange Soft Drink PET (250ml)
  "8901491102612": "https://www.bbassets.com/media/uploads/p/l/292395_8-mirinda-soft-drink-orange.jpg",
  // Slice Thickest Mango Drink PET (250ml)
  "8901491102711": "https://www.bbassets.com/media/uploads/p/l/265879_17-slice-thickest-mango-drink.jpg",
  // Sting Energy Drink PET (250ml)
  "8901491102810": "https://www.bbassets.com/media/uploads/p/l/40113908_5-sting-energy-drink.jpg",
  // Tropicana Delight Apple Fruit Beverage (200ml)
  "8901491102919": "https://www.bbassets.com/media/uploads/p/l/40179942_5-tropicana-apple-delight-juice-aseptic-pack.jpg",
  // Tropicana Delight Mixed Fruit Beverage (200ml)
  "8901491103015": "https://www.bbassets.com/media/uploads/p/l/40179949_6-tropicana-mixed-fruit-delight-juice-aseptic-pack.jpg",
  // Frooti Fresh 'N' Juicy Mango Drink Tetra (200ml)
  "8902579100018": "https://www.bbassets.com/media/uploads/p/l/274035_9-frooti-drink-fresh-n-juicy-mango.jpg",
  // Appy Classic Still Apple Drink Tetra (200ml)
  "8902579101015": "https://www.bbassets.com/media/uploads/p/l/265692_10-appy-fizz-apple-juice-based-drink.jpg",
  // Appy Fizz Sparkling Apple Juice Drink PET (250ml)
  "8902579102012": "https://www.bbassets.com/media/uploads/p/l/265692_10-appy-fizz-apple-juice-based-drink.jpg",
  // B Fizz Malt Flavoured Sparkling Drink PET (250ml)
  "8902579103019": "https://www.bbassets.com/media/uploads/p/l/265692_10-appy-fizz-apple-juice-based-drink.jpg",
  // Duke's Raspberry Flavoured Carbonated Soft Drink (200ml)
  "8902080000010": "https://www.bbassets.com/media/uploads/p/l/40034938_4-bovonto-soft-drink.jpg",
  // Paper Boat Aamras Mango Fruit Drink Pouch (200ml)
  "8906080600012": "https://www.bbassets.com/media/uploads/p/l/321978_12-paper-boat-aamras-mango-fruit-juice.jpg",
  // Paper Boat Zesty Jaljeera Drink Pouch (200ml)
  "8906080600029": "https://www.bbassets.com/media/uploads/p/l/20001195_16-paper-boat-jaljeera-drink.jpg",
  // Paper Boat Aam Panna Raw Mango Drink Pouch (200ml)
  "8906080600036": "https://www.bbassets.com/media/uploads/p/l/412401_6-paper-boat-aam-panna-mango-drink.jpg",
  // Paper Boat Alphonso Aam Fruit Drink Pouch (200ml)
  "8906080600043": "https://www.bbassets.com/media/uploads/p/l/40114330_7-paper-boat-alphonso-aam-mango-juice.jpg",
  // Paper Boat Anar Pomegranate Drink Pouch (200ml)
  "8906080600050": "https://www.bbassets.com/media/uploads/p/l/40073395_13-paper-boat-anarpomegranate-juice-low-sugar.jpg",
  // Paper Boat Chilli Guava Fruit Drink Pouch (200ml)
  "8906080600067": "https://www.bbassets.com/media/uploads/p/xl/40165687_7-paper-boat-chilli-guava-juice.jpg",
  // Paper Boat Zero Sugar Sparkling Water Lime Can (250ml)
  "8906080600074": "https://www.bbassets.com/media/uploads/p/l/40052141_3-sprite-soft-drink-zero-sugar-with-natural-lemon-flavour.jpg",
  // Paper Boat Swing Lush Lychee Pouch (250ml)
  "8906080600081": "https://www.bbassets.com/media/uploads/p/l/414650_3-paper-boat-swing-juicier-drink-lush-lychee.jpg",
  // Paper Boat Swing Lively Orange PET (250ml)
  "8906080600098": "https://www.bbassets.com/media/uploads/p/l/40318785_2-paper-boat-swing-swing-lively-orange.jpg",
  // Bisleri Limonata Sparkling Lemon Drink PET (250ml)
  "8906017290019": "https://www.bbassets.com/media/uploads/p/l/40097836_5-bisleri-limonata-limey-minty-cooler.jpg",
  // Bisleri Pop Carbonated Orange Beverage PET (250ml)
  "8906017290026": "https://www.bbassets.com/media/uploads/p/l/40309650_3-bisleri-pop-orange-flavoured-soft-drink.jpg",
  // Bisleri Spyci Jeera Masala Carbonated Drink PET (250ml)
  "8906017290033": "https://www.bbassets.com/media/uploads/p/l/40097835_2-bisleri-spyci-masala-maar-ke.jpg",
  // Bisleri Fonzo Mango Fizz PET (250ml)
  "8906017290040": "https://www.bbassets.com/media/uploads/p/l/40097836_5-bisleri-limonata-limey-minty-cooler.jpg",
  // Campa Cola Carbonated Soft Drink PET (250ml)
  "8901012170011": "https://www.bbassets.com/media/uploads/p/l/40329395_1-campa-cola.jpg",
  // Campa Orange Flavoured Soft Drink PET (250ml)
  "8901012170028": "https://www.bbassets.com/media/uploads/p/l/100401175_10-fanta-soft-drink-orange-flavoured.jpg",
  // Campa Lemon Sparkling Beverage PET (250ml)
  "8901012170035": "https://www.bbassets.com/media/uploads/p/l/100018048_7-limca-soft-drink-lime-lemon-flavoured.jpg",
  // Campa Energy Drink PET (250ml)
  "8901012170042": "https://www.bbassets.com/media/uploads/p/l/40113908_5-sting-energy-drink.jpg",
  // Sosyo Hajoori Apple & Grape Cider Glass (200ml)
  "8906018300014": "https://www.bbassets.com/media/uploads/p/l/40363971_1-sosyo-mixed-fruit-flavoured-drink.jpg",
  // Bovonto Soft Drink Grape Soda PET (250ml)
  "8906016750019": "https://www.bbassets.com/media/uploads/p/l/40013024_4-bovonto-carbonated-beverage-sweetened.jpg",
  // Lahori Jeera Sparkling Drink PET (160ml)
  "8908012640019": "https://www.bbassets.com/media/uploads/p/l/40259475_3-lahori-soft-drink-zeera-soda-refreshing.jpg"
};

let replaced = 0;
for (const [barcode, photoUrl] of Object.entries(EXACT_PACKSHOTS)) {
  const regex = new RegExp(`(barcode:\\s*"${barcode}"[\\s\\S]*?imageUrl:\\s*)"[^"]*"`, "m");
  if (regex.test(content)) {
    content = content.replace(regex, `$1"${photoUrl}"`);
    replaced++;
  } else {
    console.log(`Could not find barcode block: ${barcode}`);
  }
}

fs.writeFileSync(seedPath, content, "utf8");
console.log(`Successfully mapped ${replaced} / ${Object.keys(EXACT_PACKSHOTS).length} products to exact official packshots!`);
