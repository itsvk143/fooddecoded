import json
import re

raw_text = """
## 1. Amul Ice Creams (1–50)

| No. | Product name      | Brand | Type / flavour         |
| --- | ----------------- | ----- | ---------------------- |
| 1   | Rajbhog           | Amul  | Indian nut and saffron |
| 2   | Kesar Pista       | Amul  | Saffron and pistachio  |
| 3   | Royal Chocolate   | Amul  | Chocolate              |
| 4   | Chocolate Brownie | Amul  | Chocolate brownie      |
| 5   | Choco Chips       | Amul  | Chocolate chip         |
| 6   | Belgian Chocolate | Amul  | Dark chocolate         |
| 7   | Chocolate Magic   | Amul  | Chocolate              |
| 8   | Vanilla           | Amul  | Vanilla                |
| 9   | Strawberry        | Amul  | Strawberry             |
| 10  | Butterscotch      | Amul  | Butterscotch           |
| 11  | Mango             | Amul  | Mango                  |
| 12  | Alphonso Mango    | Amul  | Alphonso mango         |
| 13  | Sitaphal          | Amul  | Custard apple          |
| 14  | Anjeer            | Amul  | Fig                    |
| 15  | Kaju Draksh       | Amul  | Cashew and raisins     |
| 16  | Kaju Kishmish     | Amul  | Cashew and raisins     |
| 17  | Pista             | Amul  | Pistachio              |
| 18  | American Nuts     | Amul  | Mixed nuts             |
| 19  | Fruit and Nut     | Amul  | Fruit and nuts         |
| 20  | Black Currant     | Amul  | Blackcurrant           |
| 21  | Blueberry         | Amul  | Blueberry              |
| 22  | Tender Coconut    | Amul  | Coconut                |
| 23  | Coconut           | Amul  | Coconut                |
| 24  | Rajwadi Kulfi     | Amul  | Traditional kulfi      |
| 25  | Malai Kulfi       | Amul  | Milk-based kulfi       |
| 26  | Kesar Kulfi       | Amul  | Saffron kulfi          |
| 27  | Matka Kulfi       | Amul  | Traditional kulfi      |
| 28  | Chocolate Kulfi   | Amul  | Chocolate kulfi        |
| 29  | Rabri             | Amul  | Rabri                  |
| 30  | Shahi Anjeer      | Amul  | Fig and nuts           |
| 31  | Caramel Nuts      | Amul  | Caramel and nuts       |
| 32  | Coffee            | Amul  | Coffee                 |
| 33  | Mocha             | Amul  | Coffee and chocolate   |
| 34  | Cookies and Cream | Amul  | Cookie                 |
| 35  | Choco Almond      | Amul  | Chocolate and almond   |
| 36  | Choco Vanilla     | Amul  | Chocolate and vanilla  |
| 37  | Mango Duet        | Amul  | Mango combination      |
| 38  | Orange            | Amul  | Orange                 |
| 39  | Pineapple         | Amul  | Pineapple              |
| 40  | Litchi            | Amul  | Litchi                 |
| 41  | Guava             | Amul  | Guava                  |
| 42  | Kesar             | Amul  | Saffron                |
| 43  | Rose              | Amul  | Rose                   |
| 44  | Elaichi           | Amul  | Cardamom               |
| 45  | Meetha Paan       | Amul  | Paan                   |
| 46  | Gulkand           | Amul  | Rose petal preserve    |
| 47  | Black Forest      | Amul  | Chocolate and cherry   |
| 48  | Red Velvet        | Amul  | Red velvet             |
| 49  | Chocolate Fudge   | Amul  | Chocolate fudge        |
| 50  | Choco Lava        | Amul  | Chocolate              |

## 2. Mother Dairy Ice Creams (51–100)

| No. | Product name       | Brand        | Type / flavour        |
| --- | ------------------ | ------------ | --------------------- |
| 51  | Vanilla            | Mother Dairy | Vanilla               |
| 52  | Chocolate          | Mother Dairy | Chocolate             |
| 53  | Strawberry         | Mother Dairy | Strawberry            |
| 54  | Butterscotch       | Mother Dairy | Butterscotch          |
| 55  | Kesar Pista        | Mother Dairy | Saffron and pistachio |
| 56  | Rajbhog            | Mother Dairy | Indian nut flavour    |
| 57  | Mango              | Mother Dairy | Mango                 |
| 58  | Alphonso Mango     | Mother Dairy | Alphonso mango        |
| 59  | Black Currant      | Mother Dairy | Blackcurrant          |
| 60  | American Nuts      | Mother Dairy | Mixed nuts            |
| 61  | Choco Chips        | Mother Dairy | Chocolate chip        |
| 62  | Chocolate Brownie  | Mother Dairy | Brownie               |
| 63  | Cookies and Cream  | Mother Dairy | Cookie                |
| 64  | Fruit and Nut      | Mother Dairy | Fruit and nuts        |
| 65  | Pista              | Mother Dairy | Pistachio             |
| 66  | Kaju Kishmish      | Mother Dairy | Cashew and raisins    |
| 67  | Anjeer             | Mother Dairy | Fig                   |
| 68  | Sitaphal           | Mother Dairy | Custard apple         |
| 69  | Tender Coconut     | Mother Dairy | Coconut               |
| 70  | Litchi             | Mother Dairy | Litchi                |
| 71  | Orange             | Mother Dairy | Orange                |
| 72  | Pineapple          | Mother Dairy | Pineapple             |
| 73  | Coffee             | Mother Dairy | Coffee                |
| 74  | Mocha              | Mother Dairy | Coffee and chocolate  |
| 75  | Chocolate Fudge    | Mother Dairy | Chocolate fudge       |
| 76  | Chocolate Almond   | Mother Dairy | Chocolate and almond  |
| 77  | Chocolate Vanilla  | Mother Dairy | Chocolate and vanilla |
| 78  | Black Forest       | Mother Dairy | Chocolate and cherry  |
| 79  | Kulfi              | Mother Dairy | Traditional kulfi     |
| 80  | Malai Kulfi        | Mother Dairy | Milk-based kulfi      |
| 81  | Kesar Kulfi        | Mother Dairy | Saffron kulfi         |
| 82  | Pista Kulfi        | Mother Dairy | Pistachio kulfi       |
| 83  | Matka Kulfi        | Mother Dairy | Traditional kulfi     |
| 84  | Rabri Kulfi        | Mother Dairy | Rabri                 |
| 85  | Mango Bar          | Mother Dairy | Mango ice bar         |
| 86  | Orange Bar         | Mother Dairy | Orange ice bar        |
| 87  | Choco Bar          | Mother Dairy | Chocolate-coated bar  |
| 88  | Vanilla Cup        | Mother Dairy | Vanilla cup           |
| 89  | Chocolate Cup      | Mother Dairy | Chocolate cup         |
| 90  | Strawberry Cup     | Mother Dairy | Strawberry cup        |
| 91  | Butterscotch Cup   | Mother Dairy | Butterscotch cup      |
| 92  | Mango Cup          | Mother Dairy | Mango cup             |
| 93  | Kesar Pista Cup    | Mother Dairy | Saffron and pistachio |
| 94  | Chocolate Cone     | Mother Dairy | Chocolate cone        |
| 95  | Vanilla Cone       | Mother Dairy | Vanilla cone          |
| 96  | Strawberry Cone    | Mother Dairy | Strawberry cone       |
| 97  | Butterscotch Cone  | Mother Dairy | Butterscotch cone     |
| 98  | Choco Vanilla Cone | Mother Dairy | Chocolate and vanilla |
| 99  | Chocolate Sandwich | Mother Dairy | Ice cream sandwich    |
| 100 | Fruit Ice Cream    | Mother Dairy | Mixed fruit           |

## 3. Havmor Ice Creams (101–150)

| No. | Product name              | Brand  | Type / flavour         |
| --- | ------------------------- | ------ | ---------------------- |
| 101 | Choco Brownie             | Havmor | Chocolate brownie      |
| 102 | Kesar Pista               | Havmor | Saffron and pistachio  |
| 103 | Mahabaleshwar Strawberry  | Havmor | Strawberry             |
| 104 | Biscotti                  | Havmor | Biscuit and cream      |
| 105 | Taj Mahal                 | Havmor | Premium nut ice cream  |
| 106 | Tutti Frutti              | Havmor | Candied fruit          |
| 107 | Butterscotch              | Havmor | Butterscotch           |
| 108 | Vanilla                   | Havmor | Vanilla                |
| 109 | Chocolate                 | Havmor | Chocolate              |
| 110 | Rajbhog                   | Havmor | Indian nut and saffron |
| 111 | Chocolate Sundae          | Havmor | Chocolate sundae       |
| 112 | Cookie and Cream          | Havmor | Cookie and cream       |
| 113 | Hazelnut                  | Havmor | Hazelnut               |
| 114 | Yoghurt Berry Krunch      | Havmor | Berry and yoghurt      |
| 115 | Choco Vanilla Krunch      | Havmor | Chocolate and vanilla  |
| 116 | Choco Berry Krunch        | Havmor | Chocolate and berry    |
| 117 | Watermelon Ice Pops       | Havmor | Watermelon ice pop     |
| 118 | Shark Ice Pops            | Havmor | Fruity ice pop         |
| 119 | Red Velvet Heartbeat Cake | Havmor | Red velvet cake        |
| 120 | Butterscotch Cookie Cake  | Havmor | Butterscotch cake      |
| 121 | Italian Cassata           | Havmor | Cassata                |
| 122 | Blueberry Cheesecake      | Havmor | Blueberry cheesecake   |
| 123 | Mud Cake                  | Havmor | Chocolate cake         |
| 124 | Black Forest Cake         | Havmor | Chocolate and cherry   |
| 125 | Pista                     | Havmor | Pistachio              |
| 126 | Mango                     | Havmor | Mango                  |
| 127 | Strawberry                | Havmor | Strawberry             |
| 128 | Black Currant             | Havmor | Blackcurrant           |
| 129 | American Nuts             | Havmor | Mixed nuts             |
| 130 | Chocolate Chips           | Havmor | Chocolate chip         |
| 131 | Chocolate Fudge           | Havmor | Chocolate fudge        |
| 132 | Chocolate Almond          | Havmor | Chocolate and almond   |
| 133 | Kaju Kishmish             | Havmor | Cashew and raisins     |
| 134 | Anjeer                    | Havmor | Fig                    |
| 135 | Sitaphal                  | Havmor | Custard apple          |
| 136 | Coffee                    | Havmor | Coffee                 |
| 137 | Mocha                     | Havmor | Coffee and chocolate   |
| 138 | Orange                    | Havmor | Orange                 |
| 139 | Pineapple                 | Havmor | Pineapple              |
| 140 | Litchi                    | Havmor | Litchi                 |
| 141 | Coconut                   | Havmor | Coconut                |
| 142 | Kulfi                     | Havmor | Traditional kulfi      |
| 143 | Malai Kulfi               | Havmor | Milk-based kulfi       |
| 144 | Kesar Kulfi               | Havmor | Saffron kulfi          |
| 145 | Pista Kulfi               | Havmor | Pistachio kulfi        |
| 146 | Chocolate Cone            | Havmor | Chocolate cone         |
| 147 | Vanilla Cone              | Havmor | Vanilla cone           |
| 148 | Choco Brownie Sundae      | Havmor | Brownie sundae         |
| 149 | Choco Berry               | Havmor | Chocolate and berry    |
| 150 | Rajbhog Shake             | Havmor | Rajbhog milkshake      |

## 4. Kwality Wall's (151–200)

| No. | Product name                | Brand          | Type / flavour             |
| --- | --------------------------- | -------------- | -------------------------- |
| 151 | Cornetto Classic Chocolate  | Kwality Wall's | Chocolate cone             |
| 152 | Cornetto Double Chocolate   | Kwality Wall's | Double chocolate           |
| 153 | Cornetto Butterscotch       | Kwality Wall's | Butterscotch cone          |
| 154 | Cornetto Strawberry         | Kwality Wall's | Strawberry cone            |
| 155 | Cornetto Black Forest       | Kwality Wall's | Chocolate and cherry       |
| 156 | Cornetto Oreo               | Kwality Wall's | Oreo cookie                |
| 157 | Cornetto Disc               | Kwality Wall's | Chocolate cone             |
| 158 | Magnum Classic              | Magnum         | Chocolate-coated vanilla   |
| 159 | Magnum Almond               | Magnum         | Almond-coated chocolate    |
| 160 | Magnum Double Chocolate     | Magnum         | Double chocolate           |
| 161 | Magnum White Chocolate      | Magnum         | White chocolate            |
| 162 | Magnum Brownie              | Magnum         | Brownie and chocolate      |
| 163 | Magnum Mini Classic         | Magnum         | Mini chocolate-coated      |
| 164 | Feast Chocolate             | Kwality Wall's | Chocolate bar              |
| 165 | Feast Vanilla               | Kwality Wall's | Vanilla chocolate bar      |
| 166 | Feast Orange                | Kwality Wall's | Orange and chocolate       |
| 167 | Feast Black Currant         | Kwality Wall's | Blackcurrant               |
| 168 | Feast Mango                 | Kwality Wall's | Mango                      |
| 169 | Feast Choco Brownie         | Kwality Wall's | Brownie                    |
| 170 | Paddle Pop Rainbow          | Kwality Wall's | Rainbow fruit              |
| 171 | Paddle Pop Cola             | Kwality Wall's | Cola ice pop               |
| 172 | Paddle Pop Mango            | Kwality Wall's | Mango ice pop              |
| 173 | Paddle Pop Orange           | Kwality Wall's | Orange ice pop             |
| 174 | Paddle Pop Chocolate        | Kwality Wall's | Chocolate                  |
| 175 | Paddle Pop Jiggly Jungle    | Kwality Wall's | Fruity ice pop             |
| 176 | Moo                         | Kwality Wall's | Milk ice cream             |
| 177 | Moo Chocolate               | Kwality Wall's | Chocolate milk ice cream   |
| 178 | Moo Strawberry              | Kwality Wall's | Strawberry milk ice cream  |
| 179 | Creamy Delight Vanilla      | Kwality Wall's | Vanilla                    |
| 180 | Creamy Delight Chocolate    | Kwality Wall's | Chocolate                  |
| 181 | Creamy Delight Strawberry   | Kwality Wall's | Strawberry                 |
| 182 | Creamy Delight Butterscotch | Kwality Wall's | Butterscotch               |
| 183 | Creamy Delight Mango        | Kwality Wall's | Mango                      |
| 184 | Choco Brownie               | Kwality Wall's | Brownie                    |
| 185 | Chocolate Sundae            | Kwality Wall's | Chocolate sundae           |
| 186 | Vanilla Sundae              | Kwality Wall's | Vanilla sundae             |
| 187 | Strawberry Sundae           | Kwality Wall's | Strawberry sundae          |
| 188 | Butterscotch Sundae         | Kwality Wall's | Butterscotch sundae        |
| 189 | Chocolate Cup               | Kwality Wall's | Chocolate cup              |
| 190 | Vanilla Cup                 | Kwality Wall's | Vanilla cup                |
| 191 | Strawberry Cup              | Kwality Wall's | Strawberry cup             |
| 192 | Mango Cup                   | Kwality Wall's | Mango cup                  |
| 193 | Choco Vanilla Cup           | Kwality Wall's | Chocolate and vanilla      |
| 194 | Vanilla Sandwich            | Kwality Wall's | Ice cream sandwich         |
| 195 | Chocolate Sandwich          | Kwality Wall's | Chocolate sandwich         |
| 196 | Orange Ice Candy            | Kwality Wall's | Orange ice candy           |
| 197 | Mango Ice Candy             | Kwality Wall's | Mango ice candy            |
| 198 | Cola Ice Candy              | Kwality Wall's | Cola ice candy             |
| 199 | Strawberry Ice Candy        | Kwality Wall's | Strawberry ice candy       |
| 200 | Chocolate Bar               | Kwality Wall's | Chocolate-coated ice cream |

## 5. Baskin-Robbins (201–250)

| No. | Product name                | Brand          | Type / flavour              |
| --- | --------------------------- | -------------- | --------------------------- |
| 201 | Pralines 'n Cream           | Baskin-Robbins | Praline and caramel         |
| 202 | Jamoca Almond Fudge         | Baskin-Robbins | Coffee, almond and fudge    |
| 203 | Very Berry Strawberry       | Baskin-Robbins | Strawberry                  |
| 204 | Cotton Candy                | Baskin-Robbins | Cotton candy                |
| 205 | World Class Chocolate       | Baskin-Robbins | Double chocolate            |
| 206 | Gold Medal Ribbon           | Baskin-Robbins | Vanilla and caramel         |
| 207 | Strawberry Cheesecake       | Baskin-Robbins | Strawberry cheesecake       |
| 208 | Baseball Nut                | Baskin-Robbins | Vanilla and black raspberry |
| 209 | Mint Chocolate Chip         | Baskin-Robbins | Mint and chocolate          |
| 210 | Pistachio Almond            | Baskin-Robbins | Pistachio and almond        |
| 211 | Peanut Butter 'n Chocolate  | Baskin-Robbins | Peanut butter and chocolate |
| 212 | Chocolate Chip Cookie Dough | Baskin-Robbins | Cookie dough                |
| 213 | Cookies 'n Cream            | Baskin-Robbins | Cookies and cream           |
| 214 | Chocolate Mousse Royale     | Baskin-Robbins | Chocolate mousse            |
| 215 | Triple Mango                | Baskin-Robbins | Mango                       |
| 216 | Rainbow Sherbet             | Baskin-Robbins | Mixed fruit sherbet         |
| 217 | Rocky Road                  | Baskin-Robbins | Chocolate and nuts          |
| 218 | Cookie Monster              | Baskin-Robbins | Cookie and cream            |
| 219 | Love Potion #31             | Baskin-Robbins | Chocolate and raspberry     |
| 220 | Cherries Jubilee            | Baskin-Robbins | Cherry                      |
| 221 | Chocolate Fudge             | Baskin-Robbins | Chocolate fudge             |
| 222 | Daiquiri Ice                | Baskin-Robbins | Lime sherbet                |
| 223 | Icing on the Cake           | Baskin-Robbins | Cake and frosting           |
| 224 | Pink Bubblegum              | Baskin-Robbins | Bubblegum                   |
| 225 | Chocolate Chip              | Baskin-Robbins | Chocolate chip              |
| 226 | Old Fashioned Butter Pecan  | Baskin-Robbins | Butter pecan                |
| 227 | Reese's Peanut Butter Cup   | Baskin-Robbins | Peanut butter and chocolate |
| 228 | Oreo Cookies 'n Cream       | Baskin-Robbins | Oreo cookie                 |
| 229 | Jamoca                      | Baskin-Robbins | Coffee                      |
| 230 | Vanilla                     | Baskin-Robbins | Vanilla                     |
| 231 | Chocolate                   | Baskin-Robbins | Chocolate                   |
| 232 | Strawberry                  | Baskin-Robbins | Strawberry                  |
| 233 | French Vanilla              | Baskin-Robbins | French vanilla              |
| 234 | Banana Cream Pie            | Baskin-Robbins | Banana and pie              |
| 235 | Butter Pecan                | Baskin-Robbins | Butter and pecan            |
| 236 | Chocolate Almond            | Baskin-Robbins | Chocolate and almond        |
| 237 | Chocolate Chip Cheesecake   | Baskin-Robbins | Cheesecake and chocolate    |
| 238 | Nutty Coconut               | Baskin-Robbins | Coconut and nuts            |
| 239 | Pineapple Coconut           | Baskin-Robbins | Pineapple and coconut       |
| 240 | Wild 'n Reckless Sherbet    | Baskin-Robbins | Fruity sherbet              |
| 241 | Orange Sherbet              | Baskin-Robbins | Orange                      |
| 242 | Lemon Sorbet                | Baskin-Robbins | Lemon                       |
| 243 | Chocolate Fudge Bar         | Baskin-Robbins | Chocolate bar               |
| 244 | Vanilla Ice Cream Bar       | Baskin-Robbins | Vanilla bar                 |
| 245 | Pralines 'n Cream Bar       | Baskin-Robbins | Praline bar                 |
| 246 | Jamoca Almond Fudge Bar     | Baskin-Robbins | Coffee and almond           |
| 247 | Rocky Road Bar              | Baskin-Robbins | Chocolate and marshmallow   |
| 248 | Strawberry Cheesecake Bar   | Baskin-Robbins | Cheesecake bar              |
| 249 | Mint Chocolate Bar          | Baskin-Robbins | Mint chocolate              |
| 250 | Rainbow Sherbet Cup         | Baskin-Robbins | Fruit sherbet               |

## 6. Häagen-Dazs (251–300)

| No. | Product name                      | Brand       | Type / flavour                |
| --- | --------------------------------- | ----------- | ----------------------------- |
| 251 | Vanilla                           | Häagen-Dazs | Vanilla                       |
| 252 | Belgian Chocolate                 | Häagen-Dazs | Belgian chocolate             |
| 253 | Chocolate Chocolate Chip          | Häagen-Dazs | Chocolate chip                |
| 254 | Strawberry                        | Häagen-Dazs | Strawberry                    |
| 255 | Coffee                            | Häagen-Dazs | Coffee                        |
| 256 | Cookies and Cream                 | Häagen-Dazs | Cookie and cream              |
| 257 | Dulce de Leche                    | Häagen-Dazs | Caramel                       |
| 258 | Macadamia Nut Brittle             | Häagen-Dazs | Macadamia and brittle         |
| 259 | Butter Pecan                      | Häagen-Dazs | Butter pecan                  |
| 260 | Rocky Road                        | Häagen-Dazs | Chocolate and marshmallow     |
| 261 | Mint Chip                         | Häagen-Dazs | Mint chocolate                |
| 262 | Rum Raisin                        | Häagen-Dazs | Rum and raisins               |
| 263 | Pistachio                         | Häagen-Dazs | Pistachio                     |
| 264 | Green Tea                         | Häagen-Dazs | Matcha                        |
| 265 | Mango and Raspberry               | Häagen-Dazs | Mango and raspberry           |
| 266 | Salted Caramel                    | Häagen-Dazs | Salted caramel                |
| 267 | White Chocolate Raspberry Truffle | Häagen-Dazs | White chocolate and raspberry |
| 268 | Chocolate Peanut Butter           | Häagen-Dazs | Chocolate and peanut butter   |
| 269 | Vanilla Swiss Almond              | Häagen-Dazs | Vanilla and almond            |
| 270 | Caramel Cone                      | Häagen-Dazs | Caramel and cone              |
| 271 | Chocolate Peanut Butter Pretzel   | Häagen-Dazs | Chocolate and pretzel         |
| 272 | Strawberry Cheesecake             | Häagen-Dazs | Strawberry cheesecake         |
| 273 | New York Strawberry Cheesecake    | Häagen-Dazs | Cheesecake                    |
| 274 | Salted Brown Butter Cookie        | Häagen-Dazs | Brown butter cookie           |
| 275 | Triple Chocolate Fudge Cone       | Häagen-Dazs | Chocolate cone                |
| 276 | Vanilla Salted Caramel Cone       | Häagen-Dazs | Vanilla and caramel cone      |
| 277 | Summer Berry Cone                 | Häagen-Dazs | Berry cone                    |
| 278 | Vanilla Milk Chocolate Almond Bar | Häagen-Dazs | Almond-coated vanilla         |
| 279 | Vanilla Milk Chocolate Bar        | Häagen-Dazs | Chocolate-coated vanilla      |
| 280 | Dark Chocolate Ice Cream Bar      | Häagen-Dazs | Dark chocolate                |
| 281 | Coffee Almond Crunch              | Häagen-Dazs | Coffee and almond             |
| 282 | Chocolate Fudge                   | Häagen-Dazs | Chocolate fudge               |
| 283 | Pralines and Cream                | Häagen-Dazs | Praline and cream             |
| 284 | Banana Peanut Butter              | Häagen-Dazs | Banana and peanut butter      |
| 285 | Chocolate Hazelnut                | Häagen-Dazs | Chocolate and hazelnut        |
| 286 | Vanilla Bean                      | Häagen-Dazs | Vanilla bean                  |
| 287 | Mango Sorbet                      | Häagen-Dazs | Mango sorbet                  |
| 288 | Raspberry Sorbet                  | Häagen-Dazs | Raspberry sorbet              |
| 289 | Lemon Sorbet                      | Häagen-Dazs | Lemon sorbet                  |
| 290 | Blood Orange Sorbet               | Häagen-Dazs | Orange sorbet                 |
| 291 | Belgian Chocolate Sorbet          | Häagen-Dazs | Chocolate sorbet              |
| 292 | Chocolate Choc Almond             | Häagen-Dazs | Chocolate and almond          |
| 293 | Caramel Biscuit and Cream         | Häagen-Dazs | Caramel biscuit               |
| 294 | Brownie Macchiato                 | Häagen-Dazs | Coffee and brownie            |
| 295 | Vanilla Caramel Brownie           | Häagen-Dazs | Vanilla and brownie           |
| 296 | Chocolate Salted Caramel          | Häagen-Dazs | Chocolate and salted caramel  |
| 297 | Cookies and Cream Cone            | Häagen-Dazs | Cookie cone                   |
| 298 | Vanilla Chocolate Chip            | Häagen-Dazs | Vanilla and chocolate chip    |
| 299 | Chocolate Belgian Waffle          | Häagen-Dazs | Chocolate waffle              |
| 300 | Strawberry Vanilla                | Häagen-Dazs | Strawberry and vanilla        |

## 7. Ben & Jerry's (301–350)

| No. | Product name                           | Brand         | Type / flavour                   |
| --- | -------------------------------------- | ------------- | -------------------------------- |
| 301 | Cherry Garcia                          | Ben & Jerry's | Cherry and chocolate             |
| 302 | Chocolate Chip Cookie Dough            | Ben & Jerry's | Cookie dough                     |
| 303 | Half Baked                             | Ben & Jerry's | Brownie and cookie dough         |
| 304 | Phish Food                             | Ben & Jerry's | Chocolate and marshmallow        |
| 305 | The Tonight Dough                      | Ben & Jerry's | Chocolate and cookie dough       |
| 306 | Americone Dream                        | Ben & Jerry's | Vanilla, caramel and waffle cone |
| 307 | Chocolate Fudge Brownie                | Ben & Jerry's | Chocolate brownie                |
| 308 | Peanut Butter Cup                      | Ben & Jerry's | Peanut butter                    |
| 309 | Mint Chocolate Cookie                  | Ben & Jerry's | Mint and chocolate cookie        |
| 310 | Strawberry Cheesecake                  | Ben & Jerry's | Strawberry cheesecake            |
| 311 | Netflix & Chilll'd                     | Ben & Jerry's | Peanut butter and pretzel        |
| 312 | Karamel Sutra Core                     | Ben & Jerry's | Chocolate and caramel            |
| 313 | Salted Caramel Core                    | Ben & Jerry's | Salted caramel                   |
| 314 | Peanut Butter World                    | Ben & Jerry's | Peanut butter and chocolate      |
| 315 | Chocolate Therapy                      | Ben & Jerry's | Chocolate                        |
| 316 | Coffee Toffee Bar Crunch               | Ben & Jerry's | Coffee and toffee                |
| 317 | Caramel Chocolate Cheesecake           | Ben & Jerry's | Cheesecake and caramel           |
| 318 | Boom Chocolatta                        | Ben & Jerry's | Chocolate cookie and mocha       |
| 319 | Cinnamon Buns                          | Ben & Jerry's | Cinnamon and caramel             |
| 320 | Milk & Cookies                         | Ben & Jerry's | Cookies and cream                |
| 321 | Everything But The...                  | Ben & Jerry's | Chocolate and mixed inclusions   |
| 322 | Brownie Batter Core                    | Ben & Jerry's | Brownie batter                   |
| 323 | Topped Chocolate Caramel Cookie Dough  | Ben & Jerry's | Chocolate and caramel            |
| 324 | Topped Salted Caramel Brownie          | Ben & Jerry's | Salted caramel brownie           |
| 325 | Caramel Chocolate Cheesecake Non-Dairy | Ben & Jerry's | Dairy-free cheesecake            |
| 326 | Chocolate Chip Cookie Dough Non-Dairy  | Ben & Jerry's | Dairy-free cookie dough          |
| 327 | Cherry Garcia Non-Dairy                | Ben & Jerry's | Dairy-free cherry chocolate      |
| 328 | Americone Dream Non-Dairy              | Ben & Jerry's | Dairy-free caramel cone          |
| 329 | Chocolate Caramel Brownie Non-Dairy    | Ben & Jerry's | Dairy-free chocolate brownie     |
| 330 | Peanut Butter & Cookies                | Ben & Jerry's | Peanut butter and cookies        |
| 331 | Vanilla                                | Ben & Jerry's | Vanilla                          |
| 332 | Chocolate                              | Ben & Jerry's | Chocolate                        |
| 333 | Strawberry                             | Ben & Jerry's | Strawberry                       |
| 334 | Butter Pecan                           | Ben & Jerry's | Butter pecan                     |
| 335 | Caramel Chocolate Chunk                | Ben & Jerry's | Caramel and chocolate            |
| 336 | Chunky Monkey                          | Ben & Jerry's | Banana and chocolate             |
| 337 | Gimme S'more                           | Ben & Jerry's | Marshmallow and chocolate        |
| 338 | Marshmallow Sky                        | Ben & Jerry's | Marshmallow                      |
| 339 | Honey Graham Latte                     | Ben & Jerry's | Coffee and graham                |
| 340 | Razz Up!                               | Ben & Jerry's | Raspberry                        |
| 341 | Berry Berry Extraordinary              | Ben & Jerry's | Mixed berry sorbet               |
| 342 | Chocolate & Fudge Swirl                | Ben & Jerry's | Chocolate and fudge              |
| 343 | Coffee & Fudge Chip                    | Ben & Jerry's | Coffee and fudge                 |
| 344 | Strawberries & Cream                   | Ben & Jerry's | Strawberry and cream             |
| 345 | Vanilla & Fudge Brownie                | Ben & Jerry's | Vanilla and brownie              |
| 346 | Caramel Blondie                        | Ben & Jerry's | Caramel and blondie              |
| 347 | Chocolate Fudge Brownie Bar            | Ben & Jerry's | Chocolate brownie bar            |
| 348 | Cookie Dough Bar                       | Ben & Jerry's | Cookie dough bar                 |
| 349 | PB Pretzel Bar                         | Ben & Jerry's | Peanut butter and pretzel        |
| 350 | Strawberry Cheesecake Bar              | Ben & Jerry's | Strawberry cheesecake bar        |

## 8. Tillamook (351–400)

| No. | Product name                   | Brand     | Type / flavour                    |
| --- | ------------------------------ | --------- | --------------------------------- |
| 351 | Vanilla Bean                   | Tillamook | Vanilla bean                      |
| 352 | Old-Fashioned Vanilla          | Tillamook | Traditional vanilla               |
| 353 | Chocolate                      | Tillamook | Chocolate                         |
| 354 | French Vanilla                 | Tillamook | French vanilla                    |
| 355 | Oregon Strawberry              | Tillamook | Strawberry                        |
| 356 | Oregon Dark Cherry             | Tillamook | Dark cherry                       |
| 357 | Cookies & Cream                | Tillamook | Cookie and cream                  |
| 358 | Mint Chocolate Chip            | Tillamook | Mint and chocolate                |
| 359 | Rocky Road                     | Tillamook | Chocolate and marshmallow         |
| 360 | Butter Pecan                   | Tillamook | Butter pecan                      |
| 361 | Coffee Almond Fudge            | Tillamook | Coffee and almond                 |
| 362 | Chocolate Peanut Butter        | Tillamook | Chocolate and peanut butter       |
| 363 | Chocolate Chip                 | Tillamook | Chocolate chip                    |
| 364 | Chocolate Chip Cookie Dough    | Tillamook | Cookie dough                      |
| 365 | Neapolitan                     | Tillamook | Vanilla, chocolate and strawberry |
| 366 | Peaches & Cream                | Tillamook | Peach and cream                   |
| 367 | Caramel Swirl                  | Tillamook | Caramel                           |
| 368 | Marionberry Pie                | Tillamook | Marionberry pie                   |
| 369 | Udderly Chocolate              | Tillamook | Chocolate                         |
| 370 | Malted Moo Shake               | Tillamook | Malted milk                       |
| 371 | Tillamook Mudslide             | Tillamook | Chocolate and fudge               |
| 372 | White Chocolate Raspberry      | Tillamook | White chocolate and raspberry     |
| 373 | Waffle Cone Swirl              | Tillamook | Waffle cone                       |
| 374 | Campfire Peanut Butter Cup     | Tillamook | Peanut butter and marshmallow     |
| 375 | Orange and Cream               | Tillamook | Orange and vanilla                |
| 376 | Espresso Chip                  | Tillamook | Espresso and chocolate            |
| 377 | Sugar Cookie                   | Tillamook | Sugar cookie                      |
| 378 | Chocolate Hazelnut             | Tillamook | Chocolate and hazelnut            |
| 379 | Dark Chocolate Cookies & Cream | Tillamook | Dark chocolate cookie             |
| 380 | Brownie Batter                 | Tillamook | Chocolate brownie batter          |
| 381 | German Chocolate Cake          | Tillamook | German chocolate cake             |
| 382 | Sea Salt Honeycomb Toffee      | Tillamook | Honeycomb toffee                  |
| 383 | Salty Caramel Pretzel          | Tillamook | Salted caramel and pretzel        |
| 384 | Strawberries & Cream           | Tillamook | Strawberry cream                  |
| 385 | Cookies & Cream Bar            | Tillamook | Cookie-coated bar                 |
| 386 | Mint Chocolate Chip Bar        | Tillamook | Mint chocolate bar                |
| 387 | Vanilla Bean Bar               | Tillamook | Vanilla bar                       |
| 388 | Mudslide Bar                   | Tillamook | Chocolate mudslide bar            |
| 389 | Banana Cream                   | Tillamook | Banana                            |
| 390 | Cherry Vanilla                 | Tillamook | Cherry and vanilla                |
| 391 | Chocolate Marshmallow          | Tillamook | Chocolate and marshmallow         |
| 392 | Caramel Chocolate              | Tillamook | Caramel and chocolate             |
| 393 | Peanut Butter Cup              | Tillamook | Peanut butter                     |
| 394 | Strawberry Cheesecake          | Tillamook | Strawberry cheesecake             |
| 395 | Chocolate Cheesecake           | Tillamook | Chocolate cheesecake              |
| 396 | Black Raspberry                | Tillamook | Black raspberry                   |
| 397 | Lemon Cream                    | Tillamook | Lemon cream                       |
| 398 | Honey Vanilla                  | Tillamook | Honey and vanilla                 |
| 399 | Mountain Huckleberry           | Tillamook | Huckleberry                       |
| 400 | Peppermint Bark                | Tillamook | Peppermint and chocolate          |

## 9. Blue Bell (401–450)

| No. | Product name                    | Brand     | Type / flavour              |
| --- | ------------------------------- | --------- | --------------------------- |
| 401 | Homemade Vanilla                | Blue Bell | Vanilla                     |
| 402 | Cookies 'n Cream                | Blue Bell | Cookies and cream           |
| 403 | Dutch Chocolate                 | Blue Bell | Dutch chocolate             |
| 404 | The Great Divide                | Blue Bell | Vanilla and chocolate       |
| 405 | Moo-llennium Crunch             | Blue Bell | Chocolate and nuts          |
| 406 | Cookie Two Step                 | Blue Bell | Cookie dough and cookies    |
| 407 | Mint Chocolate Chip             | Blue Bell | Mint chocolate              |
| 408 | Pecan Pralines 'n Cream         | Blue Bell | Pecan and praline           |
| 409 | Chocolate Chip Cookie Dough     | Blue Bell | Cookie dough                |
| 410 | Strawberries & Homemade Vanilla | Blue Bell | Strawberry and vanilla      |
| 411 | Rocky Road                      | Blue Bell | Chocolate and marshmallow   |
| 412 | Ultimate Neapolitan             | Blue Bell | Neapolitan                  |
| 413 | Natural Vanilla Bean            | Blue Bell | Vanilla bean                |
| 414 | Strawberry                      | Blue Bell | Strawberry                  |
| 415 | Pistachio Almond                | Blue Bell | Pistachio and almond        |
| 416 | Buttered Pecan                  | Blue Bell | Butter pecan                |
| 417 | Chocolate Chip                  | Blue Bell | Chocolate chip              |
| 418 | Banana Pudding                  | Blue Bell | Banana pudding              |
| 419 | Milk Chocolate                  | Blue Bell | Milk chocolate              |
| 420 | Cherry Vanilla                  | Blue Bell | Cherry and vanilla          |
| 421 | Coffee                          | Blue Bell | Coffee                      |
| 422 | Gooey Butter Cake               | Blue Bell | Butter cake                 |
| 423 | Cotton Candy                    | Blue Bell | Cotton candy                |
| 424 | White Chocolate Mocha           | Blue Bell | White chocolate and coffee  |
| 425 | Peppermint                      | Blue Bell | Peppermint                  |
| 426 | Peppermint Bark                 | Blue Bell | Peppermint and chocolate    |
| 427 | Christmas Cookies               | Blue Bell | Christmas cookie            |
| 428 | French Vanilla                  | Blue Bell | French vanilla              |
| 429 | Classic Pecan Pie               | Blue Bell | Pecan pie                   |
| 430 | Chocolate Lava Cake             | Blue Bell | Chocolate lava cake         |
| 431 | Brookie À La Mode               | Blue Bell | Brownie and cookie          |
| 432 | Black Raspberry Fudge           | Blue Bell | Raspberry and fudge         |
| 433 | Honey Vanilla                   | Blue Bell | Honey and vanilla           |
| 434 | Strawberry Cheesecake           | Blue Bell | Strawberry cheesecake       |
| 435 | Homemade in the Shade           | Blue Bell | Chocolate and vanilla       |
| 436 | Southern Blackberry Cobbler     | Blue Bell | Blackberry cobbler          |
| 437 | Orange Swirl                    | Blue Bell | Orange                      |
| 438 | Peaches & Homemade Vanilla      | Blue Bell | Peach and vanilla           |
| 439 | Banana Fudge                    | Blue Bell | Banana and fudge            |
| 440 | Oatmeal Cream Pie               | Blue Bell | Oatmeal cookie              |
| 441 | Black Walnut                    | Blue Bell | Black walnut                |
| 442 | Lemon                           | Blue Bell | Lemon                       |
| 443 | Rum Raisin                      | Blue Bell | Rum and raisins             |
| 444 | Banana Nut                      | Blue Bell | Banana and nuts             |
| 445 | Rainbow Sherbet                 | Blue Bell | Mixed fruit sherbet         |
| 446 | Lime Sherbet                    | Blue Bell | Lime sherbet                |
| 447 | Orange Sherbet                  | Blue Bell | Orange sherbet              |
| 448 | Pineapple Sherbet               | Blue Bell | Pineapple sherbet           |
| 449 | No Sugar Added Country Vanilla  | Blue Bell | Sugar-free vanilla          |
| 450 | PRO Salted Caramel              | Blue Bell | High-protein salted caramel |

## 10. Talenti Gelato & Sorbetto (451–475)

| No. | Product name                       | Brand   | Type / flavour              |
| --- | ---------------------------------- | ------- | --------------------------- |
| 451 | Sea Salt Caramel Gelato            | Talenti | Salted caramel              |
| 452 | Belgian Chocolate Gelato           | Talenti | Belgian chocolate           |
| 453 | Caribbean Coconut Gelato           | Talenti | Coconut                     |
| 454 | Caramel Cookie Crunch Gelato       | Talenti | Caramel cookie              |
| 455 | Double Dark Chocolate Gelato       | Talenti | Dark chocolate              |
| 456 | Cold Brew Coffee Sorbetto          | Talenti | Coffee sorbetto             |
| 457 | Alphonso Mango Sorbetto            | Talenti | Mango                       |
| 458 | Roman Raspberry Sorbetto           | Talenti | Raspberry                   |
| 459 | Mediterranean Mint Gelato          | Talenti | Mint                        |
| 460 | Vanilla Bean Gelato                | Talenti | Vanilla bean                |
| 461 | Chocolate Peanut Butter Cup Gelato | Talenti | Peanut butter and chocolate |
| 462 | Coffee Chocolate Chip Gelato       | Talenti | Coffee and chocolate        |
| 463 | Pistachio Gelato                   | Talenti | Pistachio                   |
| 464 | Strawberry Hibiscus Sorbetto       | Talenti | Strawberry and hibiscus     |
| 465 | Roman Raspberry Cheesecake Gelato  | Talenti | Raspberry cheesecake        |
| 466 | Salted Caramel Truffle Gelato      | Talenti | Caramel and chocolate       |
| 467 | Chocolate Cherry Cheesecake Gelato | Talenti | Chocolate and cherry        |
| 468 | Peanut Butter Fudge Sorbetto       | Talenti | Peanut butter and fudge     |
| 469 | Chocolate Fudge Swirl Gelato       | Talenti | Chocolate fudge             |
| 470 | Mango Coconut Gelato               | Talenti | Mango and coconut           |
| 471 | Raspberry Cheesecake Gelato        | Talenti | Raspberry cheesecake        |
| 472 | Chocolate Hazelnut Gelato          | Talenti | Chocolate and hazelnut      |
| 473 | Lemon Sorbetto                     | Talenti | Lemon                       |
| 474 | Strawberry Sorbetto                | Talenti | Strawberry                  |
| 475 | Raspberry Sorbetto                 | Talenti | Raspberry                   |

## 11. Jeni's Splendid Ice Creams (476–500)

| No. | Product name                               | Brand  | Type / flavour              |
| --- | ------------------------------------------ | ------ | --------------------------- |
| 476 | Brambleberry Crisp                         | Jeni's | Berry and oat streusel      |
| 477 | Brown Butter Almond Brittle                | Jeni's | Brown butter and almond     |
| 478 | Darkest Chocolate                          | Jeni's | Dark chocolate              |
| 479 | Salted Peanut Butter with Chocolate Flecks | Jeni's | Peanut butter and chocolate |
| 480 | Wildberry Lavender                         | Jeni's | Wild berry and lavender     |
| 481 | House Coffee                               | Jeni's | Coffee                      |
| 482 | Peppermint Patty                           | Jeni's | Peppermint and chocolate    |
| 483 | Sweet Cream                                | Jeni's | Sweet cream                 |
| 484 | Banana Cream Pudding                       | Jeni's | Banana pudding              |
| 485 | Basque Cheesecake with Brambleberry Jam    | Jeni's | Cheesecake and berry        |
| 486 | Biscuits with the Boss                     | Jeni's | Biscuit and cream           |
| 487 | Blackout Chocolate Cake                    | Jeni's | Chocolate cake              |
| 488 | Black Tie Tiramisu                         | Jeni's | Tiramisu                    |
| 489 | Boston Cream Pie                           | Jeni's | Boston cream pie            |
| 490 | Buttercream Birthday Cake                  | Jeni's | Birthday cake               |
| 491 | Campfire S'mores                           | Jeni's | Chocolate and marshmallow   |
| 492 | Cherry Vanilla Sundae                      | Jeni's | Cherry and vanilla          |
| 493 | Cold Brew with Coconut Cream               | Jeni's | Coffee and coconut          |
| 494 | Confetti Brownie                           | Jeni's | Brownie and sprinkles       |
| 495 | Cookies in Cream                           | Jeni's | Cookies and cream           |
| 496 | Cranberry Panettone                        | Jeni's | Cranberry bread             |
| 497 | Dark Chocolate Truffle                     | Jeni's | Dark chocolate truffle      |
| 498 | Burnt Orange Dreamsicle                    | Jeni's | Orange and cream            |
| 499 | Caramel Pecan Sticky Buns                  | Jeni's | Caramel and pecan           |
| 500 | Brown Butter Toffee                        | Jeni's | Brown butter and toffee     |
"""

sections = [
    (1, 50, "Amul Ice Creams"),
    (51, 100, "Mother Dairy Ice Creams"),
    (101, 150, "Havmor Ice Creams"),
    (151, 200, "Kwality Wall's & Magnum"),
    (201, 250, "Baskin-Robbins"),
    (251, 300, "Häagen-Dazs"),
    (301, 350, "Ben & Jerry's"),
    (351, 400, "Tillamook"),
    (401, 450, "Blue Bell"),
    (451, 475, "Talenti Gelato & Sorbetto"),
    (476, 500, "Jeni's Splendid Ice Creams"),
]

def get_section(num):
    for start, end, name in sections:
        if start <= num <= end:
            return name
    return "Other Ice Creams"

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

print(f"Parsed {len(items)} ice cream items.")
with open("scripts/data/parsed_ice_cream_500.json", "w") as f:
    json.dump(items, f, indent=2)
