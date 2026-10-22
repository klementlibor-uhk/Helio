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
- `js/scoring.js` — vyhodnocení; oddělené a spustitelné i v Node
- `js/state.js` — stav odpovědí a pomocné funkce
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

Nic se neodesílá a nikam neukládá. Jméno žije jen v `sessionStorage` té jedné
záložky prohlížeče, odpovědi jen v paměti stránky. Žádné cookies, žádné sledování.

## Stav

Hotovo: úvodní obrazovka, všechny čtyři otázky, potvrzení odevzdání, výsledková
obrazovka, prohlížení odpovědí s vysvětlením a tisk do portfolia.
Test je obsahově kompletní. Zbývá pilotáž a rozhodnutí o zveřejnění přes GitHub Pages
(k tomu je potřeba repozitář přepnout na veřejný).
