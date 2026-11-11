import re
import json

raw_text = """
1. Chocolate cereals
No.
Product name
Brand
Details
1
Chocos
Kellogg's
Chocolate-flavoured wheat cereal
2
Chocos Duet
Kellogg's
Chocolate and vanilla cereal
3
Chocos Fills
Kellogg's
Chocolate-filled crunchy pillows
4
Chocos Moons & Stars
Kellogg's
Chocolate cereal in fun shapes
5
Chocos Crunchy Bites
Kellogg's
Bite-sized chocolate cereal
6
Nesquik Chocolate Cereal
Nestlé
Chocolate-flavoured puffed cereal
7
Nesquik Duo
Nestlé
Dual-colour chocolate cereal
8
Cocoa Krispies
Kellogg's
Chocolate-flavoured rice cereal
9
Coco Pops
Kellogg's
Chocolate rice cereal
10
Coco Pops Rocks
Kellogg's
Chocolate-coated crunchy cereal
11
Coco Pops Chocos
Kellogg's
Chocolate cereal pieces
12
Cookie Crisp
General Mills
Cookie-shaped chocolate cereal
13
Reese's Puffs
General Mills
Peanut butter and chocolate cereal
14
Cocoa Puffs
General Mills
Chocolate-flavoured corn puffs
15
Krave Chocolate
Kellogg's
Chocolate-filled crunchy cereal
16
Krave Double Chocolate
Kellogg's
Double chocolate-filled cereal
17
Krave S'mores
Kellogg's
Chocolate and marshmallow-inspired cereal
18
Chocolate Cheerios
General Mills
Chocolate-flavoured oat rings
19
Chocolate Mini-Wheats
Kellogg's
Chocolate-coated shredded wheat
20
Chocolate Crunch
Weetabix
Chocolate breakfast cereal
2. Honey, caramel and sweet cereals
No.
Product name
Brand
Details
21
Honey Loops
Kellogg's
Honey-flavoured cereal rings
22
Honey Nut Cheerios
General Mills
Honey and nut-flavoured oat rings
23
Honey Cheerios
General Mills
Honey-coated oat cereal
24
Honey Bunches of Oats
Post
Honey-coated flakes and oat clusters
25
Honey Bunches of Oats with Almonds
Post
Honey cereal with almonds
26
Honey Bunches of Oats with Strawberries
Post
Honey cereal with strawberry pieces
27
Honey Bunches of Oats with Vanilla Bunches
Post
Vanilla and honey cereal clusters
28
Honey Smacks
Kellogg's
Sweetened puffed wheat cereal
29
Golden Grahams
General Mills
Honey-graham flavoured cereal
30
Golden Crisp
Post
Sweetened puffed wheat cereal
31
Sugar Smacks
Kellogg's
Sweetened puffed wheat cereal
32
Honeycomb
Post
Honey-flavoured honeycomb-shaped cereal
33
Honey Stars
Nestlé
Honey-flavoured star-shaped cereal
34
Honey Nut Shredded Wheat
Nestlé
Honey-flavoured wheat cereal
35
Frosted Flakes
Kellogg's
Sugar-coated corn flakes
36
Frosties
Kellogg's
Sweetened crunchy corn flakes
37
Frosted Cheerios
General Mills
Sweetened toasted oat rings
38
Cinnamon Toast Crunch
General Mills
Cinnamon-sugar cereal squares
39
French Toast Crunch
General Mills
French-toast-shaped sweet cereal
40
Curiously Cinnamon
Kellogg's
Cinnamon-flavoured cereal squares
3. Fruit-flavoured and colourful cereals
No.
Product name
Brand
Details
41
Froot Loops
Kellogg's
Fruity multicoloured cereal rings
42
Apple Jacks
Kellogg's
Apple and cinnamon cereal rings
43
Trix
General Mills
Fruity multicoloured cereal shapes
44
Fruity Pebbles
Post
Fruity crispy rice cereal
45
Berry Pebbles
Post
Berry-flavoured rice cereal
46
Marshmallow Fruity Pebbles
Post
Fruity cereal with marshmallows
47
Berry Burst Cheerios
General Mills
Berry-flavoured oat rings
48
Very Berry Cheerios
General Mills
Mixed berry-flavoured cereal
49
Strawberry Cheerios
General Mills
Strawberry-flavoured oat rings
50
Blueberry Cheerios
General Mills
Blueberry-flavoured oat rings
51
Strawberry Mini-Wheats
Kellogg's
Strawberry-flavoured wheat biscuits
52
Berry Burst Mini-Wheats
Kellogg's
Berry-flavoured wheat cereal
53
Strawberry Squares
Nestlé
Strawberry-flavoured cereal squares
54
Strawberry Shreddies
Nestlé
Strawberry-flavoured wheat squares
55
Apple Cinnamon Cheerios
General Mills
Apple and cinnamon oat rings
56
Blueberry Morning
Post
Blueberry-flavoured breakfast cereal
57
Strawberry Frosted Mini-Wheats
Kellogg's
Frosted wheat biscuits with strawberry flavour
58
Fruit Loops with Marshmallows
Kellogg's
Fruity rings and marshmallows
59
Apple Cinnamon Crunch
General Mills
Apple and cinnamon cereal
60
Berry Kix
General Mills
Berry-flavoured corn puffs
61
Berry Berry Kix
General Mills
Mixed berry-flavoured cereal puffs
62
Fruity Cheerios
General Mills
Fruity-flavoured oat rings
63
Unicorn Cereal
Kellogg's
Colourful sweetened cereal
64
Unicorn Fruity Pebbles
Post
Fruity cereal with colourful theme
65
Rainbow Krispies
Kellogg's
Colourful crispy rice cereal
4. Marshmallow and fun-shaped cereals
No.
Product name
Brand
Details
66
Lucky Charms
General Mills
Oat cereal with marshmallow shapes
67
Chocolate Lucky Charms
General Mills
Chocolate cereal with marshmallows
68
Berry Lucky Charms
General Mills
Berry-flavoured cereal and marshmallows
69
Magic Spoon Marshmallow
Magic Spoon
Low-sugar marshmallow-style cereal
70
Count Chocula
General Mills
Chocolate cereal with marshmallows
71
Franken Berry
General Mills
Strawberry-flavoured cereal with marshmallows
72
Boo Berry
General Mills
Blueberry-flavoured cereal with marshmallows
73
Monster Mash Cereal
General Mills
Halloween-themed cereal with marshmallows
74
Smorz
Kellogg's
Chocolate, marshmallow and graham cereal
75
Waffle Crisp
Post
Waffle-flavoured crunchy cereal
76
Rice Krispies
Kellogg's
Puffed crispy rice cereal
77
Rice Krispies Multigrain Shapes
Kellogg's
Multigrain cereal in fun shapes
78
Disney Mickey Mouse Cereal
Kellogg's
Character-shaped breakfast cereal
79
PAW Patrol Cereal
General Mills
Children's character-themed cereal
80
CinnaScary Apple Jacks
Kellogg's
Limited-edition apple cinnamon cereal
81
Dora the Explorer Cereal
General Mills
Character-themed breakfast cereal
82
Clifford Crunch
Cascadian Farm
Children's wholegrain cereal
83
Booty-O's
WWE
Ring-shaped sweet breakfast cereal
84
Cap'n Crunch's Crunch Berries
Quaker
Crunchy cereal with berry pieces
85
Cap'n Crunch's Oops! All Berries
Quaker
Berry-flavoured crunchy cereal
86
Cap'n Crunch's Peanut Butter Crunch
Quaker
Peanut butter-flavoured cereal
87
Cap'n Crunch's Halloween Crunch
Quaker
Seasonal sweetened cereal
88
Cap'n Crunch's Christmas Crunch
Quaker
Festive cereal with coloured pieces
89
Franken Berry Mini Cereal
General Mills
Mini-format strawberry cereal
90
Chocolate Marshmallow Mateys
Malt-O-Meal
Chocolate cereal with marshmallows
5. Corn, rice and wheat-based children's cereals
No.
Product name
Brand
Details
91
Corn Pops
Kellogg's
Sweetened puffed corn cereal
92
Corn Pops Caramel
Kellogg's
Caramel-flavoured corn cereal
93
Corn Flakes
Kellogg's
Toasted corn flakes
94
Frosted Corn Flakes
Kellogg's
Sweetened corn flakes
95
Rice Krispies Multigrain
Kellogg's
Multigrain crispy rice cereal
96
Coco Krispies
Kellogg's
Chocolate-flavoured crispy rice
97
Rice Bubbles
Kellogg's
Puffed crispy rice cereal
98
Kix
General Mills
Lightly sweetened corn puffs
99
Honey Kix
General Mills
Honey-flavoured corn puffs
100
Golden Grahams S'mores
General Mills
Graham, chocolate and marshmallow cereal
101
Mini-Wheats Original
Kellogg's
Frosted wholegrain wheat biscuits
102
Mini-Wheats Little Bites
Kellogg's
Small frosted wheat biscuits
103
Mini-Wheats Chocolate
Kellogg's
Chocolate-flavoured wheat biscuits
104
Weetabix
Weetabix
Wholegrain wheat biscuits
105
Weetabix Minis Chocolate
Weetabix
Chocolate-flavoured mini cereal bites
106
Weetabix Minis Fruit & Nut
Weetabix
Fruit and nut cereal bites
107
Weetabix Minis Banana
Weetabix
Banana-flavoured mini cereal
108
Weetabix Crispy Minis
Weetabix
Crunchy mini wheat cereal
109
Shreddies Original
Nestlé
Wholegrain shredded wheat squares
110
Shreddies Frosted
Nestlé
Frosted shredded wheat squares
111
Shreddies Coco
Nestlé
Chocolate shredded wheat squares
112
Shreddies Honey
Nestlé
Honey-flavoured wheat squares
113
Shredded Wheat Bitesize
Nestlé
Bite-sized wholegrain wheat cereal
114
Golden Nuggets
Nestlé
Sweetened crunchy wheat cereal
115
Lion Cereal
Nestlé
Chocolate and caramel cereal
116
Chocapic
Nestlé
Chocolate wholegrain cereal
117
Chocapic Duo
Nestlé
Dual chocolate-flavoured cereal
118
Koko Krunch
Nestlé
Chocolate-flavoured wheat cereal
119
Koko Krunch Duo
Nestlé
Dual-flavour chocolate cereal
120
KitKat Cereal
Nestlé
Chocolate and wafer-flavoured cereal
6. International and premium kids' cereals
No.
Product name
Brand
Details
121
Cini Minis
Nestlé
Cinnamon-flavoured crunchy squares
122
Cookie Crisp
Nestlé
Mini chocolate chip cookie cereal
123
Cookie Crisp Sprinkles
Nestlé
Cookie cereal with colourful sprinkles
124
Nesquik Duo
Nestlé
Two-colour chocolate cereal
125
Nesquik Strawberry
Nestlé
Strawberry-flavoured cereal
126
Nesquik Banana
Nestlé
Banana-flavoured cereal
127
Nesquik Choco Waves
Nestlé
Chocolate-flavoured cereal pieces
128
Choco Flakes
Nestlé
Chocolate-coated flakes
129
Choco Shells
Nestlé
Chocolate shell-shaped cereal
130
Choco Balls
Nestlé
Chocolate cereal balls
131
Choco Krispies
Nestlé
Chocolate crispy rice cereal
132
Choco Pops
Nestlé
Chocolate puffed rice cereal
133
Choco Stars
Nestlé
Chocolate star-shaped cereal
134
Honey Stars
Nestlé
Honey-flavoured star cereal
135
Golden Minis
Nestlé
Sweetened mini cereal pieces
136
Fitness Chocolate
Nestlé
Chocolate-flavoured wheat flakes
137
Fitness Strawberry
Nestlé
Strawberry-flavoured cereal flakes
138
Lion Wildberry
Nestlé
Berry-flavoured cereal
139
Lion Caramel & Chocolate
Nestlé
Caramel and chocolate cereal
140
Nesquik Alphabet
Nestlé
Chocolate alphabet-shaped cereal
141
Alpen Strawberry & Yogurt
Weetabix
Strawberry and yogurt muesli
142
Alpen Original
Weetabix
Oat, wheat, fruit and nut muesli
143
Alpen No Added Sugar
Weetabix
No-added-sugar muesli
144
Jordans Country Crisp Strawberry
Jordans
Crunchy strawberry granola
145
Jordans Country Crisp Chocolate
Jordans
Chocolate granola clusters
146
Jordans Country Crisp Honey
Jordans
Honey-coated oat clusters
147
Dorset Cereals Simply Nutty
Dorset Cereals
Nut and oat breakfast cereal
148
Dorset Cereals Berry Burst
Dorset Cereals
Berry and wholegrain muesli
149
Cheerios Multigrain
Nestlé
Multigrain oat rings
150
Cheerios Honey
Nestlé
Honey-flavoured wholegrain rings
151
Cheerios Apple Cinnamon
Nestlé
Apple and cinnamon cereal
152
Cheerios Chocolate
Nestlé
Chocolate-flavoured cereal rings
153
Nesfit Cereal
Nestlé
Wholegrain breakfast cereal
154
Nesfit Chocolate
Nestlé
Chocolate-flavoured wholegrain cereal
155
Nesfit Honey
Nestlé
Honey-flavoured wholegrain cereal
156
Passatempo Cereal
Nestlé
Biscuit-inspired breakfast cereal
157
Milo Cereal
Nestlé
Malt and chocolate-flavoured cereal
158
Milo Duo
Nestlé
Dual-texture malt chocolate cereal
159
Crunch Cereal
Nestlé
Chocolate-flavoured crunchy cereal
160
Nesquik Alphabet
Nestlé
Alphabet-shaped chocolate cereal
7. Organic and natural kids' cereals
No.
Product name
Brand
Details
161
Gorilla Munch
EnviroKidz
Organic corn puff cereal
162
Koala Crisp
EnviroKidz
Organic chocolate rice cereal
163
Leapin' Lemurs
EnviroKidz
Organic peanut butter cereal
164
Panda Puffs
EnviroKidz
Organic peanut butter corn puffs
165
Amazon Flakes
EnviroKidz
Organic crunchy flakes
166
Choco Chimps
EnviroKidz
Organic chocolate cereal
167
Jungle Munch
EnviroKidz
Organic wholegrain cereal
168
Penguin Puffs
EnviroKidz
Organic puffed cereal
169
Organic Corn Flakes
Nature's Path
Organic corn breakfast cereal
170
Organic Mesa Sunrise
Nature's Path
Organic multigrain flakes
171
Heritage Flakes
Nature's Path
Multigrain and wholegrain flakes
172
Organic Flax Plus Pumpkin Raisin Crunch
Nature's Path
Flax, pumpkin and raisin cereal
173
Organic Sunrise Crunchy Vanilla
Nature's Path
Vanilla-flavoured organic cereal
174
Organic Sunrise Crunchy Maple
Nature's Path
Maple-flavoured cereal
175
Peanut Butter Panda Puffs
Nature's Path
Organic peanut butter cereal
176
Organic Honey Nut O's
Cascadian Farm
Organic honey-flavoured cereal rings
177
Organic Purely O's
Cascadian Farm
Organic wholegrain cereal rings
178
Organic Cinnamon Crunch
Cascadian Farm
Organic cinnamon cereal
179
Organic Berry Vanilla Puffs
Barbara's
Berry and vanilla puff cereal
180
Original Puffins
Barbara's
Crunchy wholegrain corn cereal
8. Baby, toddler and junior breakfast cereals
No.
Product name
Brand
Details
181
Nestum Rice
Nestlé
Infant rice cereal
182
Nestum Wheat
Nestlé
Infant wheat cereal
183
Nestum Multicereal
Nestlé
Multigrain infant cereal
184
Nestum Honey
Nestlé
Honey-flavoured cereal product; check age suitability
185
Cerelac Rice
Nestlé
Infant rice-based cereal
186
Cerelac Wheat
Nestlé
Infant wheat cereal
187
Cerelac Multigrain
Nestlé
Multigrain infant cereal
188
Cerelac Rice & Vegetables
Nestlé
Rice and vegetable infant cereal
189
Cerelac Wheat & Apple
Nestlé
Wheat and apple infant cereal
190
Cerelac Wheat & Banana
Nestlé
Wheat and banana infant cereal
191
Cerelac Wheat & Honey
Nestlé
Wheat-based infant cereal
192
Gerber Oatmeal Cereal
Gerber
Infant oatmeal cereal
193
Gerber Rice Cereal
Gerber
Infant rice cereal
194
Gerber Multigrain Cereal
Gerber
Multigrain infant cereal
195
Gerber Whole Wheat Cereal
Gerber
Whole wheat infant cereal
196
Earth's Best Organic Oatmeal Cereal
Earth's Best
Organic infant oatmeal
197
Earth's Best Organic Rice Cereal
Earth's Best
Organic infant rice cereal
198
Earth's Best Organic Multigrain Cereal
Earth's Best
Organic multigrain cereal
199
Happy Baby Organic Oatmeal Cereal
Happy Baby
Organic infant oatmeal
200
Happy Baby Organic Multigrain Cereal
Happy Baby
Organic multigrain infant cereal
9. Slurrp Farm kids' cereals
No.
Product name
Brand
Cereal type
Details
201
Chocolate Stars & Moons Cereal
Slurrp Farm
Chocolate millet cereal
Chocolate cereal shaped like stars and moons
202
Ragi, Almond and Banana Cereal
Slurrp Farm
Sprouted ragi cereal
Ragi-based cereal with almond and banana
203
Wheat, Apple & Date with Milk
Slurrp Farm
Instant wheat cereal
Wheat cereal with apple, dates and milk
204
Wheat, Apple & Banana Cereal
Slurrp Farm
Instant fruit cereal
Wheat-based cereal with apple and banana
205
Strawberry, Ragi & Rice Cereal with Milk
Slurrp Farm
Fruit and millet cereal
Strawberry, ragi and rice combination
206
Banana, Ragi and Rice Cereal with Milk
Slurrp Farm
Fruit and millet cereal
Banana, ragi and rice combination
207
Mango, Ragi and Rice Cereal with Milk
Slurrp Farm
Fruit and millet cereal
Mango, ragi and rice combination
208
Sweet Potato, Beetroot & Oat Cereal with Milk
Slurrp Farm
Vegetable oat cereal
Oats with sweet potato and beetroot
209
Sweet Potato, Carrot & Oat Cereal with Milk
Slurrp Farm
Vegetable oat cereal
Oats with sweet potato and carrot
210
Multigrain Millets and Mixed Fruits with Milk
Slurrp Farm
Multigrain fruit cereal
Millet-based cereal with mixed fruits and date powder
"""

lines = [l.strip() for l in raw_text.strip().split("\n") if l.strip()]

SECTIONS = {
    1: "Chocolate Cereals",
    2: "Honey, Caramel & Sweet Cereals",
    3: "Fruit-Flavoured & Colourful Cereals",
    4: "Marshmallow & Fun-Shaped Cereals",
    5: "Corn, Rice & Wheat-Based Children's Cereals",
    6: "International & Premium Kids' Cereals",
    7: "Organic & Natural Kids' Cereals",
    8: "Baby, Toddler & Junior Breakfast Cereals",
    9: "Slurrp Farm Kids' Cereals"
}

items = []
current_sec_num = 1
i = 0
while i < len(lines):
    line = lines[i]
    m_sec = re.match(r"^(\d+)\.\s+(.*)$", line)
    if m_sec:
        current_sec_num = int(m_sec.group(1))
        i += 1
        continue
    if line in ["No.", "Product name", "Brand", "Details", "Cereal type"]:
        i += 1
        continue
    if line.isdigit():
        num = int(line)
        # Check if section 9 (which has 4 lines per item: num, name, brand, type, details)
        if current_sec_num == 9:
            name = lines[i+1]
            brand = lines[i+2]
            ctype = lines[i+3]
            details = lines[i+4]
            i += 5
        else:
            name = lines[i+1]
            brand = lines[i+2]
            details = lines[i+3]
            ctype = "Breakfast Cereal"
            i += 4
        
        items.append({
            "number": num,
            "productId": f"KID-{num:04d}",
            "name": name,
            "brand": brand,
            "sectionNumber": current_sec_num,
            "sectionName": SECTIONS[current_sec_num],
            "cerealType": ctype,
            "details": details
        })
    else:
        i += 1

print(f"Parsed {len(items)} Kids' Cereals items.")
assert len(items) == 210, f"Expected 210 items, got {len(items)}"

with open("scripts/data/parsed_kids_cereals_210.json", "w") as f:
    json.dump(items, f, indent=2)
print("Saved to scripts/data/parsed_kids_cereals_210.json")
