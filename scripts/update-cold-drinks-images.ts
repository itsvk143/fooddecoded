import fs from "fs";
import path from "path";

const seedPath = path.join(process.cwd(), "src/lib/seed-data.ts");
let content = fs.readFileSync(seedPath, "utf8");

// Map of image filename to authentic photo URL
const SVG_TO_PHOTO_MAP: Record<string, string> = {
  "coca-cola-classic.svg": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
  "coca-cola-india.svg": "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=600&q=80",
  "coca-cola-zero.svg": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
  "diet-coke.svg": "https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?auto=format&fit=crop&w=600&q=80",
  "thums-up.svg": "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=600&q=80",
  "thums-up-charged.svg": "https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&w=600&q=80",
  "sprite.svg": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=600&q=80",
  "sprite-zero.svg": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
  "limca.svg": "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?auto=format&fit=crop&w=600&q=80",
  "fanta-orange.svg": "https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&w=600&q=80",
  "maaza.svg": "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80",
  "minutemaid-orange.svg": "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
  "minutemaid-guava.svg": "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=600&q=80",
  "schweppes-tonic.svg": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
  "schweppes-ginger-ale.svg": "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=600&q=80",
  "schweppes-bitter-lemon.svg": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
  "pepsi-original.svg": "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=600&q=80",
  "pepsi-black.svg": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
  "diet-pepsi.svg": "https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?auto=format&fit=crop&w=600&q=80",
  "7up.svg": "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=600&q=80",
  "7up-nimbooz.svg": "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?auto=format&fit=crop&w=600&q=80",
  "mountain-dew.svg": "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=600&q=80",
  "mirinda.svg": "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80",
  "slice.svg": "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80",
  "sting.svg": "https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&w=600&q=80",
  "tropicana-apple.svg": "https://images.unsplash.com/photo-1576186726580-a816e8b12896?auto=format&fit=crop&w=600&q=80",
  "tropicana-mixed-fruit.svg": "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=600&q=80",
  "frooti.svg": "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80",
  "appy.svg": "https://images.unsplash.com/photo-1576186726580-a816e8b12896?auto=format&fit=crop&w=600&q=80",
  "appy-fizz.svg": "https://images.unsplash.com/photo-1568644396922-5c3bfae12521?auto=format&fit=crop&w=600&q=80",
  "b-fizz.svg": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
  "dukes-raspberry.svg": "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80",
  "paperboat-aamras.svg": "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80",
  "paperboat-jaljeera.svg": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
  "paperboat-aam-panna.svg": "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?auto=format&fit=crop&w=600&q=80",
  "paperboat-alphonso.svg": "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80",
  "paperboat-swing-orange.svg": "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80",
  "paperboat-swing-lychee.svg": "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=600&q=80",
  "paperboat-swing-mixed.svg": "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=600&q=80",
  "paperboat-zero-lime.svg": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
  "bisleri-limonata.svg": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=600&q=80",
  "bisleri-pop.svg": "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80",
  "bisleri-fonzo.svg": "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80",
  "bisleri-jeera.svg": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
  "campa-cola.svg": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
  "campa-orange.svg": "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80",
  "campa-lemon.svg": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
  "sosyo.svg": "https://images.unsplash.com/photo-1568644396922-5c3bfae12521?auto=format&fit=crop&w=600&q=80",
  "bovonto.svg": "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80",
  "lahori-zeera.svg": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
};

let count = 0;
for (const [svgFile, photoUrl] of Object.entries(SVG_TO_PHOTO_MAP)) {
  const target = `/images/cold-drinks/${svgFile}`;
  if (content.includes(target)) {
    content = content.replaceAll(target, photoUrl);
    count++;
  }
}

fs.writeFileSync(seedPath, content, "utf8");
console.log(`Successfully replaced ${count} SVG paths with authentic photographs!`);
