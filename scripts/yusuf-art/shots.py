"""
The shot list for the Yusuf game's pictures: one entry per picture.

  key: (alt text, scene description)

The alt text goes into games/yusuf/art.js. The scene description is expanded
into the full prompt by build.py: STYLE + scene (with the {WHO} placeholders
filled in) + END. People are described by clothes and age, never by name, so
that the generator draws our characters and not its own idea of the story.
"""

STYLE = ("Polished stylised 3D animated family-film still, warm cinematic lighting, rich detail, square picture, "
         "main figures in the middle. Everyone is Black African with deep dark brown skin and modest long clothing. ")
PORTRAIT = ("Head-and-shoulders portrait, front view, friendly, polished stylised 3D animated family-film look, soft studio "
            "lighting, plain warm cream background, deep dark brown skin. ")
BACKDROP = ("Polished stylised 3D animated family-film background painting, warm cinematic lighting, rich detail, square, "
            "filling the whole frame edge to edge with no border. A place, with no main characters and nobody in the foreground. ")
END = " No text, no writing, no letters, no logos, no watermark."

WHO = {
    "YB": "a kind 9-year-old boy with short black hair, in a teal tunic with cream trim",
    "YY": "a kind young man of 18 with short black hair and no beard, in a long teal tunic with cream trim",
    "YM": "a dignified kind man in his 30s with a short black beard, a white turban with a gold band and a long deep-blue robe with gold trim",
    "YQ": "an elderly father in his 70s with a white beard, a white embroidered cap and a cream-and-grey striped wide-sleeved robe",
    "BR": "a group of older brothers, grown men in rust, ochre, olive and brown robes and turbans",
    "BN": "a teenage boy in an orange-brown tunic",
    "TR": "a water-carrier man in an orange turban and cream robe",
    "MA": "a nobleman in a blue turban with a gold band and a cream robe with gold trim",
    "KG": "a king with a gold crown, a short beard and a purple robe with gold trim",
    "HE": "a wise older man in a green turban and cream robe",
    "HOME": "a family compound of sun-baked mud-brick houses and a woven tent among acacia trees in dry grassland",
    "EGY": "an ancient Nile-valley city of mud-brick and sandstone buildings with painted columns and date palms",
    "CELL": "a dim stone prison cell with a small barred window casting a beam of light",
    "HALL": "a grand throne hall with painted columns and hanging lamps",
}

SHOTS = {
    # ---- chapter 1
    "c1-a": ("Yusuf asleep; through the window, eleven stars, the sun and the moon.",
             "Night. Alone in a simple mud-brick room, {YB} sleeps peacefully on a woven mat under a blanket; nobody else is in the room. Through a wide window a deep-blue sky glows with eleven bright stars, a golden sun and a crescent moon together. A clay oil lamp glows; outside, goats rest by a tent."),
    "c1-b": ("Yusuf tells his father Yaqub about the dream.",
             "Dusk in {HOME}. {YB} talks excitedly to {YQ}, who sits on a mat and gently raises one hand in caution. Behind them women carry water jars, goats stand in a pen, a cooking fire smokes, children play."),
    # ---- chapter 2
    "c2-a": ("The brothers whisper together while Yusuf plays.",
             "Dry grassland pasture with sheep and goats. In front, {BR} huddle whispering with jealous frowns, glancing at {YB}, who plays happily with a lamb further away. Shepherds and flocks in the distance."),
    "c2-b": ("The brothers stand around a stone well.",
             "Late afternoon in dry grassland, long shadows, sombre mood. {BR} stand around an old round stone well looking down into it; one holds a rope. Far behind them flocks graze and a shepherd walks."),
    "c2-w": ("Yusuf stands on a stone in the well, looking up at the light.",
             "Inside a deep old stone well seen from the side: {YB} stands on a big stone above dark water, looking up calmly at a warm beam of golden light shining down from the round opening far above. Wet stone walls, small ferns. Peaceful, hopeful mood."),
    "c2-c": ("The brothers show their father the stained shirt.",
             "Night by firelight in {HOME}. {BR} stand before {YQ} pretending to weep; one holds out a child's teal shirt with dark red stains, the shirt whole and not torn. The father looks at it with doubt and sorrow. Family members watch from doorways."),
    "c2-s": ("The stained shirt, held up: it is not torn anywhere.",
             "Close view by firelight: two hands hold up a child's teal shirt with cream trim. It has dark red stains but is completely whole, with no rips or tears. Behind, out of focus, a mud-brick home and a fire at night."),
    "c2-d": ("Yaqub prays, patient, under the night sky.",
             "Night in {HOME}. {YQ} sits alone on a mat outside the tent with hands raised in prayer, face calm and patient, looking up at a starry sky with a crescent moon. A lamp glows; the camp sleeps behind him, goats resting."),
    # ---- chapter 3
    "c3-a": ("A caravan rests by the well; a man lowers his bucket.",
             "Bright day in dry grassland. A trade caravan of camels and donkeys loaded with goods rests beside an old round stone well; travellers unload, drink and tend animals. {TR} lowers a wooden bucket on a rope into the well. No wagons or carts."),
    "c3-b": ("The man lifts his arms in joy: a boy has come up with the bucket.",
             "Bright day beside an old round stone well. {TR} lifts his arms in joyful surprise. {YB} sits on the edge of the well beside a wooden bucket on a rope, safe and smiling shyly. Caravan travellers gather round amazed; loaded camels and donkeys rest behind."),
    # ---- chapter 4
    "c4-a": ("Yusuf rides with the caravan across the desert.",
             "A long camel caravan crosses golden desert dunes under a hot sun. {YB} rides on a camel among bundles of goods, looking back sadly toward home. Merchants in robes and turbans walk alongside; distant palms and rocky hills."),
    "c4-b": ("In a busy market in Egypt, a nobleman takes Yusuf home.",
             "A busy market in {EGY}. {MA} rests a kind hand on the shoulder of {YB}, who looks down sadly. Beside him his wife, in a plum scarf and robe, looks at the boy warmly. Around them traders sell grain, cloth and pots; donkeys, baskets, shoppers."),
    "c4-c": ("Yusuf, grown into a young man, in the courtyard of the house.",
             "The courtyard of a fine house in {EGY}. {YY} stands holding a rolled scroll, thoughtful and bright-eyed. Around him servants carry jars, a gardener waters palms, a scribe sits working, doves on the wall. Warm morning light."),
    # ---- chapter 5
    "c5-a": ("Yusuf runs for the door.",
             "Inside a fine house with painted columns and swaying curtains. {YY} runs toward a big wooden door with one hand reaching for it, face worried and determined. No one else in the room. Sunlight through the doorway."),
    "c5-b1": ("At the door, the master of the house; Yusuf's shirt is torn at the back.",
              "At the open doorway of a fine house with painted columns: {YY}, seen from behind with a long tear down the back of his teal tunic, stops before {MA}, who has just arrived and looks surprised. A woman in a plum scarf stands further back in shadow, pointing. Servants peer in."),
    "c5-b2": ("A wise man of the house says: look at the shirt.",
              "In a hall with painted columns {HE} raises one finger, giving advice to {MA}, who listens. {YY} waits patiently beside them, facing us. Servants watch from a doorway."),
    "c5-b3": ("They look: the shirt is torn at the back.",
              "In a hall with painted columns {YY} has turned so that we see the back of his teal tunic ripped open in a long split, showing a cream under-shirt beneath. {MA} and {HE} look at the tear and nod with understanding. Servants watch, relieved."),
    "c5-b4": ("Yusuf prays on a balcony above the city.",
              "Dusk. {YY} stands alone on a balcony with hands raised in prayer, eyes closed, calm. Below him lies {EGY}: people in the streets, market stalls closing, boats on the river, lamps being lit."),
    "c5-c": ("Yusuf sits calmly in a prison cell.",
             "In {CELL}, {YY} sits calmly on a straw mat. Beyond the open bars two guards with spears stand in a torch-lit corridor. A clay water jar beside him."),
    "c5-d": ("Yusuf, patient, beside a glowing lamp.",
             "Night in {CELL}. {YY} sits peacefully with hands raised in prayer beside a glowing clay oil lamp that lights his face warmly. Through the barred window, stars."),
    # ---- chapter 6
    "c6-a": ("Two prisoners tell Yusuf their dreams.",
             "In {CELL}, {YY} sits with two other young men in plain grey-brown tunics, who lean toward him anxiously, telling him something. He listens kindly."),
    "c6-b": ("Yusuf speaks; the two prisoners listen.",
             "In {CELL}, {YY} speaks warmly with one finger raised toward the sky, standing in the beam of sunlight. Two young men in plain grey-brown tunics sit listening with calm attention."),
    "c6-c": ("One prisoner goes free; Yusuf stays behind.",
             "A stone prison. One young man in a grey-brown tunic walks out through the open cell door into bright daylight, waving goodbye happily. {YY} remains seated inside, patient, watching him go. A guard holds the door."),
    # ---- chapter 7
    "c7-a": ("The king dreams of seven fat cows and seven thin ones.",
             "Night. {KG} sleeps in a grand bed in a palace room. Above him a glowing dream cloud shows seven fat brown cows and seven thin bony cows beside a river, with seven green ears of wheat and seven dry withered ears of wheat."),
    "c7-b": ("Nobody can explain the dream; a servant remembers Yusuf.",
             "In {HALL}, {KG} sits on the throne looking worried while puzzled advisors in robes shrug and whisper. A servant in a grey-brown tunic steps forward with one hand raised, having just remembered something. Courtiers watch."),
    "c7-c": ("Rain falls on green fields.",
             "Rain falls on lush green fields of grain beside a wide river. Farmers in the fields lift their hands happily; oxen, date palms, grey rain clouds with sun breaking through, birds."),
    # ---- chapter 8
    "c8-a1": ("The king's messenger calls; Yusuf waits in his cell.",
              "At the open door of a stone prison cell a royal messenger in fine robes gestures for {YY} to come out. He stands calmly inside with one hand raised, politely declining for now. Two guards watch, surprised."),
    "c8-a2": ("The king questions the women; one tells the truth.",
              "In {HALL}, {KG} questions a group of women in modest scarves and robes of plum, teal and ochre. One woman in plum has stepped forward with her head bowed, speaking honestly. Courtiers watch."),
    "c8-b": ("The king puts Yusuf in charge of the storehouses.",
            "In {HALL}, {KG} hands a large bronze key to {YM}, who accepts it respectfully with both hands. Courtiers and scribes look on, pleased."),
    "c8-c": ("The storehouses are full of grain.",
            "Rows of big round mud-brick granaries brimming with golden grain under a blue sky. Workers carry baskets and sacks up ramps, donkeys pull carts. {YM} oversees happily. Date palms, the river beyond."),
    # ---- chapter 9
    "c9-a": ("The brothers travel to Egypt.",
            "{BR} walk with donkeys carrying empty sacks across dry land toward a distant city of mud-brick walls and date palms beside a wide river. Other travellers and herders on the road."),
    "c9-b": ("The brothers stand before Yusuf and do not know him.",
            "In a busy grain hall {YM} sits on a raised seat. {BR} stand before him with heads respectfully lowered, not recognising him; he looks at them with gentle, knowing eyes. Around them workers measure and carry grain."),
    "c9-c": ("Their payment is slipped back into their sacks.",
            "A grain yard. Servants quietly tuck small leather money pouches into full grain sacks loaded on donkeys while {YM} watches approvingly. In the distance the brothers prepare to leave. Workers, scales, heaps of grain."),
    # ---- chapter 10
    "c10-g": ("Yaqub tells his sons: go in by different gates.",
              "Early morning in {HOME}. {YQ} speaks earnestly to {BR}, pointing in several different directions with his open hand. With them stands {BN}. Loaded donkeys wait, ready to leave."),
    "c10-a": ("Yusuf takes his younger brother aside.",
              "A quiet courtyard with date palms. {YM} gently holds the shoulders of {BN}, who looks up at him in happy surprise. In the background servants pass with trays and jars."),
    "c10-b": ("The king's golden cup is placed in a sack.",
              "Night in a grain yard lit by lamps. A servant slips a shining golden cup into a grain sack loaded on a donkey. {YM} stands nearby watching calmly. Other loaded donkeys, sleeping travellers."),
    "c10-c": ("The cup is found in the youngest brother's sack.",
              "A grain yard in daylight. A guard lifts a shining golden cup out of an open grain sack beside {BN}, who has deep dark brown skin and short black hair and looks surprised. {BR} gasp with hands on heads. {YM} stands calm."),
    # ---- chapter 11
    "c11-a": ("Yaqub weeps; his eyes have turned white.",
              "A grey overcast day, muted colours, in {HOME}. {YQ} sits alone outside the tent weeping quietly, his eyes pale and clouded. The compound is quiet; a few goats, a woman grinding grain far off."),
    "c11-b": ("Yaqub sends his sons: do not lose hope.",
              "In {HOME}, {YQ}, his eyes pale and clouded, sits upright and points toward the horizon, speaking with firm hope to {BR}, who stand before him with donkeys ready to travel."),
    "c11-c": ("“I am Yusuf.” The brothers stare.",
              "In a grain hall {YM} stands with open arms and a warm smile. {BR} stare at him in shock, hands to their mouths. Beside him {BN} smiles. Workers stop to look."),
    "c11-e": ("The brothers hang their heads.",
              "In a grain hall {BR} hang their heads in shame before {YM}, who looks at them with compassion. Soft light from high windows."),
    "c11-d": ("Yusuf embraces his brothers.",
              "In a grain hall {YM} embraces his brothers warmly: {BR}, all smiling with tears of joy. {BN} joins the embrace. Onlookers smile."),
    # ---- chapter 12
    "c12-a": ("Yusuf hands over his shirt to be carried home.",
              "A courtyard. {YM} hands a folded cream shirt to one of {BR}, who receives it carefully with both hands. Camels wait loaded behind them."),
    "c12-b": ("Far away, Yaqub lifts his face into the wind.",
              "Windy dusk in {HOME}. {YQ}, his eyes pale and clouded, stands lifting his face into the breeze, smiling in wonder, one hand raised. Family members look at him, puzzled. Grass and tent cloth blow in the wind."),
    "c12-c": ("Yaqub can see again.",
              "Golden sunrise in {HOME}. {YQ} holds a cream shirt just lowered from his face; his eyes are now clear and bright and he smiles with joy. {BR} kneel around him, moved. Family members rejoice behind."),
    # ---- chapter 13
    "c13-a": ("Yusuf welcomes his parents to Egypt.",
              "At the great gate of {EGY}, {YM} embraces {YQ}; beside them an elderly mother in a cream scarf smiles. The big family arrives with camels and donkeys; townspeople welcome them."),
    "c13-b": ("The family bow before Yusuf.",
              "In {HALL}, an elderly father in a white cap and striped robe, an elderly mother in a cream scarf and {BR} bow low in respect before {YM}, who stands beside a throne with hands raised humbly."),
    "c13-b0": ("The dream: eleven stars, the sun and the moon above the city.",
               "A dream-like night sky with eleven bright stars, a golden sun and a crescent moon glowing together above {EGY} and its wide river. On a rooftop a family stands together looking up."),
    "c13-c": ("Yusuf prays under the night sky.",
              "Night. {YM} stands alone on a rooftop with hands raised in prayer, calm and grateful. Below, the lamps of a mud-brick city and a wide river; above, a crescent moon and stars."),
    # ---- backdrops for activities (no main figures; small, far-off life only)
    "bg-night": ("A deep blue night sky over the sleeping camp.",
                 "A deep blue night sky, soft and mostly empty, with a few faint stars. Along the bottom edge only, the dark outline of tents, acacia trees and resting goats."),
    "bg-well": ("Inside the old stone well.",
                "Inside a deep old stone well: curved wet stone-block walls, darkness below, a round opening of bright sky at the very top."),
    "bg-desert": ("A sandy path across the desert.",
                  "A wide empty desert landscape: golden dunes, a sandy path running across the lower middle from left to right, distant acacia trees and rocky hills, a tiny far-off camel caravan, birds, blue sky."),
    "bg-market": ("A market table in Egypt.",
                  "A busy market in {EGY}, slightly out of focus and further back: traders, shoppers, stalls of grain, cloth and pots, donkeys. In front, in focus, an empty wooden table top."),
    "bg-prison": ("The stone prison cell.",
                  "{CELL}: straw mats, a clay water jar, rough stone walls, moonlight through the bars."),
    "bg-palace": ("The king's throne hall.",
                  "{HALL}, wide view, empty in the middle: an empty throne at the far end and a patterned floor. Only a few tiny courtiers far away beside the columns."),
    "bg-field": ("Fields of grain by the river.",
                 "Golden-green fields of ripening wheat beside a wide river under a blue sky. Only tiny far-off farmers with baskets and oxen pulling a cart; date palms and round mud-brick granaries in the distance."),
    "bg-egypt": ("The grain yard in Egypt.",
                 "A grain yard in {EGY}: heaps of golden grain, scales, baskets and sacks, a few donkeys. Only small far-off workers in the background. Open sandy ground in front."),
    "bg-wall": ("The city wall and its gates.",
                "The long sun-baked mud-brick wall of {EGY} seen straight on across the whole picture, with small far-off travellers and donkeys on the road. Date palms, blue sky."),
    # ---- round portraits for activities
    "p-yusuf": ("Yusuf as a boy.", "PORTRAIT:{YB}, gentle smile."),
    "p-yusufMan": ("Yusuf as a man.", "PORTRAIT:{YM}, warm smile."),
    "p-b1": ("An older brother.", "PORTRAIT:a man in his 30s with a short black beard, a rust-red turban and an ochre robe, serious face."),
    "p-b2": ("An older brother.", "PORTRAIT:a clean-shaven man in his 30s with a blue turban and a brown robe, serious face."),
    "p-b3": ("An older brother.", "PORTRAIT:a man in his 30s with short black hair, a short beard and an olive robe, no headwear, serious face."),
    "p-b4": ("An older brother.", "PORTRAIT:a man in his 30s with a short beard, an ochre-yellow turban and an olive-green robe, serious face."),
    "p-benjamin": ("The youngest brother.", "PORTRAIT:{BN} with short black hair, about 14 years old, gentle face."),
}
