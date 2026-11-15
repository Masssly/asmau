#!/usr/bin/env python3
# The pages and words of Tap & Say. Run from the repository root: python3 scripts/tapsay-words.py
# Writes games/tap-and-say/words.js and narration.json. Arabic is shown as text and voiced only from a real recording.
import json
PAGES = [
 ("sky", "🌙", "Night and the mosque", [
   ("moon","🌙","Moon","قَمَر","the moon"), ("star","⭐","Star","نَجْمَة","the star"), ("mosque","🕌","Mosque","مَسْجِد","the mosque"),
   ("kaaba","🕋","Kaaba","الْكَعْبَة","the Kaaba"), ("beads","📿","Prayer beads","مِسْبَحَة","the prayer beads"), ("lamp","🪔","Lamp","فَانُوس","the lamp")]),
 ("prayer", "🤲🏿", "Time to pray", [
   ("mat","🟫","Prayer mat","سَجَّادَة","the prayer mat"), ("quran","📖","Qur'an","مُصْحَف","the Qur'an"), ("water","💧","Water","مَاء","the water"),
   ("hands","🤲🏿","Hands","يَدَان","our hands"), ("clock","🕰️","Clock","سَاعَة","the clock"), ("scarf","🧕🏿","Headscarf","حِجَاب","the headscarf")]),
 ("animals", "🐪", "Animals in the Qur'an", [
   ("camel","🐪","Camel","جَمَل","the camel"), ("cow","🐄","Cow","بَقَرَة","the cow"), ("bee","🐝","Bee","نَحْلَة","the bee"),
   ("ant","🐜","Ant","نَمْلَة","the ant"), ("elephant","🐘","Elephant","فِيل","the elephant"), ("spider","🕷️","Spider","عَنْكَبُوت","the spider"),
   ("horse","🐎","Horse","حِصَان","the horse"), ("fish","🐟","Fish","سَمَكَة","the fish"), ("raven","🐦‍⬛","Raven","غُرَاب","the raven")]),
 ("food", "🍇", "Good food", [
   ("dates","🌴","Date palm","نَخْلَة","the date palm"), ("olive","🫒","Olives","زَيْتُون","the olives"), ("grapes","🍇","Grapes","عِنَب","the grapes"),
   ("honey","🍯","Honey","عَسَل","the honey"), ("milk","🥛","Milk","لَبَن","the milk"), ("bread","🍞","Bread","خُبْز","the bread")]),
 ("world", "☀️", "Allah's world", [
   ("sun","☀️","Sun","شَمْس","the sun"), ("cloud","☁️","Cloud","سَحَاب","the cloud"), ("rain","🌧️","Rain","مَطَر","the rain"),
   ("mountain","⛰️","Mountain","جَبَل","the mountain"), ("sea","🌊","Sea","بَحْر","the sea"), ("tree","🌳","Tree","شَجَرَة","the tree")]),
]
lines = [{"id":"hello","text":"Tap something!","lang":"en"}, {"id":"find-start","text":"Let's play. Find what I say!","lang":"en"},
         {"id":"yes","text":"Yes! Well done!","lang":"en"}]
for pid, pe, ptitle, items in PAGES:
    lines.append({"id":"page-"+pid,"text":ptitle,"lang":"en"})
    for k,e,en,ar,the in items:
        lines.append({"id":k+"-en","text":en,"lang":"en"})
        lines.append({"id":k+"-ar","text":ar,"lang":"ar"})
        plural = the.endswith("s") and k not in ("bus",)    # the prayer beads, our hands, the olives, the grapes
        lines.append({"id":"find-"+k,"text":("Where are " if plural else "Where is ")+the+"?","lang":"en"})
open("games/tap-and-say/narration.json","w",encoding="utf-8").write("[\n"+",\n".join("  "+json.dumps(l,ensure_ascii=False) for l in lines)+"\n]\n")
js = "window.TAPSAY_PAGES = " + json.dumps([{"id":pid,"icon":pe,"title":pt,"items":[{"k":k,"e":e,"en":en,"ar":ar} for k,e,en,ar,_ in items]} for pid,pe,pt,items in PAGES], ensure_ascii=False, indent=1) + ";\n"
open("games/tap-and-say/words.js","w",encoding="utf-8").write("/* The pages and words of Tap & Say. Written by scripts/tapsay-words.py: change that, not this; Arabic shown as text and voiced only from a real recording. */\n"+js)
print(len(lines),"lines")
