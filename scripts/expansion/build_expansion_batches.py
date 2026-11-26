import json
import re

# Load existing cache to ensure zero collisions
with open("scripts/data/existing_products_cache.json") as f:
    cache = json.load(f)

existing_barcodes = set(cache.get("barcodes", []))
existing_names = set([n.lower().strip() for n in cache.get("names", [])])

# Also check batch1
with open("scripts/expansion/batch1_snacks_bakery.ts") as f:
    t = f.read()
b1_bcs = re.findall(r'barcode:\s*"([^"]+)"', t)
for b in b1_bcs:
    existing_barcodes.add(b)

print(f"Loaded existing cache: {len(existing_barcodes)} barcodes to avoid")

# Category definitions and slugs
CATEGORIES = {
    5: ("Protein Bars, Energy Bars & Wafers", "protein-bars-energy-bars-wafers"),
    6: ("Breakfast Cereals, Muesli & Granola", "breakfast-cereals-muesli-granola"),
    7: ("Oats & Porridge", "oats-porridge"),
    8: ("Bakery & Breads", "bakery-breads"),
    9: ("Noodles, Pasta & Vermicelli", "noodles-pasta-vermicelli"),
    10: ("Ready-to-Eat Meals & Instant Foods", "ready-to-eat-meals-instant-foods"),
    11: ("Ready-to-Cook Mixes", "ready-to-cook-mixes"),
    12: ("Rice, Grains, Pulses & Flours", "rice-grains-pulses-flours"),
    13: ("Nuts, Seeds & Trail Mixes", "nuts-seeds-trail-mixes"),
    14: ("Nut Butters, Spreads & Dips", "nut-butters-spreads-dips"),
    15: ("Sauces, Condiments & Seasonings", "sauces-condiments-seasonings"),
    16: ("Dairy, Yogurt & Dairy Alternatives", "dairy-yogurt-dairy-alternatives"),
    17: ("Beverages & Drink Mixes", "beverages-drink-mixes"),
    18: ("Ice Cream & Frozen Desserts", "ice-cream-frozen-desserts"),
    19: ("Plant-Based Foods & Meat Alternatives", "plant-based-foods-meat-alternatives")
}
