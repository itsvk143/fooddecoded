import re
import json

raw_text = """
## 1. Carbonated Soft Drinks (1–75)

| No. | Product name                   | Brand            | Details                 |
| --- | ------------------------------ | ---------------- | ----------------------- |
| 1   | Coca-Cola Original             | Coca-Cola        | Classic cola            |
| 2   | Diet Coke                      | Coca-Cola        | Sugar-free cola         |
| 3   | Coca-Cola Zero Sugar           | Coca-Cola        | Zero-sugar cola         |
| 4   | Coca-Cola Cherry               | Coca-Cola        | Cherry cola             |
| 5   | Coca-Cola Vanilla              | Coca-Cola        | Vanilla cola            |
| 6   | Coca-Cola Lemon                | Coca-Cola        | Lemon cola              |
| 7   | Thums Up                       | Coca-Cola        | Strong cola             |
| 8   | Thums Up X Force               | Coca-Cola        | Strong cola variant     |
| 9   | Sprite                         | Coca-Cola        | Lemon-lime soda         |
| 10  | Sprite Zero Sugar              | Coca-Cola        | Sugar-free lemon-lime   |
| 11  | Sprite Lemon+                  | Coca-Cola        | Lemon-flavoured soda    |
| 12  | Fanta Orange                   | Coca-Cola        | Orange soda             |
| 13  | Fanta Green Apple              | Coca-Cola        | Green apple soda        |
| 14  | Fanta Strawberry               | Coca-Cola        | Strawberry soda         |
| 15  | Fanta Grape                    | Coca-Cola        | Grape soda              |
| 16  | Fanta Pineapple                | Coca-Cola        | Pineapple soda          |
| 17  | Limca                          | Coca-Cola        | Lemon-lime drink        |
| 18  | RimZim Jeera                   | Coca-Cola        | Cumin-flavoured soda    |
| 19  | Schweppes Indian Tonic Water   | Schweppes        | Tonic water             |
| 20  | Schweppes Ginger Ale           | Schweppes        | Ginger soda             |
| 21  | Schweppes Soda Water           | Schweppes        | Carbonated water        |
| 22  | Schweppes Bitter Lemon         | Schweppes        | Bitter lemon soda       |
| 23  | Schweppes Club Soda            | Schweppes        | Soda water              |
| 24  | Pepsi                          | Pepsi            | Classic cola            |
| 25  | Pepsi Black                    | Pepsi            | Zero-sugar cola         |
| 26  | Diet Pepsi                     | Pepsi            | Diet cola               |
| 27  | Pepsi Wild Cherry              | Pepsi            | Cherry cola             |
| 28  | Pepsi Vanilla                  | Pepsi            | Vanilla cola            |
| 29  | Pepsi Lime                     | Pepsi            | Lime cola               |
| 30  | Mountain Dew                   | PepsiCo          | Citrus soda             |
| 31  | Mountain Dew Code Red          | PepsiCo          | Cherry citrus soda      |
| 32  | Mountain Dew Voltage           | PepsiCo          | Raspberry citrus soda   |
| 33  | Mountain Dew Baja Blast        | PepsiCo          | Tropical lime soda      |
| 34  | Mountain Dew Major Melon       | PepsiCo          | Watermelon soda         |
| 35  | 7UP                            | PepsiCo          | Lemon-lime soda         |
| 36  | 7UP Zero Sugar                 | PepsiCo          | Sugar-free lemon-lime   |
| 37  | Mirinda Orange                 | PepsiCo          | Orange soda             |
| 38  | Mirinda Green Apple            | PepsiCo          | Apple soda              |
| 39  | Mirinda Strawberry             | PepsiCo          | Strawberry soda         |
| 40  | Sting Energy                   | PepsiCo          | Carbonated energy drink |
| 41  | Dr Pepper                      | Keurig Dr Pepper | Spiced fruit cola       |
| 42  | Dr Pepper Zero Sugar           | Keurig Dr Pepper | Zero-sugar cola         |
| 43  | Dr Pepper Cherry               | Keurig Dr Pepper | Cherry-flavoured soda   |
| 44  | Dr Pepper Cream Soda           | Keurig Dr Pepper | Cream soda              |
| 45  | Sprite Cherry                  | Coca-Cola        | Cherry lemon-lime soda  |
| 46  | A&W Root Beer                  | A&W              | Root beer               |
| 47  | A&W Cream Soda                 | A&W              | Cream soda              |
| 48  | Mug Root Beer                  | PepsiCo          | Root beer               |
| 49  | Barq's Root Beer               | Coca-Cola        | Root beer               |
| 50  | Barq's Red Creme Soda          | Coca-Cola        | Red cream soda          |
| 51  | Crush Orange                   | Keurig Dr Pepper | Orange soda             |
| 52  | Crush Grape                    | Keurig Dr Pepper | Grape soda              |
| 53  | Crush Strawberry               | Keurig Dr Pepper | Strawberry soda         |
| 54  | Crush Pineapple                | Keurig Dr Pepper | Pineapple soda          |
| 55  | Sunkist Orange                 | Keurig Dr Pepper | Orange soda             |
| 56  | Sunkist Zero Sugar             | Keurig Dr Pepper | Sugar-free orange       |
| 57  | Fanta Lemon                    | Coca-Cola        | Lemon soda              |
| 58  | Fanta Exotic                   | Coca-Cola        | Tropical fruit soda     |
| 59  | Fanta Berry                    | Coca-Cola        | Berry soda              |
| 60  | Fanta Peach                    | Coca-Cola        | Peach soda              |
| 61  | Canada Dry Ginger Ale          | Canada Dry       | Ginger soda             |
| 62  | Canada Dry Tonic Water         | Canada Dry       | Tonic water             |
| 63  | Vernors Ginger Ale             | Vernors          | Ginger soda             |
| 64  | Squirt                         | Keurig Dr Pepper | Grapefruit soda         |
| 65  | Fresca                         | Coca-Cola        | Grapefruit citrus soda  |
| 66  | Jarritos Mandarin              | Jarritos         | Mandarin soda           |
| 67  | Jarritos Lime                  | Jarritos         | Lime soda               |
| 68  | Jarritos Guava                 | Jarritos         | Guava soda              |
| 69  | Jarritos Tamarind              | Jarritos         | Tamarind soda           |
| 70  | Jarritos Pineapple             | Jarritos         | Pineapple soda          |
| 71  | Bundaberg Ginger Beer          | Bundaberg        | Ginger beverage         |
| 72  | Bundaberg Lemon Lime & Bitters | Bundaberg        | Citrus bitters soda     |
| 73  | Sanpellegrino Aranciata        | Sanpellegrino    | Italian orange soda     |
| 74  | Sanpellegrino Limonata         | Sanpellegrino    | Italian lemon soda      |
| 75  | Sanpellegrino Chinotto         | Sanpellegrino    | Bitter citrus soda      |

## 2. Indian Fruit Drinks and Juice-Based Beverages (76–150)

| No. | Product name                 | Brand         | Details                     |
| --- | ---------------------------- | ------------- | --------------------------- |
| 76  | Maaza Mango                  | Maaza         | Mango drink                 |
| 77  | Maaza Guava                  | Maaza         | Guava drink                 |
| 78  | Slice Mango                  | Slice         | Mango drink                 |
| 79  | Frooti Mango                 | Frooti        | Mango drink                 |
| 80  | Appy Fizz                    | Appy Fizz     | Sparkling apple drink       |
| 81  | B Natural Mango              | ITC B Natural | Mango juice                 |
| 82  | B Natural Mixed Fruit        | ITC B Natural | Mixed fruit juice           |
| 83  | B Natural Orange             | ITC B Natural | Orange juice                |
| 84  | B Natural Pomegranate        | ITC B Natural | Pomegranate juice           |
| 85  | B Natural Guava              | ITC B Natural | Guava juice                 |
| 86  | Real Mango                   | Real          | Mango juice                 |
| 87  | Real Orange                  | Real          | Orange juice                |
| 88  | Real Apple                   | Real          | Apple juice                 |
| 89  | Real Mixed Fruit             | Real          | Mixed fruit juice           |
| 90  | Real Pomegranate             | Real          | Pomegranate juice           |
| 91  | Real Guava                   | Real          | Guava juice                 |
| 92  | Real Litchi                  | Real          | Litchi juice                |
| 93  | Real Pineapple               | Real          | Pineapple juice             |
| 94  | Real Cranberry               | Real          | Cranberry beverage          |
| 95  | Real Coconut Water           | Real Activ    | Coconut water               |
| 96  | Tropicana Orange             | Tropicana     | Orange juice                |
| 97  | Tropicana Apple              | Tropicana     | Apple juice                 |
| 98  | Tropicana Mixed Fruit        | Tropicana     | Mixed fruit juice           |
| 99  | Tropicana Mango              | Tropicana     | Mango juice                 |
| 100 | Tropicana Pomegranate        | Tropicana     | Pomegranate juice           |
| 101 | Tropicana Guava              | Tropicana     | Guava juice                 |
| 102 | Tropicana Pineapple          | Tropicana     | Pineapple juice             |
| 103 | Tropicana Litchi             | Tropicana     | Litchi juice                |
| 104 | Paper Boat Aamras            | Paper Boat    | Mango drink                 |
| 105 | Paper Boat Swing             | Paper Boat    | Mixed fruit drink           |
| 106 | Paper Boat Chilli Guava      | Paper Boat    | Spiced guava drink          |
| 107 | Paper Boat Coconut Water     | Paper Boat    | Coconut water               |
| 108 | Paper Boat Anar              | Paper Boat    | Pomegranate drink           |
| 109 | Paper Boat Lychee            | Paper Boat    | Litchi drink                |
| 110 | Paper Boat Jamun Kala Khatta | Paper Boat    | Jamun-based drink           |
| 111 | Paper Boat Aam Panna         | Paper Boat    | Raw mango drink             |
| 112 | Paper Boat Jaljeera          | Paper Boat    | Spiced cumin drink          |
| 113 | Paper Boat Kokum             | Paper Boat    | Kokum drink                 |
| 114 | Paper Boat Thandai           | Paper Boat    | Traditional milk drink      |
| 115 | Paper Boat Rose Tamarind     | Paper Boat    | Rose and tamarind drink     |
| 116 | Minute Maid Pulpy Orange     | Minute Maid   | Orange pulp drink           |
| 117 | Minute Maid Nimbu Fresh      | Minute Maid   | Lemon drink                 |
| 118 | Minute Maid Apple            | Minute Maid   | Apple juice                 |
| 119 | Minute Maid Mixed Fruit      | Minute Maid   | Mixed fruit drink           |
| 120 | Minute Maid Guava            | Minute Maid   | Guava drink                 |
| 121 | Minute Maid Mango            | Minute Maid   | Mango drink                 |
| 122 | Minute Maid Mosambi          | Minute Maid   | Sweet lime drink            |
| 123 | Minute Maid Coconut Water    | Minute Maid   | Coconut water               |
| 124 | Dabur Real Activ Pomegranate | Real Activ    | Pomegranate juice           |
| 125 | Dabur Real Activ Orange      | Real Activ    | Orange juice                |
| 126 | Dabur Real Activ Apple       | Real Activ    | Apple juice                 |
| 127 | Dabur Real Activ Beetroot    | Real Activ    | Beetroot beverage           |
| 128 | Patanjali Amla Juice         | Patanjali     | Amla beverage               |
| 129 | Patanjali Aloe Vera Juice    | Patanjali     | Aloe vera beverage          |
| 130 | Patanjali Mango Drink        | Patanjali     | Mango drink                 |
| 131 | Patanjali Orange Drink       | Patanjali     | Orange drink                |
| 132 | Patanjali Mixed Fruit Juice  | Patanjali     | Mixed fruit juice           |
| 133 | Rasna Orange                 | Rasna         | Orange concentrate drink    |
| 134 | Rasna Mango                  | Rasna         | Mango concentrate drink     |
| 135 | Rasna Pineapple              | Rasna         | Pineapple concentrate drink |
| 136 | Rasna Nimbu Pani             | Rasna         | Lemon drink concentrate     |
| 137 | Rasna Fruit Punch            | Rasna         | Mixed fruit concentrate     |
| 138 | Lahori Zeera                 | Lahori        | Cumin-flavoured soda        |
| 139 | Lahori Nimboo                | Lahori        | Lemon soda                  |
| 140 | Lahori Shikanji              | Lahori        | Indian lemonade             |
| 141 | Lahori Kacha Aam             | Lahori        | Raw mango drink             |
| 142 | Goli Soda                    | Goli Soda     | Traditional fizzy drink     |
| 143 | Bovonto                      | Kali Mark     | Grape-flavoured soda        |
| 144 | Bovonto Strong               | Kali Mark     | Strong grape soda           |
| 145 | Bovonto Blueberry            | Kali Mark     | Blueberry soda              |
| 146 | Sosyo                        | Hajoori       | Fruit-flavoured soda        |
| 147 | Kashmira Jeera Masala        | Kashmira      | Cumin soda                  |
| 148 | Xalta                        | Xalta         | Fruit-flavoured beverage    |
| 149 | Storia Coconut Water         | Storia        | Coconut water               |
| 150 | Storia Mango Juice           | Storia        | Mango beverage              |

## 3. Energy Drinks (151–210)

| No. | Product name                                | Brand          | Details                      |
| --- | ------------------------------------------- | -------------- | ---------------------------- |
| 151 | Red Bull Original                           | Red Bull       | Classic energy drink         |
| 152 | Red Bull Sugarfree                          | Red Bull       | Sugar-free energy drink      |
| 153 | Red Bull Zero                               | Red Bull       | Zero-sugar energy drink      |
| 154 | Red Bull Blue Edition                       | Red Bull       | Blueberry flavour            |
| 155 | Red Bull Red Edition                        | Red Bull       | Watermelon flavour           |
| 156 | Red Bull Yellow Edition                     | Red Bull       | Tropical flavour             |
| 157 | Red Bull Green Edition                      | Red Bull       | Curuba elderflower flavour   |
| 158 | Red Bull Apricot Edition                    | Red Bull       | Apricot and strawberry       |
| 159 | Red Bull Coconut Edition                    | Red Bull       | Coconut and berry            |
| 160 | Red Bull Peach Edition                      | Red Bull       | Peach flavour                |
| 161 | Monster Original                            | Monster Energy | Classic energy drink         |
| 162 | Monster Ultra White                         | Monster Energy | Zero-sugar citrus            |
| 163 | Monster Ultra Paradise                      | Monster Energy | Kiwi and lime                |
| 164 | Monster Ultra Violet                        | Monster Energy | Grape and citrus             |
| 165 | Monster Ultra Rosa                          | Monster Energy | Pink fruit flavour           |
| 166 | Monster Ultra Blue                          | Monster Energy | Blue citrus flavour          |
| 167 | Monster Mango Loco                          | Monster Energy | Mango and tropical fruit     |
| 168 | Monster Pipeline Punch                      | Monster Energy | Passion fruit and orange     |
| 169 | Monster Pacific Punch                       | Monster Energy | Fruit punch                  |
| 170 | Monster Ultra Sunrise                       | Monster Energy | Orange citrus                |
| 171 | Monster Ultra Fiesta Mango                  | Monster Energy | Mango flavour                |
| 172 | Monster Ultra Gold                          | Monster Energy | Pineapple flavour            |
| 173 | Monster Ultra Peachy Keen                   | Monster Energy | Peach flavour                |
| 174 | Monster Ultra Strawberry Dreams             | Monster Energy | Strawberry flavour           |
| 175 | Monster Nitro Super Dry                     | Monster Energy | Citrus energy drink          |
| 176 | Monster Assault                             | Monster Energy | Citrus and cola              |
| 177 | Monster Lewis Hamilton                      | Monster Energy | Special edition energy drink |
| 178 | Monster Java Mean Bean                      | Monster Energy | Coffee energy drink          |
| 179 | Monster Java Loca Moca                      | Monster Energy | Mocha coffee drink           |
| 180 | Monster Rehab Tea + Lemonade                | Monster Energy | Tea-based energy drink       |
| 181 | Rockstar Original                           | Rockstar       | Original energy drink        |
| 182 | Rockstar Sugar Free                         | Rockstar       | Sugar-free energy drink      |
| 183 | Rockstar Punched Fruit Punch                | Rockstar       | Fruit punch                  |
| 184 | Rockstar Recovery Orange                    | Rockstar       | Orange energy drink          |
| 185 | Rockstar Pure Zero Silver Ice               | Rockstar       | Zero-sugar citrus            |
| 186 | Rockstar XDurance Blueberry                 | Rockstar       | Blueberry energy drink       |
| 187 | Rockstar Punched Mango Orange Passion Fruit | Rockstar       | Tropical fruit               |
| 188 | Rockstar Boom Whipped Strawberry            | Rockstar       | Strawberry cream flavour     |
| 189 | NOS Original                                | NOS            | Citrus energy drink          |
| 190 | NOS Zero Sugar                              | NOS            | Sugar-free energy drink      |
| 191 | Bang Rainbow Unicorn                        | Bang Energy    | Candy fruit flavour          |
| 192 | Bang Blue Razz                              | Bang Energy    | Blue raspberry               |
| 193 | Bang Peach Mango                            | Bang Energy    | Peach and mango              |
| 194 | Bang Black Cherry Vanilla                   | Bang Energy    | Cherry vanilla               |
| 195 | Bang Sour Heads                             | Bang Energy    | Sour apple                   |
| 196 | Bang Cotton Candy                           | Bang Energy    | Cotton candy                 |
| 197 | Reign White Gummy Bear                      | Reign          | Gummy bear flavour           |
| 198 | Reign Melon Mania                           | Reign          | Watermelon flavour           |
| 199 | Reign Razzle Berry                          | Reign          | Raspberry berry              |
| 200 | Reign Orange Dreamsicle                     | Reign          | Orange cream                 |
| 201 | Hell Classic                                | Hell Energy    | Classic energy drink         |
| 202 | Hell Strong                                 | Hell Energy    | Strong energy drink          |
| 203 | Hell Zero                                   | Hell Energy    | Sugar-free energy drink      |
| 204 | Hell Apple                                  | Hell Energy    | Apple flavour                |
| 205 | Hell Focus                                  | Hell Energy    | Focus energy drink           |
| 206 | Prime Energy Blue Raspberry                 | Prime          | Blue raspberry energy drink  |
| 207 | Prime Energy Tropical Punch                 | Prime          | Tropical punch               |
| 208 | Celsius Sparkling Orange                    | Celsius        | Orange energy drink          |
| 209 | Celsius Peach Vibe                          | Celsius        | Peach energy drink           |
| 210 | Celsius Tropical Vibe                       | Celsius        | Tropical energy drink        |

## 4. Iced Tea and Tea-Based Cold Drinks (211–260)

| No. | Product name                         | Brand      | Details               |
| --- | ------------------------------------ | ---------- | --------------------- |
| 211 | Lipton Ice Tea Lemon                 | Lipton     | Lemon iced tea        |
| 212 | Lipton Ice Tea Peach                 | Lipton     | Peach iced tea        |
| 213 | Lipton Ice Tea Green                 | Lipton     | Green tea drink       |
| 214 | Lipton Ice Tea Mango                 | Lipton     | Mango iced tea        |
| 215 | Lipton Ice Tea Raspberry             | Lipton     | Raspberry iced tea    |
| 216 | Nestea Lemon                         | Nestea     | Lemon iced tea        |
| 217 | Nestea Peach                         | Nestea     | Peach iced tea        |
| 218 | Nestea Green Tea                     | Nestea     | Green iced tea        |
| 219 | Nestea Mango Pineapple               | Nestea     | Tropical iced tea     |
| 220 | Fuze Tea Lemon                       | Fuze Tea   | Lemon tea beverage    |
| 221 | Fuze Tea Peach                       | Fuze Tea   | Peach tea beverage    |
| 222 | Fuze Tea Mango Chamomile             | Fuze Tea   | Mango herbal tea      |
| 223 | Fuze Tea Black Tea Lemon             | Fuze Tea   | Lemon black tea       |
| 224 | Arizona Green Tea                    | Arizona    | Honey green tea       |
| 225 | Arizona Lemon Tea                    | Arizona    | Lemon iced tea        |
| 226 | Arizona Peach Tea                    | Arizona    | Peach iced tea        |
| 227 | Arizona Mucho Mango                  | Arizona    | Mango fruit tea       |
| 228 | Arizona Watermelon                   | Arizona    | Watermelon tea        |
| 229 | Arizona Pomegranate Green Tea        | Arizona    | Pomegranate green tea |
| 230 | Arizona Raspberry Tea                | Arizona    | Raspberry iced tea    |
| 231 | Pure Leaf Sweet Tea                  | Pure Leaf  | Sweet black tea       |
| 232 | Pure Leaf Unsweetened Tea            | Pure Leaf  | Unsweetened black tea |
| 233 | Pure Leaf Lemon Tea                  | Pure Leaf  | Lemon iced tea        |
| 234 | Pure Leaf Peach Tea                  | Pure Leaf  | Peach iced tea        |
| 235 | Gold Peak Sweet Tea                  | Gold Peak  | Sweet tea             |
| 236 | Gold Peak Unsweetened Tea            | Gold Peak  | Unsweetened tea       |
| 237 | Gold Peak Green Tea                  | Gold Peak  | Green tea             |
| 238 | Gold Peak Lemon Tea                  | Gold Peak  | Lemon tea             |
| 239 | Honest Tea Peach                     | Honest Tea | Peach tea             |
| 240 | Honest Tea Half Tea Half Lemonade    | Honest Tea | Tea and lemonade      |
| 241 | Teavana Shaken Iced Green Tea        | Teavana    | Green iced tea        |
| 242 | Teavana Shaken Iced Black Tea        | Teavana    | Black iced tea        |
| 243 | Starbucks Iced Matcha Latte          | Starbucks  | Matcha milk tea       |
| 244 | Starbucks Iced Green Tea             | Starbucks  | Green tea             |
| 245 | Starbucks Iced Black Tea             | Starbucks  | Black tea             |
| 246 | Starbucks Iced Passion Tango Tea     | Starbucks  | Hibiscus herbal tea   |
| 247 | Starbucks Iced Peach Green Tea       | Starbucks  | Peach green tea       |
| 248 | Starbucks Iced Chai Latte            | Starbucks  | Spiced milk tea       |
| 249 | Starbucks Bottled Frappuccino Coffee | Starbucks  | Chilled coffee        |
| 250 | Starbucks Bottled Mocha Frappuccino  | Starbucks  | Chocolate coffee      |
| 251 | Ito En Oi Ocha Green Tea             | Ito En     | Unsweetened green tea |
| 252 | Ito En Jasmine Green Tea             | Ito En     | Jasmine tea           |
| 253 | Ito En Matcha Green Tea              | Ito En     | Matcha beverage       |
| 254 | Pokka Lemon Tea                      | Pokka      | Lemon tea             |
| 255 | Pokka Peach Tea                      | Pokka      | Peach tea             |
| 256 | Pokka Green Tea                      | Pokka      | Green tea             |
| 257 | Pokka Jasmine Green Tea              | Pokka      | Jasmine tea           |
| 258 | C2 Green Tea Apple                   | C2         | Apple green tea       |
| 259 | C2 Green Tea Lemon                   | C2         | Lemon green tea       |
| 260 | C2 Green Tea Honey                   | C2         | Honey green tea       |

## 5. Sports and Electrolyte Drinks (261–300)

| No. | Product name                         | Brand      | Details                      |
| --- | ------------------------------------ | ---------- | ---------------------------- |
| 261 | Gatorade Lemon Lime                  | Gatorade   | Electrolyte sports drink     |
| 262 | Gatorade Orange                      | Gatorade   | Orange sports drink          |
| 263 | Gatorade Fruit Punch                 | Gatorade   | Fruit punch                  |
| 264 | Gatorade Cool Blue                   | Gatorade   | Blueberry-flavoured drink    |
| 265 | Gatorade Glacier Freeze              | Gatorade   | Glacier fruit flavour        |
| 266 | Gatorade Fierce Grape                | Gatorade   | Grape sports drink           |
| 267 | Gatorade Zero Lemon Lime             | Gatorade   | Zero-sugar electrolyte drink |
| 268 | Gatorade Zero Orange                 | Gatorade   | Zero-sugar orange drink      |
| 269 | Powerade Mountain Berry Blast        | Powerade   | Berry sports drink           |
| 270 | Powerade Fruit Punch                 | Powerade   | Fruit punch                  |
| 271 | Powerade Orange                      | Powerade   | Orange electrolyte drink     |
| 272 | Powerade Grape                       | Powerade   | Grape sports drink           |
| 273 | Powerade Zero Mixed Berry            | Powerade   | Sugar-free berry drink       |
| 274 | Powerade Lemon Lime                  | Powerade   | Lemon-lime sports drink      |
| 275 | BodyArmor Fruit Punch                | BodyArmor  | Sports hydration drink       |
| 276 | BodyArmor Strawberry Banana          | BodyArmor  | Strawberry banana            |
| 277 | BodyArmor Orange Mango               | BodyArmor  | Orange mango                 |
| 278 | BodyArmor Peach Mango                | BodyArmor  | Peach mango                  |
| 279 | BodyArmor Lyte Peach Mango           | BodyArmor  | Low-calorie hydration        |
| 280 | BodyArmor Lyte Blueberry Pomegranate | BodyArmor  | Berry hydration              |
| 281 | Prime Hydration Blue Raspberry       | Prime      | Electrolyte beverage         |
| 282 | Prime Hydration Tropical Punch       | Prime      | Tropical hydration drink     |
| 283 | Prime Hydration Lemon Lime           | Prime      | Lemon-lime hydration         |
| 284 | Prime Hydration Ice Pop              | Prime      | Mixed fruit hydration        |
| 285 | Prime Hydration Meta Moon            | Prime      | Mixed fruit flavour          |
| 286 | Prime Hydration Glowberry            | Prime      | Berry hydration              |
| 287 | Electrolit Grape                     | Electrolit | Electrolyte beverage         |
| 288 | Electrolit Strawberry Kiwi           | Electrolit | Strawberry kiwi              |
| 289 | Electrolit Orange                    | Electrolit | Orange electrolyte drink     |
| 290 | Electrolit Coconut                   | Electrolit | Coconut electrolyte drink    |
| 291 | Pocari Sweat                         | Otsuka     | Japanese electrolyte drink   |
| 292 | Aquarius Original                    | Coca-Cola  | Electrolyte beverage         |
| 293 | Aquarius Lemon                       | Coca-Cola  | Lemon hydration drink        |
| 294 | 100PLUS Original                     | 100PLUS    | Isotonic drink               |
| 295 | 100PLUS Zero                         | 100PLUS    | Sugar-free isotonic drink    |
| 296 | Lucozade Sport Orange                | Lucozade   | Orange sports drink          |
| 297 | Lucozade Sport Raspberry             | Lucozade   | Raspberry sports drink       |
| 298 | Lucozade Sport Caribbean Burst       | Lucozade   | Tropical sports drink        |
| 299 | ORS-L                                | ORS-L      | Oral rehydration beverage    |
| 300 | Fast&Up Reload                       | Fast&Up    | Electrolyte hydration drink  |

## 6. Coconut Water and Functional Hydration Drinks (301–340)

| No. | Product name                                   | Brand            | Details                   |
| --- | ---------------------------------------------- | ---------------- | ------------------------- |
| 301 | Vita Coco Original                             | Vita Coco        | Natural coconut water     |
| 302 | Vita Coco Pressed                              | Vita Coco        | Pressed coconut water     |
| 303 | Vita Coco Pineapple                            | Vita Coco        | Pineapple coconut water   |
| 304 | Vita Coco Peach Mango                          | Vita Coco        | Flavoured coconut water   |
| 305 | ZICO Original Coconut Water                    | ZICO             | Coconut water             |
| 306 | Harmless Harvest Organic Coconut Water         | Harmless Harvest | Organic coconut water     |
| 307 | C2O Pure Coconut Water                         | C2O              | Coconut water             |
| 308 | Taste Nirvana Coconut Water                    | Taste Nirvana    | Thai coconut water        |
| 309 | FOCO Coconut Water                             | FOCO             | Coconut water             |
| 310 | Real Activ Coconut Water                       | Real Activ       | Packaged coconut water    |
| 311 | Storia Coconut Water                           | Storia           | Coconut water             |
| 312 | Paper Boat Coconut Water                       | Paper Boat       | Coconut water             |
| 313 | Dabur Hommade Coconut Milk Drink               | Dabur            | Coconut-based beverage    |
| 314 | UFC Refresh Coconut Water                      | UFC              | Coconut water             |
| 315 | Chaokoh Coconut Water                          | Chaokoh          | Thai coconut water        |
| 316 | Cocomax Coconut Water                          | Cocomax          | Coconut water             |
| 317 | King Island Coconut Water                      | King Island      | Coconut water             |
| 318 | Cocobella Coconut Water                        | Cocobella        | Coconut water             |
| 319 | Naked Coconut Water                            | Naked            | Coconut water             |
| 320 | Innocent Coconut Water                         | Innocent         | Coconut water             |
| 321 | Liquid I.V. Hydration Multiplier Lemon Lime    | Liquid I.V.      | Electrolyte drink mix     |
| 322 | Liquid I.V. Hydration Multiplier Passion Fruit | Liquid I.V.      | Passion fruit hydration   |
| 323 | Liquid I.V. Hydration Multiplier Strawberry    | Liquid I.V.      | Strawberry hydration      |
| 324 | Hydralyte Orange                               | Hydralyte        | Electrolyte drink         |
| 325 | Hydralyte Lemonade                             | Hydralyte        | Electrolyte drink         |
| 326 | Pedialyte Strawberry                           | Pedialyte        | Oral electrolyte solution |
| 327 | Pedialyte Apple                                | Pedialyte        | Oral electrolyte solution |
| 328 | Pedialyte Grape                                | Pedialyte        | Oral electrolyte solution |
| 329 | DripDrop ORS Berry                             | DripDrop         | Electrolyte hydration     |
| 330 | DripDrop ORS Lemon                             | DripDrop         | Electrolyte hydration     |
| 331 | Cure Hydration Watermelon                      | Cure             | Electrolyte drink mix     |
| 332 | Cure Hydration Berry Pomegranate               | Cure             | Electrolyte drink mix     |
| 333 | Nuun Sport Lemon Lime                          | Nuun             | Electrolyte tablet drink  |
| 334 | Nuun Sport Tri-Berry                           | Nuun             | Berry hydration           |
| 335 | Nuun Immunity Orange Citrus                    | Nuun             | Functional hydration      |
| 336 | ORS Orange                                     | Electral         | Oral rehydration drink    |
| 337 | Electral Ready-to-Drink                        | Electral         | Electrolyte solution      |
| 338 | Enerzal Orange                                 | Enerzal          | Glucose electrolyte drink |
| 339 | Enerzal Lemon                                  | Enerzal          | Lemon electrolyte drink   |
| 340 | Glucon-D Nimbu Pani                            | Glucon-D         | Glucose-based lemon drink |

## 7. Packaged Water and Flavoured Water (341–380)

| No. | Product name                    | Brand                  | Details                     |
| --- | ------------------------------- | ---------------------- | --------------------------- |
| 341 | Kinley Water                    | Kinley                 | Packaged drinking water     |
| 342 | Aquafina                        | PepsiCo                | Purified drinking water     |
| 343 | Bisleri                         | Bisleri                | Packaged drinking water     |
| 344 | Vedica Himalayan Spring Water   | Bisleri                | Natural spring water        |
| 345 | Bailey                          | Parle Agro             | Packaged drinking water     |
| 346 | Himalayan Natural Mineral Water | Tata Consumer Products | Natural mineral water       |
| 347 | Tata Copper+                    | Tata Consumer Products | Copper-infused water        |
| 348 | Tata Gluco+                     | Tata Consumer Products | Glucose-based beverage      |
| 349 | Evian Natural Mineral Water     | Evian                  | French mineral water        |
| 350 | Fiji Natural Artesian Water     | Fiji Water             | Artesian water              |
| 351 | VOSS Still Water                | VOSS                   | Premium still water         |
| 352 | VOSS Sparkling Water            | VOSS                   | Sparkling mineral water     |
| 353 | Perrier Original                | Perrier                | Sparkling mineral water     |
| 354 | Perrier Lime                    | Perrier                | Lime sparkling water        |
| 355 | San Pellegrino Sparkling Water  | San Pellegrino         | Sparkling mineral water     |
| 356 | Gerolsteiner Sparkling          | Gerolsteiner           | Mineral sparkling water     |
| 357 | Topo Chico Mineral Water        | Topo Chico             | Sparkling mineral water     |
| 358 | LaCroix Pure                    | LaCroix                | Unflavoured sparkling water |
| 359 | LaCroix Lime                    | LaCroix                | Lime sparkling water        |
| 360 | LaCroix Grapefruit              | LaCroix                | Grapefruit sparkling water  |
| 361 | LaCroix Pamplemousse            | LaCroix                | Pink grapefruit water       |
| 362 | Bubly Lime                      | Bubly                  | Flavoured sparkling water   |
| 363 | Bubly Cherry                    | Bubly                  | Cherry sparkling water      |
| 364 | Bubly Blackberry                | Bubly                  | Blackberry sparkling water  |
| 365 | Bubly Mango                     | Bubly                  | Mango sparkling water       |
| 366 | AHA Blueberry + Pomegranate     | AHA                    | Flavoured sparkling water   |
| 367 | AHA Peach + Honey               | AHA                    | Peach sparkling water       |
| 368 | AHA Lime + Watermelon           | AHA                    | Lime watermelon water       |
| 369 | Spindrift Lemon                 | Spindrift              | Real-fruit sparkling water  |
| 370 | Spindrift Raspberry Lime        | Spindrift              | Raspberry lime water        |
| 371 | Spindrift Mango Orange          | Spindrift              | Mango orange water          |
| 372 | Waterloo Black Cherry           | Waterloo               | Sparkling water             |
| 373 | Waterloo Peach                  | Waterloo               | Peach sparkling water       |
| 374 | Waterloo Tropical Fruit         | Waterloo               | Tropical sparkling water    |
| 375 | Hint Water Blackberry           | Hint                   | Still flavoured water       |
| 376 | Hint Water Watermelon           | Hint                   | Watermelon flavoured water  |
| 377 | Hint Water Pineapple            | Hint                   | Pineapple flavoured water   |
| 378 | Glacéau Smartwater              | Smartwater             | Vapour-distilled water      |
| 379 | Glacéau Vitaminwater XXX        | Vitaminwater           | Acai blueberry pomegranate  |
| 380 | Glacéau Vitaminwater Power-C    | Vitaminwater           | Dragonfruit beverage        |

## 8. Packaged Milkshakes and Dairy-Based Cold Drinks (381–425)

| No. | Product name                      | Brand        | Details                  |
| --- | --------------------------------- | ------------ | ------------------------ |
| 381 | Amul Kool Koko                    | Amul         | Chocolate milk drink     |
| 382 | Amul Kool Café                    | Amul         | Coffee milk drink        |
| 383 | Amul Kool Elaichi                 | Amul         | Cardamom milk drink      |
| 384 | Amul Kool Rose                    | Amul         | Rose-flavoured milk      |
| 385 | Amul Kool Badam                   | Amul         | Almond milk drink        |
| 386 | Amul Kool Pista                   | Amul         | Pistachio milk drink     |
| 387 | Amul Kool Strawberry              | Amul         | Strawberry milk          |
| 388 | Amul Kool Mango                   | Amul         | Mango milk               |
| 389 | Amul Kool Thandai                 | Amul         | Traditional spiced milk  |
| 390 | Amul Kool Lassi                   | Amul         | Chilled yoghurt drink    |
| 391 | Amul Masti Buttermilk             | Amul         | Spiced buttermilk        |
| 392 | Amul Masti Masala Chaas           | Amul         | Masala buttermilk        |
| 393 | Amul Mango Lassi                  | Amul         | Mango yoghurt drink      |
| 394 | Amul Strawberry Lassi             | Amul         | Strawberry yoghurt drink |
| 395 | Mother Dairy Mango Lassi          | Mother Dairy | Mango yoghurt drink      |
| 396 | Mother Dairy Sweet Lassi          | Mother Dairy | Sweet yoghurt drink      |
| 397 | Mother Dairy Plain Chhach         | Mother Dairy | Buttermilk               |
| 398 | Mother Dairy Masala Chhach        | Mother Dairy | Spiced buttermilk        |
| 399 | Mother Dairy Tadka Chhach         | Mother Dairy | Tempered buttermilk      |
| 400 | Mother Dairy Mango Milkshake      | Mother Dairy | Mango milkshake          |
| 401 | Mother Dairy Chocolate Milkshake  | Mother Dairy | Chocolate milkshake      |
| 402 | Mother Dairy Strawberry Milkshake | Mother Dairy | Strawberry milkshake     |
| 403 | Cavin's Chocolate Milkshake       | Cavin's      | Chocolate milkshake      |
| 404 | Cavin's Mango Milkshake           | Cavin's      | Mango milkshake          |
| 405 | Cavin's Strawberry Milkshake      | Cavin's      | Strawberry milkshake     |
| 406 | Cavin's Vanilla Milkshake         | Cavin's      | Vanilla milkshake        |
| 407 | Cavin's Butterscotch Milkshake    | Cavin's      | Butterscotch milkshake   |
| 408 | Cavin's Cold Coffee               | Cavin's      | Chilled coffee milk      |
| 409 | Hershey's Chocolate Milk          | Hershey's    | Chocolate milk           |
| 410 | Hershey's Strawberry Milk         | Hershey's    | Strawberry milk          |
| 411 | Hershey's Cookies 'n' Creme Milk  | Hershey's    | Flavoured milk           |
| 412 | Nesquik Chocolate Milk            | Nesquik      | Chocolate milk           |
| 413 | Nesquik Strawberry Milk           | Nesquik      | Strawberry milk          |
| 414 | Nesquik Banana Milk               | Nesquik      | Banana milk              |
| 415 | Yoo-hoo Chocolate Drink           | Yoo-hoo      | Chocolate beverage       |
| 416 | Chocomel Original                 | Chocomel     | Chocolate milk           |
| 417 | Ovaltine Chocolate Malt Drink     | Ovaltine     | Malt chocolate beverage  |
| 418 | Horlicks Chocolate Milk           | Horlicks     | Malt chocolate drink     |
| 419 | Milo Chocolate Malt Drink         | Milo         | Chocolate malt beverage  |
| 420 | Starbucks Chilled Coffee          | Starbucks    | Ready-to-drink coffee    |
| 421 | Starbucks Vanilla Frappuccino     | Starbucks    | Vanilla coffee beverage  |
| 422 | Starbucks Caramel Frappuccino     | Starbucks    | Caramel coffee beverage  |
| 423 | Starbucks Double Shot Espresso    | Starbucks    | Espresso milk drink      |
| 424 | Nescafé Cold Coffee               | Nescafé      | Ready-to-drink coffee    |
| 425 | Nescafé Frappe                    | Nescafé      | Chilled coffee drink     |

## 9. Premium International Fruit and Vegetable Drinks (426–465)

| No. | Product name                        | Brand           | Details                    |
| --- | ----------------------------------- | --------------- | -------------------------- |
| 426 | Naked Green Machine                 | Naked Juice     | Green fruit smoothie       |
| 427 | Naked Blue Machine                  | Naked Juice     | Blueberry smoothie         |
| 428 | Naked Mighty Mango                  | Naked Juice     | Mango smoothie             |
| 429 | Naked Red Machine                   | Naked Juice     | Red fruit smoothie         |
| 430 | Naked Strawberry Banana             | Naked Juice     | Strawberry banana smoothie |
| 431 | Innocent Mango & Passion Fruit      | Innocent        | Tropical smoothie          |
| 432 | Innocent Strawberry & Banana        | Innocent        | Fruit smoothie             |
| 433 | Innocent Blueberry & Raspberry      | Innocent        | Berry smoothie             |
| 434 | Innocent Super Smoothie Antioxidant | Innocent        | Antioxidant fruit smoothie |
| 435 | Odwalla Strawberry Banana           | Odwalla         | Fruit smoothie             |
| 436 | Odwalla Mango Tango                 | Odwalla         | Mango fruit smoothie       |
| 437 | Bolthouse Farms Green Goodness      | Bolthouse Farms | Green vegetable smoothie   |
| 438 | Bolthouse Farms Berry Boost         | Bolthouse Farms | Berry smoothie             |
| 439 | Bolthouse Farms Amazing Mango       | Bolthouse Farms | Mango smoothie             |
| 440 | Bolthouse Farms Strawberry Banana   | Bolthouse Farms | Fruit smoothie             |
| 441 | Suja Uber Greens                    | Suja            | Cold-pressed green juice   |
| 442 | Suja Mighty Dozen                   | Suja            | Vegetable and fruit juice  |
| 443 | Suja Organic Immunity               | Suja            | Functional juice           |
| 444 | Suja Berry Goodness                 | Suja            | Berry juice blend          |
| 445 | Evolution Fresh Essential Greens    | Evolution Fresh | Cold-pressed green juice   |
| 446 | Evolution Fresh Sweet Greens        | Evolution Fresh | Green juice                |
| 447 | Evolution Fresh Organic Defense Up  | Evolution Fresh | Citrus and ginger juice    |
| 448 | Pressed Juicery Greens 3            | Pressed Juicery | Green juice                |
| 449 | Pressed Juicery Roots 3             | Pressed Juicery | Root vegetable juice       |
| 450 | Pressed Juicery Citrus 2            | Pressed Juicery | Citrus juice               |
| 451 | POM Wonderful 100% Pomegranate      | POM Wonderful   | Pomegranate juice          |
| 452 | Ocean Spray Cranberry Classic       | Ocean Spray     | Cranberry juice cocktail   |
| 453 | Ocean Spray Cran-Grape              | Ocean Spray     | Cranberry grape drink      |
| 454 | Ocean Spray Cran-Apple              | Ocean Spray     | Cranberry apple drink      |
| 455 | Ocean Spray Cran-Mango              | Ocean Spray     | Cranberry mango drink      |
| 456 | Welch's 100% Grape Juice            | Welch's         | Grape juice                |
| 457 | Welch's White Grape Juice           | Welch's         | White grape juice          |
| 458 | Welch's Fruit Punch                 | Welch's         | Fruit punch                |
| 459 | Welch's Strawberry Breeze           | Welch's         | Strawberry fruit drink     |
| 460 | Dole Pineapple Juice                | Dole            | Pineapple juice            |
| 461 | Dole Orange Peach Mango             | Dole            | Tropical fruit drink       |
| 462 | Dole Apple Juice                    | Dole            | Apple juice                |
| 463 | Dole Tropical Gold Pineapple        | Dole            | Premium pineapple juice    |
| 464 | KDD Orange Juice                    | KDD             | Orange juice               |
| 465 | KDD Mango Juice                     | KDD             | Mango juice                |

## 10. Lemonades, Mocktails, Mixers and Specialty Cold Drinks (466–500)

| No. | Product name                         | Brand         | Details                      |
| --- | ------------------------------------ | ------------- | ---------------------------- |
| 466 | Simply Lemonade                      | Simply        | Classic lemonade             |
| 467 | Simply Raspberry Lemonade            | Simply        | Raspberry lemonade           |
| 468 | Simply Peach                         | Simply        | Peach lemonade               |
| 469 | Minute Maid Lemonade                 | Minute Maid   | Classic lemonade             |
| 470 | Minute Maid Pink Lemonade            | Minute Maid   | Pink lemonade                |
| 471 | Country Time Lemonade                | Country Time  | Lemonade drink               |
| 472 | Country Time Pink Lemonade           | Country Time  | Pink lemonade                |
| 473 | Newman's Own Lemonade                | Newman's Own  | Classic lemonade             |
| 474 | Newman's Own Pink Lemonade           | Newman's Own  | Pink lemonade                |
| 475 | Sanpellegrino Pompelmo               | Sanpellegrino | Grapefruit sparkling drink   |
| 476 | Sanpellegrino Aranciata Rossa        | Sanpellegrino | Blood orange soda            |
| 477 | Sanpellegrino Clementina             | Sanpellegrino | Clementine soda              |
| 478 | Fever-Tree Indian Tonic Water        | Fever-Tree    | Premium tonic water          |
| 479 | Fever-Tree Mediterranean Tonic Water | Fever-Tree    | Herbal tonic water           |
| 480 | Fever-Tree Ginger Beer               | Fever-Tree    | Ginger mixer                 |
| 481 | Fever-Tree Ginger Ale                | Fever-Tree    | Ginger soda                  |
| 482 | Fever-Tree Elderflower Tonic         | Fever-Tree    | Elderflower tonic            |
| 483 | Fever-Tree Pink Grapefruit Soda      | Fever-Tree    | Grapefruit soda              |
| 484 | Monin Mojito Mint Mixer              | Monin         | Mint mocktail mixer          |
| 485 | Monin Passion Fruit Mixer            | Monin         | Passion fruit mixer          |
| 486 | Monin Blue Curacao Syrup             | Monin         | Orange-flavoured mixer syrup |
| 487 | Monin Strawberry Syrup               | Monin         | Strawberry drink mixer       |
| 488 | Real Mojito Mix                      | Real          | Mint and lime mocktail mix   |
| 489 | Real Virgin Pina Colada Mix          | Real          | Pineapple coconut mocktail   |
| 490 | Real Cranberry Mix                   | Real          | Cranberry-based mixer        |
| 491 | Paper Boat Jaljeera                  | Paper Boat    | Spiced Indian drink          |
| 492 | Paper Boat Aam Panna                 | Paper Boat    | Raw mango cooler             |
| 493 | Paper Boat Kokum                     | Paper Boat    | Kokum cooler                 |
| 494 | Paper Boat Rose Tamarind             | Paper Boat    | Rose and tamarind cooler     |
| 495 | Shikanji Masala Drink                | Lahori        | Indian lemon cooler          |
| 496 | Bindu Jeera Masala                   | Bindu         | Cumin-flavoured soda         |
| 497 | Bindu Fizz Jeera                     | Bindu         | Fizzy cumin drink            |
| 498 | Catch Jeera Masala Soda              | Catch         | Cumin-flavoured soda         |
| 499 | Raw Pressery Orange Juice            | Raw Pressery  | Cold-pressed orange juice    |
| 500 | Raw Pressery Mixed Fruit Juice       | Raw Pressery  | Cold-pressed fruit blend     |
"""

sections = [
    (1, 75, "Carbonated Soft Drinks"),
    (76, 150, "Indian Fruit Drinks and Juices"),
    (151, 210, "Energy Drinks"),
    (211, 260, "Iced Tea"),
    (261, 300, "Sports and Electrolyte Drinks"),
    (301, 340, "Coconut Water and Hydration"),
    (341, 380, "Water and Flavoured Water"),
    (381, 425, "Milkshakes and Dairy Drinks"),
    (426, 465, "Premium Fruit and Vegetable Drinks"),
    (466, 500, "Lemonades and Mocktail Mixers"),
]

def get_section(num):
    for start, end, name in sections:
        if start <= num <= end:
            return name
    return "Other Cold Drinks"

items = []
lines = raw_text.strip().split("\n")
for line in lines:
    line = line.strip()
    if not line.startswith("|"):
        continue
    parts = [p.strip() for p in line.split("|")[1:-1]]
    if len(parts) < 4:
        continue
    num_str, name, brand, details = parts[0], parts[1], parts[2], parts[3]
    if not num_str.isdigit():
        continue
    num = int(num_str)
    items.append({
        "number": num,
        "name": name,
        "brand": brand,
        "details": details,
        "section": get_section(num)
    })

print(f"Parsed {len(items)} items.")
with open("scripts/data/parsed_cold_drinks_500.json", "w") as f:
    json.dump(items, f, indent=2)

