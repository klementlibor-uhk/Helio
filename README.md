# Helio — Pitná voda

Elektronická matematická úloha inspirovaná šetřením PISA. Čtyři otázky kolem modulu
Helio, který ze slunce a mořské vody vyrábí pitnou vodu. Úloha je původní, podaná
Českou republikou do PISA 2021; do hlavního šetření se nedostala.

## Spuštění

Otevři `index.html` v prohlížeči. Žádný build ani server není potřeba.

## Struktura

- `index.html` — úvodní obrazovka (jméno, prohlášení o soukromí, spuštění)
- `test.html` — vlastní test
- `css/common.css` — barvy, typografie, ovládací prvky
- `css/test.css` — rozvržení testu
- `css/overlay.css` — vše, co se vznáší nad stránkou (okénka, kalkulačka, nápověda)
- `css/helio.css` — animace modulu Helio; sdílená, protože kresba je na obou stránkách
- `css/intro.css` — úvodní obrazovka
- `js/scoring.js` — vyhodnocení; oddělené a spustitelné i v Node
- `js/state.js` — stav odpovědí a pomocné funkce
- `fonts/` — písmo Inter uložené v repozitáři (žádný požadavek na cizí server)
- `docs/verze-2.md` až `docs/verze-5.md` — zadání úprav po jednotlivých kolech
- `js/helio.js` — kresba modulu Helio, sdílená úvodní stránkou i otázkou 2
- `js/questions.js` — jednotlivé otázky
- `js/simulation.js` — otázka 2: mapa Zedlandu, simulace a tabulka
- `js/test.js` — režimy, navigace, časomíra
- `js/result.js` — výsledek, prohlížení odpovědí a tisk do portfolia
- `js/calculator.js` — kalkulačka s českým zápisem (vlastní parser, žádné eval)
- `js/help.js` — nápověda pod otazníkem
- `img/` — kresby (modul, farma, krabice, kamiony, mapa)
- `docs/` — podklady a poznámky k zadání

## Rozvržení obrazovky

Podle konvence PISA: **vlevo zadání a všechny ovládací prvky odpovědi**, **vpravo
podnět** — materiál ke čtení a nástroje, ze kterých žák čerpá.

## Čísla po česku

Desetinná čárka, násobení `·`, dělení `:`, mínus `−`, mezery po tisících ve výsledku.
Vyhodnocení přijímá čárku i tečku, aby žáka netrestalo za numerickou klávesnici.

## Soukromí

Nic se neodesílá a nikam neukládá. Odpovědi žijí jen v paměti stránky a po jejím
zavření beze stopy mizí. Žádné cookies, žádné úložiště, žádné sledování. Jméno se
nikam nezadává — na stránce k vytištění je na ně prázdná linka.

## Stav

Hotovo: úvodní obrazovka, všechny čtyři otázky, potvrzení odevzdání, výsledková
obrazovka, prohlížení odpovědí s vysvětlením a tisk do portfolia.
Verze 5: písmo i kresby rostou s velikostí okna (plynulá stupnice), krabice a
kamiony u otázky 3 pod sebou přes celou šířku a zadání přesunuto doleva, mapa
u otázky 2 větší a hned za kroky, tlačítko „Přehraj animaci“ na úvodní stránce,
tři stejné paprsky od slunce, paprsky dolů k farmě, konec prázdné bílé karty
pod výsledkem.

Verze 4: karty vyplňují okno a obsah se v nich rozprostírá, obláček v kouli
opraven, popisky kolem kresby na úvodní stránce.

Dříve — verze 2: nový vzhled podle PISA (bílá a bledě modrá), vlastní písmo, panely jako dvě
karty, oddělený blok odpovědi, úvodní stránka bez jména, profesionálnější graf,
animace Helia podle skutečného principu, překreslená farma, stav „Nezodpovězeno“,
potvrzení před ztrátou odpovědí a názorné postupy v tisku.
Rolování: změřeno při 1280×720 i 1280×900 — úvodní stránka, všechny čtyři otázky
i výsledek se vejdou beze zbytku. Prohlížení odpovědí se v levém panelu roluje:
vzorové řešení je text navíc a při 720 bodech výšky se vedle zadání nevejde.

Zbývá pilotáž a rozhodnutí o zveřejnění přes GitHub Pages (repozitář je zatím privátní).
