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
- `js/test.js` — navigace, časomíra, vykreslování
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

Hotovo: úvodní obrazovka a všechny čtyři otázky.
Připravuje se: závěrečná obrazovka s výsledkem, prohlížení odpovědí s vysvětlením,
tisk do portfolia, nápověda a kalkulačka.
