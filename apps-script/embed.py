"""Put the game page inside the website page (run after every change to game.html): the website then opens the game itself, without
asking Google for a second page — which is what failed for people signed in to a school account, or to none."""
import json, os, re
d = os.path.dirname(os.path.abspath(__file__))
game = open(os.path.join(d, "game.html"), encoding="utf-8").read()
site_p = os.path.join(d, "site.html"); site = open(site_p, encoding="utf-8").read()
blob = json.dumps(game).replace("<", "\\u003c")
block = '<!--FNAS_GAME_START--><script id="fnas-game-src" type="application/json">' + blob + '</script><!--FNAS_GAME_END-->'
if "<!--FNAS_GAME_START-->" in site: site = re.sub(r"<!--FNAS_GAME_START-->.*?<!--FNAS_GAME_END-->", lambda m: block, site, flags=re.S)
else: site = site.replace("</body>", block + "\n</body>", 1)
open(site_p, "w", encoding="utf-8").write(site); print("site.html now %d bytes" % len(site.encode()))
