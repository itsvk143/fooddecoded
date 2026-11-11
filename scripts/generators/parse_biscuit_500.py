import re
import json

raw_text = """
## 1. Cream Biscuits (1–50)

| No. | Product name                 | Brand           | Details                                       |
| --- | ---------------------------- | --------------- | --------------------------------------------- |
| 1   | Oreo Original                | Oreo            | Chocolate sandwich biscuit with vanilla cream |
| 2   | Oreo Double Stuf             | Oreo            | Extra vanilla cream filling                   |
| 3   | Oreo Golden                  | Oreo            | Golden vanilla-flavoured sandwich biscuit     |
| 4   | Oreo Chocolate Creme         | Oreo            | Chocolate cream sandwich biscuit              |
| 5   | Oreo Strawberry Creme        | Oreo            | Strawberry cream-filled biscuit               |
| 6   | Oreo Birthday Cake           | Oreo            | Birthday cake-flavoured cream biscuit         |
| 7   | Oreo Mint Creme              | Oreo            | Mint-flavoured cream biscuit                  |
| 8   | Oreo Peanut Butter           | Oreo            | Peanut butter cream sandwich biscuit          |
| 9   | Bourbon Original             | Britannia       | Chocolate cream sandwich biscuit              |
| 10  | Bourbon                      | Parle           | Chocolate cream-filled biscuit                |
| 11  | Hide & Seek Black Bourbon    | Parle           | Dark chocolate cream biscuit                  |
| 12  | Treat Original               | Britannia       | Chocolate cream sandwich biscuit              |
| 13  | Treat Orange                 | Britannia       | Orange cream biscuit                          |
| 14  | Treat Strawberry             | Britannia       | Strawberry cream biscuit                      |
| 15  | Jim Jam                      | Britannia       | Jam and cream-topped biscuit                  |
| 16  | Milano                       | Pepperidge Farm | Premium chocolate-filled biscuit              |
| 17  | Viennese Whirls              | Mr Kipling      | Butter biscuit with jam and cream             |
| 18  | Custard Creams               | Crawford's      | Custard cream sandwich biscuit                |
| 19  | Custard Creams               | Fox's           | Vanilla custard-filled biscuit                |
| 20  | Party Rings                  | Fox's           | Iced ring-shaped sweet biscuit                |
| 21  | Jammy Dodgers                | Burton's        | Shortcake biscuit with jam                    |
| 22  | Wagon Wheels                 | Burton's        | Marshmallow and chocolate-coated biscuit      |
| 23  | Happy Hippo                  | Kinder          | Wafer biscuit with milk and hazelnut cream    |
| 24  | Kinder Cards                 | Kinder          | Thin wafer biscuit with milk and cocoa cream  |
| 25  | Nutella Biscuits             | Nutella         | Hazelnut cocoa-filled crunchy biscuit         |
| 26  | Bahlsen Choco Leibniz        | Bahlsen         | Butter biscuit covered in chocolate           |
| 27  | Pick Up! Choco               | Bahlsen         | Chocolate slab between biscuits               |
| 28  | Hit Chocolate                | Sunfeast        | Chocolate cream sandwich biscuit              |
| 29  | Hit Vanilla                  | Sunfeast        | Vanilla cream sandwich biscuit                |
| 30  | Hit Strawberry               | Sunfeast        | Strawberry cream biscuit                      |
| 31  | Cream 4 Fun                  | Priyagold       | Cream-filled sweet biscuit                    |
| 32  | Nice Cream                   | Anmol           | Cream sandwich biscuit                        |
| 33  | Dream Cream                  | Unibic          | Cream-filled biscuit                          |
| 34  | Cream Cracker Sandwich       | Jacob's         | Cream-filled cracker sandwich                 |
| 35  | Prince Chocolate             | LU              | Chocolate cream sandwich biscuit              |
| 36  | Prince Vanilla               | LU              | Vanilla cream biscuit                         |
| 37  | Petit Écolier                | LU              | Butter biscuit with chocolate topping         |
| 38  | Choco Leibniz Milk           | Bahlsen         | Milk chocolate-coated butter biscuit          |
| 39  | Choco Leibniz Dark           | Bahlsen         | Dark chocolate-coated butter biscuit          |
| 40  | Loacker Quadratini Vanilla   | Loacker         | Vanilla cream wafer cubes                     |
| 41  | Loacker Quadratini Chocolate | Loacker         | Chocolate cream wafer cubes                   |
| 42  | Loacker Quadratini Hazelnut  | Loacker         | Hazelnut cream wafer cubes                    |
| 43  | Loacker Classic Vanilla      | Loacker         | Vanilla cream wafer biscuit                   |
| 44  | Loacker Classic Napolitaner  | Loacker         | Hazelnut cream wafer biscuit                  |
| 45  | Loacker Classic Chocolate    | Loacker         | Chocolate cream wafer biscuit                 |
| 46  | Manner Original Neapolitaner | Manner          | Hazelnut cream wafer                          |
| 47  | Manner Lemon                 | Manner          | Lemon cream wafer                             |
| 48  | Manner Chocolate             | Manner          | Chocolate cream wafer                         |
| 49  | Knoppers                     | Storck          | Milk and hazelnut wafer sandwich              |
| 50  | Hanuta                       | Ferrero         | Hazelnut cream wafer sandwich                 |

## 2. Glucose, Milk & Energy Biscuits (51–100)

| No. | Product name            | Brand     | Details                            |
| --- | ----------------------- | --------- | ---------------------------------- |
| 51  | Parle-G Original        | Parle     | Glucose biscuit                    |
| 52  | Parle-G Gold            | Parle     | Premium glucose biscuit            |
| 53  | Parle-G Royale          | Parle     | Rich glucose biscuit               |
| 54  | Tiger Original          | Britannia | Glucose biscuit                    |
| 55  | Tiger Krunch            | Britannia | Crunchy glucose biscuit            |
| 56  | Tiger Orange            | Britannia | Orange-flavoured glucose biscuit   |
| 57  | Marie Gold              | Britannia | Light tea-time biscuit             |
| 58  | Marie Light             | Britannia | Light crispy Marie biscuit         |
| 59  | Marie                   | Parle     | Classic tea biscuit                |
| 60  | 50-50 Maska Chaska      | Britannia | Sweet and salty biscuit            |
| 61  | Milk Bikis              | Britannia | Milk-flavoured biscuit             |
| 62  | Milk Bikis Cream        | Britannia | Milk cream biscuit                 |
| 63  | Milk Shakti             | Anmol     | Milk-flavoured biscuit             |
| 64  | Milk Magic              | Sunfeast  | Milk biscuit                       |
| 65  | Milk Cookies            | Priyagold | Milk-based sweet biscuit           |
| 66  | Googly                  | Parle     | Sweet crunchy biscuit              |
| 67  | KrackJack               | Parle     | Sweet and salty cracker biscuit    |
| 68  | Nice Time               | Britannia | Coconut-sugar-coated biscuit       |
| 69  | Nice                    | Parle     | Sugar-coated coconut biscuit       |
| 70  | Gluco Plus              | Anmol     | Glucose biscuit                    |
| 71  | Glucose Biscuit         | Sunfeast  | Classic glucose biscuit            |
| 72  | Glucose Biscuit         | Priyagold | Glucose biscuit                    |
| 73  | Glucose Biscuit         | Cremica   | Glucose biscuit                    |
| 74  | Glucose Biscuit         | Dukes     | Glucose biscuit                    |
| 75  | Glucose Biscuit         | Bisk Farm | Glucose biscuit                    |
| 76  | Good Day Butter         | Britannia | Butter-rich sweet biscuit          |
| 77  | Good Day Cashew         | Britannia | Cashew biscuit                     |
| 78  | Good Day Pista Badam    | Britannia | Pistachio and almond biscuit       |
| 79  | Good Day Chocochip      | Britannia | Chocolate-chip biscuit             |
| 80  | Good Day Chunkies       | Britannia | Chunky chocolate biscuit           |
| 81  | Good Day Butter Cookies | Britannia | Butter cookies                     |
| 82  | Good Day Rich Butter    | Britannia | Rich butter biscuit                |
| 83  | Good Day Fruit & Nut    | Britannia | Fruit and nut biscuit              |
| 84  | Good Day Almond         | Britannia | Almond biscuit                     |
| 85  | Good Day Cashew Almond  | Britannia | Cashew and almond biscuit          |
| 86  | Good Time Butter        | Parle     | Butter-flavoured biscuit           |
| 87  | Good Time Cashew        | Parle     | Cashew biscuit                     |
| 88  | Top                     | Parle     | Sweet tea-time biscuit             |
| 89  | Monaco                  | Parle     | Light salted cracker               |
| 90  | Salted Crackers         | Jacob's   | Traditional salted cracker         |
| 91  | Ritz Original           | Ritz      | Round buttery salted cracker       |
| 92  | Ritz Whole Wheat        | Ritz      | Whole-wheat cracker                |
| 93  | Ritz Cheese             | Ritz      | Cheese-flavoured cracker           |
| 94  | TUC Original            | LU        | Salted savoury cracker             |
| 95  | TUC Cheese              | LU        | Cheese-flavoured cracker           |
| 96  | TUC Sour Cream & Onion  | LU        | Flavoured savoury cracker          |
| 97  | Tuc Bacon               | LU        | Bacon-flavoured cracker            |
| 98  | Tuc Paprika             | LU        | Paprika-flavoured cracker          |
| 99  | Tuc Herbs               | LU        | Herb-flavoured cracker             |
| 100 | Cream Crackers          | Jacob's   | Traditional plain savoury crackers |

## 3. Digestive & Whole-Wheat Biscuits (101–150)

| No. | Product name                   | Brand           | Details                            |
| --- | ------------------------------ | --------------- | ---------------------------------- |
| 101 | Digestive Original             | McVitie's       | Classic wheat digestive            |
| 102 | Digestive Milk Chocolate       | McVitie's       | Chocolate-coated digestive         |
| 103 | Digestive Dark Chocolate       | McVitie's       | Dark chocolate digestive           |
| 104 | Digestive Caramel              | McVitie's       | Caramel chocolate digestive        |
| 105 | Digestive Thins Milk Chocolate | McVitie's       | Thin chocolate digestive           |
| 106 | Digestive Thins Dark Chocolate | McVitie's       | Thin dark chocolate digestive      |
| 107 | Hobnobs Original               | McVitie's       | Oat-based biscuit                  |
| 108 | Hobnobs Milk Chocolate         | McVitie's       | Milk chocolate oat biscuit         |
| 109 | Hobnobs Dark Chocolate         | McVitie's       | Dark chocolate oat biscuit         |
| 110 | Hobnobs Golden                 | McVitie's       | Golden oat biscuit                 |
| 111 | Rich Tea                       | McVitie's       | Light tea biscuit                  |
| 112 | Wheat Biscuits                 | Weetabix        | Wholegrain wheat biscuit           |
| 113 | Digestive Original             | Britannia       | Whole-wheat digestive              |
| 114 | NutriChoice Digestive          | Britannia       | Fibre-oriented digestive biscuit   |
| 115 | NutriChoice 5 Grain            | Britannia       | Multigrain biscuit                 |
| 116 | NutriChoice Oats               | Britannia       | Oat-based biscuit                  |
| 117 | NutriChoice Hi-Fibre           | Britannia       | High-fibre biscuit                 |
| 118 | NutriChoice Ragi               | Britannia       | Finger millet biscuit              |
| 119 | NutriChoice Sugar Free         | Britannia       | Sugar-free digestive-style biscuit |
| 120 | NutriChoice Essentials         | Britannia       | Grain-based biscuit                |
| 121 | Active Oats                    | Sunfeast        | Oat-based biscuit                  |
| 122 | Farmlite Digestive             | Sunfeast        | Whole-wheat digestive              |
| 123 | Farmlite 5 Seed Digestive      | Sunfeast        | Seed-enriched digestive            |
| 124 | Farmlite Superfood             | Sunfeast        | Grain and seed biscuit             |
| 125 | Farmlite Oats & Almond         | Sunfeast        | Oat and almond biscuit             |
| 126 | Marie Light Active             | Britannia       | Light tea biscuit                  |
| 127 | Digestive                      | Parle           | Whole-wheat digestive              |
| 128 | Active Digestive               | Anmol           | Digestive biscuit                  |
| 129 | Digestive                      | Priyagold       | Whole-wheat biscuit                |
| 130 | Digestive                      | Bisk Farm       | Digestive biscuit                  |
| 131 | Digestive                      | Unibic          | Whole-wheat digestive              |
| 132 | Digestive                      | Gullón          | Spanish digestive biscuit          |
| 133 | Digestive Sugar Free           | Gullón          | Sugar-free digestive               |
| 134 | Digestive Chocolate            | Gullón          | Chocolate digestive                |
| 135 | Digestive Oat                  | Gullón          | Oat digestive                      |
| 136 | Digestive                      | Sainsbury's     | Wheat digestive                    |
| 137 | Digestive                      | Tesco           | Wheat digestive                    |
| 138 | Digestive                      | ASDA            | Wheat digestive                    |
| 139 | Digestive                      | Waitrose        | Wheat digestive                    |
| 140 | Digestive                      | Marks & Spencer | Premium wheat digestive            |
| 141 | Digestive                      | Island Bakery   | Organic-style digestive biscuit    |
| 142 | Hobnobs                        | Fox's           | Oat biscuit                        |
| 143 | Oat Digestives                 | Nairn's         | Oat-based digestive                |
| 144 | Oatcakes                       | Nairn's         | Traditional oat biscuit            |
| 145 | Stem Ginger Oat Biscuits       | Nairn's         | Ginger-flavoured oat biscuit       |
| 146 | Rough Oatcakes                 | Nairn's         | Coarse-textured oat biscuit        |
| 147 | Oat Biscuits                   | Walkers         | Scottish oat biscuit               |
| 148 | Oatmeal Biscuits               | Paterson's      | Oatmeal biscuit                    |
| 149 | Whole Wheat Digestive          | Britannia       | Whole-wheat biscuit                |
| 150 | Multigrain Digestive           | Parle           | Multigrain digestive biscuit       |

## 4. Chocolate & Cocoa Biscuits (151–200)

| No. | Product name                               | Brand           | Details                                |
| --- | ------------------------------------------ | --------------- | -------------------------------------- |
| 151 | Hide & Seek Classic                        | Parle           | Chocolate-chip biscuit                 |
| 152 | Hide & Seek Fab                            | Parle           | Chocolate-filled biscuit               |
| 153 | Hide & Seek Milano                         | Parle           | Premium chocolate biscuit              |
| 154 | Hide & Seek Bourbon                        | Parle           | Chocolate cream biscuit                |
| 155 | Dark Fantasy Choco Fills                   | Sunfeast        | Chocolate-filled biscuit               |
| 156 | Dark Fantasy Choco Meltz                   | Sunfeast        | Melt-in-mouth chocolate biscuit        |
| 157 | Dark Fantasy Bourbon                       | Sunfeast        | Chocolate cream biscuit                |
| 158 | Dark Fantasy Vanilla Creme                 | Sunfeast        | Vanilla cream biscuit                  |
| 159 | Dark Fantasy Choco Nut                     | Sunfeast        | Chocolate and nut biscuit              |
| 160 | Dark Fantasy Coffee Fills                  | Sunfeast        | Coffee-filled biscuit                  |
| 161 | Choco Chip Cookies                         | Unibic          | Chocolate-chip cookie                  |
| 162 | Choco Kiss                                 | Unibic          | Chocolate biscuit                      |
| 163 | Choco Ripple                               | Unibic          | Chocolate biscuit                      |
| 164 | Choco Chip                                 | Britannia       | Chocolate-chip biscuit                 |
| 165 | Choco Delight                              | Britannia       | Chocolate biscuit                      |
| 166 | Choco Creme                                | Britannia       | Chocolate cream biscuit                |
| 167 | Choco Chip Cookies                         | McVitie's       | Chocolate-chip cookie                  |
| 168 | Maryland Chocolate Chip                    | Fox's           | Chocolate-chip cookie                  |
| 169 | Maryland Double Chocolate                  | Fox's           | Double chocolate cookie                |
| 170 | Maryland Chunky Chocolate                  | Fox's           | Chunky chocolate cookie                |
| 171 | Chips Ahoy! Original                       | Nabisco         | Chocolate-chip cookie                  |
| 172 | Chips Ahoy! Chewy                          | Nabisco         | Soft chocolate-chip cookie             |
| 173 | Chips Ahoy! Chunky                         | Nabisco         | Chunky chocolate cookie                |
| 174 | Chips Ahoy! Hershey's                      | Nabisco         | Chocolate cookie                       |
| 175 | Famous Amos Chocolate Chip                 | Famous Amos     | Crunchy chocolate-chip cookie          |
| 176 | Pepperidge Farm Chocolate Chunk            | Pepperidge Farm | Premium chocolate cookie               |
| 177 | Pepperidge Farm Double Chocolate Nantucket | Pepperidge Farm | Double chocolate cookie                |
| 178 | Pepperidge Farm Brussels                   | Pepperidge Farm | Thin chocolate biscuit                 |
| 179 | Pepperidge Farm Geneva                     | Pepperidge Farm | Chocolate-covered cookie               |
| 180 | Pepperidge Farm Chessmen                   | Pepperidge Farm | Butter biscuit                         |
| 181 | Tim Tam Original                           | Arnott's        | Chocolate-coated sandwich biscuit      |
| 182 | Tim Tam Double Coat                        | Arnott's        | Double chocolate-coated biscuit        |
| 183 | Tim Tam Dark                               | Arnott's        | Dark chocolate biscuit                 |
| 184 | Tim Tam Chewy Caramel                      | Arnott's        | Caramel-filled chocolate biscuit       |
| 185 | Tim Tam White                              | Arnott's        | White chocolate biscuit                |
| 186 | Wagon Wheels Original                      | Arnott's        | Marshmallow chocolate biscuit          |
| 187 | Kingston                                   | Arnott's        | Coconut and chocolate sandwich biscuit |
| 188 | Monte Carlo                                | Arnott's        | Cream and jam sandwich biscuit         |
| 189 | Mint Slice                                 | Arnott's        | Mint cream chocolate biscuit           |
| 190 | Royals                                     | Arnott's        | Marshmallow chocolate biscuit          |
| 191 | Choco Leibniz Dark                         | Bahlsen         | Dark chocolate butter biscuit          |
| 192 | Choco Leibniz White                        | Bahlsen         | White chocolate butter biscuit         |
| 193 | Choco Leibniz Milk                         | Bahlsen         | Milk chocolate butter biscuit          |
| 194 | Choco Leibniz Orange                       | Bahlsen         | Orange chocolate biscuit               |
| 195 | Chocolate Digestive                        | McVitie's       | Chocolate-covered digestive            |
| 196 | Chocolate Digestive                        | Gullón          | Chocolate digestive biscuit            |
| 197 | Choco Wafer                                | Loacker         | Chocolate wafer                        |
| 198 | Quadratini Dark Chocolate                  | Loacker         | Dark chocolate wafer cubes             |
| 199 | Quadratini Cappuccino                      | Loacker         | Coffee-flavoured wafer cubes           |
| 200 | Choco Sticks                               | Bahlsen         | Chocolate-covered biscuit sticks       |

## 5. Butter, Shortbread & Premium Biscuits (201–250)

| No. | Product name                      | Brand                         | Details                             |
| --- | --------------------------------- | ----------------------------- | ----------------------------------- |
| 201 | Pure Butter Shortbread            | Walkers                       | Traditional Scottish shortbread     |
| 202 | Shortbread Fingers                | Walkers                       | Butter-rich finger biscuits         |
| 203 | Shortbread Rounds                 | Walkers                       | Round shortbread biscuits           |
| 204 | Highlanders                       | Walkers                       | Scottish butter biscuit             |
| 205 | Petticoat Tails                   | Walkers                       | Traditional shortbread              |
| 206 | Shortbread House Original         | Shortbread House of Edinburgh | Premium Scottish shortbread         |
| 207 | All Butter Shortbread             | Fox's                         | Butter-rich shortbread              |
| 208 | Viennese Whirls                   | Fox's                         | Butter whirl biscuits               |
| 209 | Classic Viennese                  | Border Biscuits               | Butter-rich Viennese biscuit        |
| 210 | Luxury Shortbread                 | Border Biscuits               | Premium shortbread                  |
| 211 | All Butter Cookies                | Danish Garden                 | Danish butter cookies               |
| 212 | Royal Dansk Danish Butter Cookies | Royal Dansk                   | Traditional Danish butter cookies   |
| 213 | Danish Butter Cookies             | Kjeldsens                     | Premium Danish butter cookies       |
| 214 | Butter Cookies                    | Danisa                        | Danish-style butter cookies         |
| 215 | Danish Butter Cookies             | Jacobsens Bakery              | Butter cookies                      |
| 216 | Danish Butter Cookies             | Maitre Truffout               | Butter cookies                      |
| 217 | Butter Rings                      | Royal Dansk                   | Ring-shaped butter cookies          |
| 218 | Pretzel Style Butter Cookies      | Royal Dansk                   | Butter cookie with pretzel shape    |
| 219 | Coconut Butter Cookies            | Royal Dansk                   | Coconut-flavoured butter cookie     |
| 220 | Chocolate Chip Butter Cookies     | Royal Dansk                   | Chocolate-chip butter cookie        |
| 221 | Petit Beurre                      | LU                            | French butter biscuit               |
| 222 | Petit Beurre                      | La Mère Poulard               | French-style butter biscuit         |
| 223 | Petit Beurre                      | St Michel                     | French butter biscuit               |
| 224 | Galettes Bretonnes                | St Michel                     | Breton butter biscuit               |
| 225 | Palets Bretons                    | St Michel                     | Thick butter shortbread             |
| 226 | Sablés de Retz                    | St Michel                     | French butter biscuit               |
| 227 | Biscuit Rose de Reims             | Fossier                       | Traditional pink French biscuit     |
| 228 | Speculoos Original                | Lotus Biscoff                 | Caramelised spiced biscuit          |
| 229 | Speculoos Sandwich                | Lotus Biscoff                 | Biscoff cream-filled biscuit        |
| 230 | Biscoff Chocolate                 | Lotus Biscoff                 | Chocolate-coated spiced biscuit     |
| 231 | Biscoff Vanilla                   | Lotus Biscoff                 | Vanilla-flavoured biscuit           |
| 232 | Biscoff Crumble                   | Lotus Biscoff                 | Crumb-style biscuit product         |
| 233 | Butter Cookies                    | Unibic                        | Butter-rich cookie                  |
| 234 | Butter Cookies                    | Britannia                     | Butter biscuit                      |
| 235 | Butter Cookies                    | Priyagold                     | Butter biscuit                      |
| 236 | Butter Cookies                    | Anmol                         | Butter biscuit                      |
| 237 | Butter Cookies                    | Bisk Farm                     | Butter biscuit                      |
| 238 | Butter Cookies                    | Dukes                         | Butter biscuit                      |
| 239 | Butter Cookies                    | Cremica                       | Butter biscuit                      |
| 240 | Kaju Butter Cookies               | Karachi Bakery                | Cashew butter cookie                |
| 241 | Fruit Biscuit                     | Karachi Bakery                | Biscuit with candied fruit          |
| 242 | Osmania Biscuit                   | Karachi Bakery                | Traditional Hyderabadi milk biscuit |
| 243 | Chand Biscuit                     | Karachi Bakery                | Traditional sweet biscuit           |
| 244 | Irani Biscuit                     | Karachi Bakery                | Tea-time butter biscuit             |
| 245 | Nankhatai                         | Karachi Bakery                | Indian shortbread biscuit           |
| 246 | Nankhatai                         | Haldiram's                    | Indian shortbread                   |
| 247 | Nankhatai                         | Bikaji                        | Traditional Indian shortbread       |
| 248 | Nankhatai                         | Bikanervala                   | Traditional Indian biscuit          |
| 249 | Atta Biscuit                      | Karachi Bakery                | Whole-wheat biscuit                 |
| 250 | Almond Biscuit                    | Karachi Bakery                | Almond-based biscuit                |

## 6. Cookies & American-Style Biscuits (251–300)

| No. | Product name                       | Brand           | Details                                |
| --- | ---------------------------------- | --------------- | -------------------------------------- |
| 251 | Original Chocolate Chip            | Mrs. Fields     | Soft chocolate-chip cookie             |
| 252 | Semi-Sweet Chocolate Chunk         | Mrs. Fields     | Chocolate chunk cookie                 |
| 253 | White Chocolate Macadamia          | Mrs. Fields     | White chocolate and macadamia cookie   |
| 254 | Peanut Butter Cookie               | Mrs. Fields     | Peanut butter cookie                   |
| 255 | Oatmeal Raisin                     | Mrs. Fields     | Oatmeal and raisin cookie              |
| 256 | Double Chocolate                   | Mrs. Fields     | Double chocolate cookie                |
| 257 | Classic Chocolate Chip             | Pepperidge Farm | Chocolate-chip cookie                  |
| 258 | Sausalito Milk Chocolate Macadamia | Pepperidge Farm | Macadamia chocolate cookie             |
| 259 | Nantucket Dark Chocolate           | Pepperidge Farm | Dark chocolate cookie                  |
| 260 | Montauk Milk Chocolate             | Pepperidge Farm | Milk chocolate cookie                  |
| 261 | Milano Dark Chocolate              | Pepperidge Farm | Chocolate-filled crisp cookie          |
| 262 | Milano Orange                      | Pepperidge Farm | Orange chocolate cookie                |
| 263 | Milano Raspberry                   | Pepperidge Farm | Raspberry chocolate cookie             |
| 264 | Brussels                           | Pepperidge Farm | Thin crisp chocolate cookie            |
| 265 | Bordeaux                           | Pepperidge Farm | Caramelised butter cookie              |
| 266 | Chessmen                           | Pepperidge Farm | Butter cookie                          |
| 267 | Pirouette Chocolate Hazelnut       | Pepperidge Farm | Rolled wafer cookie                    |
| 268 | Pirouette French Vanilla           | Pepperidge Farm | Vanilla rolled wafer                   |
| 269 | Pirouette Chocolate Fudge          | Pepperidge Farm | Chocolate rolled wafer                 |
| 270 | Soft Batch Chocolate Chip          | Keebler         | Soft chocolate-chip cookie             |
| 271 | Chips Deluxe Original              | Keebler         | Chocolate-chip cookie                  |
| 272 | Chips Deluxe Rainbow               | Keebler         | Chocolate-chip candy cookie            |
| 273 | Fudge Stripes Original             | Keebler         | Chocolate-striped cookie               |
| 274 | Fudge Stripes Dark Chocolate       | Keebler         | Dark chocolate cookie                  |
| 275 | E.L. Fudge Original                | Keebler         | Chocolate cream sandwich cookie        |
| 276 | Sandies Pecan                      | Keebler         | Pecan shortbread cookie                |
| 277 | Sandies Simply Shortbread          | Keebler         | Shortbread cookie                      |
| 278 | Coconut Dreams                     | Keebler         | Coconut and chocolate cookie           |
| 279 | Vienna Fingers                     | Keebler         | Vanilla cream sandwich cookie          |
| 280 | Grasshopper Mint                   | Keebler         | Mint chocolate cookie                  |
| 281 | Nutter Butter                      | Nabisco         | Peanut butter sandwich cookie          |
| 282 | Nilla Wafers                       | Nabisco         | Vanilla wafer biscuit                  |
| 283 | Fig Newtons                        | Nabisco         | Fig-filled soft biscuit                |
| 284 | Golden Oreos                       | Oreo            | Golden sandwich cookie                 |
| 285 | Oreo Thins                         | Oreo            | Thin sandwich cookie                   |
| 286 | Oreo Mini                          | Oreo            | Miniature sandwich cookies             |
| 287 | Oreo Cakesters                     | Oreo            | Soft cake-style cookie                 |
| 288 | Golden Oreo Cakesters              | Oreo            | Soft vanilla cookie                    |
| 289 | Teddy Grahams Honey                | Nabisco         | Honey graham snack biscuits            |
| 290 | Teddy Grahams Chocolate            | Nabisco         | Chocolate graham snack biscuits        |
| 291 | Graham Crackers Honey Maid         | Nabisco         | Honey graham crackers                  |
| 292 | Graham Crackers Cinnamon           | Nabisco         | Cinnamon graham crackers               |
| 293 | Graham Crackers Chocolate          | Nabisco         | Chocolate graham crackers              |
| 294 | Girl Scout Thin Mints              | Girl Scouts     | Mint chocolate cookies                 |
| 295 | Girl Scout Samoas                  | Girl Scouts     | Caramel coconut chocolate cookies      |
| 296 | Girl Scout Tagalongs               | Girl Scouts     | Peanut butter chocolate cookies        |
| 297 | Girl Scout Trefoils                | Girl Scouts     | Shortbread cookies                     |
| 298 | Girl Scout Do-si-dos               | Girl Scouts     | Oatmeal peanut butter sandwich cookies |
| 299 | Girl Scout Adventurefuls           | Girl Scouts     | Brownie-inspired caramel cookies       |
| 300 | Girl Scout Lemon-Ups               | Girl Scouts     | Lemon-flavoured cookies                |

## 7. Coconut, Fruit, Nut & Specialty Biscuits (301–350)

| No. | Product name                  | Brand            | Details                                        |
| --- | ----------------------------- | ---------------- | ---------------------------------------------- |
| 301 | Coconut Cookies               | Unibic           | Coconut-flavoured cookie                       |
| 302 | Coconut Cookies               | Britannia        | Coconut biscuit                                |
| 303 | Coconut Cookies               | Parle            | Coconut biscuit                                |
| 304 | Coconut Cookies               | Priyagold        | Coconut biscuit                                |
| 305 | Coconut Cookies               | Anmol            | Coconut biscuit                                |
| 306 | Coconut Cookies               | Bisk Farm        | Coconut biscuit                                |
| 307 | Coconut Macaroons             | Walkers          | Coconut-based sweet biscuit                    |
| 308 | Coconut Rings                 | Bahlsen          | Coconut ring biscuit                           |
| 309 | Coconut Biscuits              | McVitie's        | Coconut-flavoured biscuit                      |
| 310 | Coconut Biscuits              | Paterson's       | Coconut biscuit                                |
| 311 | Almond Biscotti               | Nonni's          | Italian almond twice-baked biscuit             |
| 312 | Original Biscotti             | Nonni's          | Italian twice-baked biscuit                    |
| 313 | Cioccolati Biscotti           | Nonni's          | Chocolate biscotti                             |
| 314 | Limone Biscotti               | Nonni's          | Lemon biscotti                                 |
| 315 | Cranberry Cioccolati Biscotti | Nonni's          | Cranberry and chocolate biscotti               |
| 316 | Almond Biscotti               | Matilde Vicenzi  | Italian almond biscuit                         |
| 317 | Cantuccini Almond             | Antonio Mattei   | Traditional Tuscan almond biscuit              |
| 318 | Cantuccini Chocolate          | Antonio Mattei   | Chocolate almond biscuit                       |
| 319 | Cantuccini Pistachio          | Antonio Mattei   | Pistachio biscotti                             |
| 320 | Amaretti Classici             | Lazzaroni        | Italian almond macaroon biscuit                |
| 321 | Amaretti Morbidi              | Virginia         | Soft Italian almond biscuit                    |
| 322 | Amaretti                      | Matilde Vicenzi  | Italian almond biscuit                         |
| 323 | Pavesini                      | Pavesi           | Light Italian sponge biscuit                   |
| 324 | Savoiardi Ladyfingers         | Vicenzovo        | Italian sponge fingers                         |
| 325 | Ladyfingers                   | Balocco          | Sponge biscuits                                |
| 326 | Speculoos                     | Jules Destrooper | Belgian spiced biscuit                         |
| 327 | Butter Crisps                 | Jules Destrooper | Thin butter biscuit                            |
| 328 | Almond Thins                  | Jules Destrooper | Thin almond biscuit                            |
| 329 | Florentines                   | Fortnum & Mason  | Nut and caramel biscuit                        |
| 330 | Florentines                   | Marks & Spencer  | Chocolate and nut biscuit                      |
| 331 | Ginger Nuts                   | McVitie's        | Crunchy ginger biscuit                         |
| 332 | Gingerbread Men               | McVitie's        | Ginger-spiced biscuit                          |
| 333 | Gingerbread Men               | Walkers          | Traditional ginger biscuit                     |
| 334 | Stem Ginger Biscuits          | Border Biscuits  | Ginger biscuit                                 |
| 335 | Lemon Puffs                   | McVitie's        | Lemon cream sandwich biscuit                   |
| 336 | Orange Puffs                  | McVitie's        | Orange cream biscuit                           |
| 337 | Jaffa Cakes                   | McVitie's        | Sponge biscuit with orange jelly and chocolate |
| 338 | Jaffa Cakes Raspberry         | McVitie's        | Raspberry jelly chocolate-topped sponge        |
| 339 | Fig Rolls                     | McVitie's        | Fig-filled soft biscuit                        |
| 340 | Fig Rolls                     | Jacobs           | Fig-filled biscuit                             |
| 341 | Fig Rolls                     | Bolletje         | Fig-filled biscuit                             |
| 342 | Fruit Shortcake               | McVitie's        | Fruit-flavoured shortcake                      |
| 343 | Fruit Shortcake               | Crawford's       | Fruit biscuit                                  |
| 344 | Fruit Biscuits                | Parle            | Fruit-flavoured biscuit                        |
| 345 | Fruit Biscuits                | Britannia        | Fruit biscuit                                  |
| 346 | Fruit & Nut Cookies           | Unibic           | Fruit and nut cookie                           |
| 347 | Almond Cookies                | Unibic           | Almond cookie                                  |
| 348 | Cashew Cookies                | Unibic           | Cashew cookie                               |
| 349 | Cranberry Cookies             | Unibic           | Cranberry cookie                               |
| 350 | Pistachio Cookies             | Unibic           | Pistachio cookie                               |

## 8. Wafer Biscuits & Wafer Rolls (351–400)

| No. | Product name                  | Brand     | Details                           |
| --- | ----------------------------- | --------- | --------------------------------- |
| 351 | Munch Wafer                   | Nestlé    | Chocolate-coated wafer            |
| 352 | KitKat 2 Finger               | Nestlé    | Chocolate-covered wafer fingers   |
| 353 | KitKat 4 Finger               | Nestlé    | Four-finger chocolate wafer       |
| 354 | KitKat Chunky                 | Nestlé    | Thick chocolate wafer             |
| 355 | KitKat Chunky Peanut Butter   | Nestlé    | Peanut butter wafer               |
| 356 | KitKat Dark                   | Nestlé    | Dark chocolate wafer              |
| 357 | KitKat White                  | Nestlé    | White chocolate wafer             |
| 358 | Perk                          | Cadbury   | Chocolate-coated wafer            |
| 359 | Perk XXL                      | Cadbury   | Large chocolate wafer             |
| 360 | 5 Star Crunchy                | Cadbury   | Chocolate and wafer confectionery |
| 361 | Wafer Chocolate               | Loacker   | Chocolate cream wafer             |
| 362 | Quadratini Espresso           | Loacker   | Espresso cream wafer cubes        |
| 363 | Quadratini Coconut            | Loacker   | Coconut cream wafer cubes         |
| 364 | Quadratini Raspberry-Yoghurt  | Loacker   | Raspberry yoghurt wafer cubes     |
| 365 | Quadratini Peanut Butter      | Loacker   | Peanut butter wafer cubes         |
| 366 | Tortina Original              | Loacker   | Chocolate-covered wafer           |
| 367 | Tortina White                 | Loacker   | White chocolate wafer             |
| 368 | Tortina Dark                  | Loacker   | Dark chocolate wafer              |
| 369 | Gardena Hazelnut              | Loacker   | Hazelnut cream wafer              |
| 370 | Gardena Coconut               | Loacker   | Coconut cream wafer               |
| 371 | Manner Original Neapolitaner  | Manner    | Hazelnut wafer                    |
| 372 | Manner Chocolate              | Manner    | Chocolate cream wafer             |
| 373 | Manner Lemon                  | Manner    | Lemon cream wafer                 |
| 374 | Manner Hazelnut               | Manner    | Hazelnut wafer                    |
| 375 | Manner Strawberry             | Manner    | Strawberry cream wafer            |
| 376 | Knoppers                      | Storck    | Milk hazelnut wafer               |
| 377 | Knoppers Dark                 | Storck    | Dark chocolate wafer              |
| 378 | Knoppers Coconut              | Storck    | Coconut wafer                     |
| 379 | Hanuta                        | Ferrero   | Hazelnut chocolate wafer          |
| 380 | Hanuta Riegel                 | Ferrero   | Hazelnut wafer bar                |
| 381 | Kinder Bueno                  | Kinder    | Hazelnut cream wafer              |
| 382 | Kinder Bueno White            | Kinder    | White chocolate wafer             |
| 383 | Kinder Bueno Mini             | Kinder    | Mini hazelnut wafer               |
| 384 | Kinder Happy Hippo            | Kinder    | Hippo-shaped cream wafer          |
| 385 | Loacker Classic Peanut Butter | Loacker   | Peanut butter wafer               |
| 386 | Loacker Classic Cappuccino    | Loacker   | Cappuccino cream wafer            |
| 387 | Loacker Classic Coconut       | Loacker   | Coconut wafer                     |
| 388 | Gaufrettes Vanille            | LU        | French vanilla wafer              |
| 389 | Gaufrettes Chocolat           | LU        | Chocolate wafer                   |
| 390 | Gaufrettes Fraise             | LU        | Strawberry wafer                  |
| 391 | Gaufrette                     | Gavottes  | French crispy wafer               |
| 392 | Pirouline Chocolate Hazelnut  | Pirouline | Rolled wafer biscuit              |
| 393 | Pirouline Dark Chocolate      | Pirouline | Dark chocolate rolled wafer       |
| 394 | Pirouline Vanilla             | Pirouline | Vanilla rolled wafer              |
| 395 | Pirouline Strawberry          | Pirouline | Strawberry rolled wafer           |
| 396 | Wafer Rolls Chocolate         | Bahlsen   | Chocolate-filled wafer rolls      |
| 397 | Wafer Rolls Vanilla           | Bahlsen   | Vanilla-filled wafer rolls        |
| 398 | Wafer Rolls Hazelnut          | Bahlsen   | Hazelnut wafer rolls              |
| 399 | Tango Wafer Chocolate         | Tango     | Chocolate wafer                   |
| 400 | Tango Wafer Vanilla           | Tango     | Vanilla wafer                     |

## 9. Savoury Biscuits, Crackers & Cheese Biscuits (401–450)

| No. | Product name                   | Brand           | Details                          |
| --- | ------------------------------ | --------------- | -------------------------------- |
| 401 | Monaco Classic                 | Parle           | Salted savoury biscuit           |
| 402 | Monaco Cheeselings             | Parle           | Cheese-flavoured savoury snack   |
| 403 | 50-50 Sweet & Salty            | Britannia       | Sweet and salted biscuit         |
| 404 | 50-50 Maska Chaska             | Britannia       | Butter-flavoured salted biscuit  |
| 405 | Time Pass                      | Parle           | Spiced savoury biscuit           |
| 406 | KrackJack                      | Parle           | Sweet and salty cracker          |
| 407 | Cream Cracker                  | Britannia       | Plain salted cracker             |
| 408 | Salted Crackers                | Jacob's         | Traditional savoury cracker      |
| 409 | Cheese Crackers                | Jacob's         | Cheese-flavoured cracker         |
| 410 | Mini Cheddars Original         | Jacob's         | Cheese-flavoured baked cracker   |
| 411 | Mini Cheddars Red Leicester    | Jacob's         | Red Leicester cheese cracker     |
| 412 | Mini Cheddars Smoky BBQ        | Jacob's         | BBQ-flavoured cheese cracker     |
| 413 | Cheddars                       | Carr's          | Cheese cracker                   |
| 414 | Table Water Crackers           | Carr's          | Light crisp cracker              |
| 415 | Whole Wheat Crackers           | Carr's          | Whole-wheat cracker              |
| 416 | Water Crackers                 | Carr's          | Thin savoury cracker             |
| 417 | Original Crackers              | Ritz            | Buttery salted cracker           |
| 418 | Fresh Stacks Original          | Ritz            | Individually packed crackers     |
| 419 | Ritz Bits Cheese               | Ritz            | Cheese-filled mini crackers      |
| 420 | Ritz Bits Peanut Butter        | Ritz            | Peanut butter-filled crackers    |
| 421 | Cheese Nips                    | Nabisco         | Cheese-flavoured crackers        |
| 422 | Cheez-It Original              | Kellogg's       | Baked cheese cracker             |
| 423 | Cheez-It White Cheddar         | Kellogg's       | White cheddar cracker            |
| 424 | Cheez-It Extra Toasty          | Kellogg's       | Extra-toasted cheese cracker     |
| 425 | Cheez-It Grooves               | Kellogg's       | Ridged cheese cracker            |
| 426 | Cheez-It Snap'd                | Kellogg's       | Thin crispy cheese cracker       |
| 427 | Goldfish Cheddar               | Pepperidge Farm | Fish-shaped cheese cracker       |
| 428 | Goldfish Parmesan              | Pepperidge Farm | Parmesan cheese cracker          |
| 429 | Goldfish Pretzel               | Pepperidge Farm | Pretzel-shaped cracker           |
| 430 | Goldfish Colors                | Pepperidge Farm | Coloured cheese crackers         |
| 431 | TUC Original                   | LU              | Salted cracker                   |
| 432 | TUC Cheese                     | LU              | Cheese cracker                   |
| 433 | TUC Bacon                      | LU              | Bacon-flavoured cracker          |
| 434 | TUC Sour Cream & Onion         | LU              | Sour cream and onion cracker     |
| 435 | TUC Paprika                    | LU              | Paprika cracker                  |
| 436 | TUC Salt & Pepper              | LU              | Seasoned cracker                 |
| 437 | Carr's Melts Cheese            | Carr's          | Cheese-flavoured crisp biscuit   |
| 438 | Carr's Rosemary Crackers       | Carr's          | Rosemary-flavoured cracker       |
| 439 | Carr's Sesame Crackers         | Carr's          | Sesame cracker                   |
| 440 | Carr's Poppy & Sesame Crackers | Carr's          | Seeded cracker                   |
| 441 | Tuc Mini                       | LU              | Mini savoury crackers            |
| 442 | Cream Crackers                 | Crawford's      | Plain cream crackers             |
| 443 | Cream Crackers                 | McVitie's       | Crisp savoury cracker            |
| 444 | Water Biscuits                 | Peter's Yard    | Crisp Scandinavian-style cracker |
| 445 | Sourdough Crackers             | Peter's Yard    | Sourdough crispbread             |
| 446 | Original Crispbread            | Ryvita          | Rye crispbread                   |
| 447 | Sesame Crispbread              | Ryvita          | Sesame rye crispbread            |
| 448 | Multigrain Crispbread          | Ryvita          | Multigrain crispbread            |
| 449 | Rye Crispbread                 | Finn Crisp      | Traditional rye crispbread       |
| 450 | Multigrain Crispbread          | Finn Crisp      | Multigrain rye cracker           |

## 10. Asian, Japanese, Korean & International Biscuits (451–500)

| No. | Product name             | Brand        | Details                                       |
| --- | ------------------------ | ------------ | --------------------------------------------- |
| 451 | Bourbon Petit            | Bourbon      | Japanese chocolate biscuit                    |
| 452 | Alfort Mini Chocolate    | Bourbon      | Chocolate-topped biscuit                      |
| 453 | Alfort Milk Chocolate    | Bourbon      | Milk chocolate biscuit                        |
| 454 | Alfort Dark Chocolate    | Bourbon      | Dark chocolate biscuit                        |
| 455 | Every Burger             | Bourbon      | Burger-shaped chocolate biscuit               |
| 456 | Lumonde                  | Bourbon      | Chocolate-coated rolled biscuit               |
| 457 | Petit Series Chocolate   | Bourbon      | Mini chocolate biscuits                       |
| 458 | Choco & Coffee           | Bourbon      | Chocolate and coffee biscuit                  |
| 459 | Country Ma'am Vanilla    | Fujiya       | Soft-centred vanilla cookie                   |
| 460 | Country Ma'am Chocolate  | Fujiya       | Soft-centred chocolate cookie                 |
| 461 | Look Chocolate Cookie    | Fujiya       | Chocolate-flavoured biscuit                   |
| 462 | Home Pie                 | Fujiya       | Flaky pie-style biscuit                       |
| 463 | Koala's March Chocolate  | Lotte        | Koala-shaped chocolate biscuit                |
| 464 | Koala's March Strawberry | Lotte        | Strawberry cream biscuit                      |
| 465 | Koala's March Vanilla    | Lotte        | Vanilla cream biscuit                         |
| 466 | Toppo Chocolate          | Lotte        | Chocolate-filled biscuit sticks               |
| 467 | Toppo Strawberry         | Lotte        | Strawberry-filled biscuit sticks              |
| 468 | Ghana Chocolate Cookie   | Lotte        | Chocolate biscuit                             |
| 469 | Choco Pie                | Lotte        | Marshmallow-filled chocolate cake biscuit     |
| 470 | Custard Cake             | Lotte        | Custard-filled soft cake biscuit              |
| 471 | Pepero Original          | Lotte        | Chocolate-coated biscuit sticks               |
| 472 | Pepero Almond            | Lotte        | Almond and chocolate biscuit sticks           |
| 473 | Pepero White Cookie      | Lotte        | White chocolate cookie-coated sticks          |
| 474 | Pepero Nude              | Lotte        | Chocolate-filled biscuit sticks               |
| 475 | Pepero Crunchy           | Lotte        | Crunchy chocolate biscuit sticks              |
| 476 | Pocky Chocolate          | Glico        | Chocolate-coated biscuit sticks               |
| 477 | Pocky Strawberry         | Glico        | Strawberry-coated biscuit sticks              |
| 478 | Pocky Almond Crush       | Glico        | Almond chocolate biscuit sticks               |
| 479 | Pocky Cookies & Cream    | Glico        | Cookies and cream biscuit sticks              |
| 480 | Pocky Matcha             | Glico        | Matcha-coated biscuit sticks                  |
| 481 | Hello Panda Chocolate    | Meiji        | Panda-shaped chocolate-filled biscuits        |
| 482 | Hello Panda Strawberry   | Meiji        | Strawberry-filled panda biscuits              |
| 483 | Hello Panda Vanilla      | Meiji        | Vanilla-filled panda biscuits                 |
| 484 | Hello Panda Caramel      | Meiji        | Caramel-filled panda biscuits                 |
| 485 | Yan Yan Chocolate        | Meiji        | Biscuit sticks with chocolate dip             |
| 486 | Yan Yan Strawberry       | Meiji        | Biscuit sticks with strawberry dip            |
| 487 | Yan Yan Vanilla          | Meiji        | Biscuit sticks with vanilla dip               |
| 488 | Glico Pretz Original     | Glico        | Savoury biscuit sticks                        |
| 489 | Glico Pretz Tomato       | Glico        | Tomato-flavoured biscuit sticks               |
| 490 | Glico Pretz Salad        | Glico        | Salad-seasoned biscuit sticks                 |
| 491 | Hi-Chew Biscuit Sandwich | Morinaga     | Biscuit-style confectionery variant           |
| 492 | Marie Biscuit            | Meiji        | Japanese-style tea biscuit                    |
| 493 | Rich Tea Biscuit         | Meiji        | Light tea biscuit                             |
| 494 | Moonlight Cookies        | Morinaga     | Soft buttery cookie                           |
| 495 | Choco Chips Cookies      | Morinaga     | Chocolate-chip cookie                         |
| 496 | Sesame Biscuits          | Want Want    | Sesame-flavoured biscuit                      |
| 497 | Senbei Rice Crackers     | Kameda Seika | Japanese rice cracker                         |
| 498 | Happy Turn               | Kameda Seika | Seasoned Japanese rice cracker                |
| 499 | Bourbon Cheese Okaki     | Bourbon      | Japanese savoury rice cracker                 |
| 500 | White Lover              | Ishiya       | White chocolate-filled langue de chat biscuit |
"""

lines = raw_text.strip().split("\n")
current_category = ""
entries = []

for line in lines:
    line = line.strip()
    if line.startswith("## "):
        # e.g. ## 1. Cream Biscuits (1–50)
        m = re.match(r"##\s+\d+\.\s+(.*?)(?:\s+\(\d+.*?\))?$", line)
        if m:
            current_category = m.group(1).strip()
    elif line.startswith("|") and not line.startswith("| No.") and not line.startswith("| ---"):
        parts = [p.strip() for p in line.split("|")[1:-1]]
        if len(parts) >= 4 and parts[0].isdigit():
            num = int(parts[0])
            name = parts[1]
            brand = parts[2]
            details = parts[3]
            
            # Correction requested by user:
            # "Item 491 should be corrected to Morinaga Choco Chips (chocolate-chip cookie), rather than Hi-Chew Biscuit Sandwich."
            if num == 491:
                name = "Morinaga Choco Chips"
                brand = "Morinaga"
                details = "Chocolate-chip cookie"
                
            entries.append({
                "number": num,
                "productId": f"BIS-{num:04d}",
                "productName": name,
                "brand": brand,
                "categorySection": current_category,
                "details": details
            })

print(f"Parsed {len(entries)} entries successfully.")
assert len(entries) == 500, f"Expected 500, got {len(entries)}"
with open("scripts/data/parsed_biscuit_500.json", "w") as f:
    json.dump(entries, f, indent=2)
print("Saved to scripts/data/parsed_biscuit_500.json")
