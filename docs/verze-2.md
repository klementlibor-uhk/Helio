# Verze 2 — zadání úprav

Sepsáno 22. 10. 2026 po projití všech šesti obrazovek verze 1.
Pořadí v seznamu není pořadím práce; společné věci (vzhled, písmo, rozvržení)
se dělají první, protože na nich stojí všechno ostatní.

## Společné pro celý test

1. **Barevnost podle PISA** — bílá a bledě modrá, a tím to končí. Verze 1 je příliš
   bledá a nevýrazná. Zelená a červená zůstávají jen jako významové (správně, chyba).
2. **Písmo** — vybrat záměrně, ne nechat systémové. Větší velikosti, jasnější hierarchie.
3. **Zvětšit obsahovou plochu** — kolem karty je zbytečně moc prázdna, stránka působí drobně.
4. **Předěl mezi panely** — hubená linka pryč. Dva samostatné povrchy s mezerou,
   jako to má PISA, ne jedna čára uprostřed.
5. **Oddělit zadání od odpovědi** — odpověď dostane vlastní ohraničený blok s nadpisem
   „Odpověď“, aby bylo na první pohled vidět, kde se čte a kde se odpovídá.
6. **Čas řešení** — větší písmo.

## Úvodní stránka

7. **Vypustit políčko na jméno.** PISA ho nemá. Tím ubude text a stránka se zklidní.
   Důsledek: jméno zmizí i z výsledku a z tiskové stránky — tam místo něj bude
   prázdná linka „Jméno: ………“ na dopsání rukou.
   Druhý důsledek: aplikace pak neukládá vůbec nic, ani do `sessionStorage`.
8. **Prohlášení o soukromí schovat** — modrý rámeček pryč, vpravo dole jen odkaz
   „Ochrana soukromí“ s ikonou štítu, po kliknutí se text otevře v okénku.
9. **Přeformulovat řádek u tlačítka** z „4 otázky · bez časového limitu · čas se jen měří“
   na **„4 úlohy · nespěchej, čas není omezený“**.
10. **Zvětšit obrázek modulu.**

## Otázka 1 — přístup k pitné vodě

11. **Graf překreslit profesionálněji** — teď vypadá moc školně. Užší sloupec, popisky
    přímo u segmentů s vodicí linkou místo tlusté legendy, decentní osa, tlumenější
    odstíny modré. Blíž grafu ze zprávy WHO než z učebnice.

## Otázka 2 — Lucy a simulace

12. **Animace Helia podle skutečného principu.** Verze 1 jen zvedá hladinu, což je ze
    všeho nejméně podstatné. Správně: slunce → solární panel → čerpadlo → přítok mořské
    vody → odpařování (šipky od hladiny) → obláček páry → kondenzace na vnitřní klenbě →
    kapky stékají po stěně dolů → sběrný žlab na rovníku → odtok přes remineralizaci ven.
    Délka asi 3 sekundy (o 1,5 s déle než teď), aby byl každý krok vidět.
13. **Do obrázku v panelu vrátit solární panel, čerpadlo a viditelný přítok s odtokem.**
    Ve verzi 1 je tam zjednodušená kresba bez nich, protože se nevešla — vyřešit
    s rozvržením panelu.
14. **Mapu zmenšit o třetinu.** Je moc dominantní, přitom se na ní jen trefují čtyři kolečka.
15. **Popisek u škály zvětšit.** Je to nejdůležitější text na obrazovce (bez něj žák neví,
    že barva znamená kWh/m²) a teď je nejmenší.
16. **Symbol mazání řádku** — hubené mínus nahradit červeným kolečkem s křížkem.
17. **Tabulka srozumitelněji** — popisky sloupců „Označ“ a „Smazat“.
18. **Instrukci rozpadnout do tří kroků** místo jednoho souvětí se třemi úkoly:
    spusť simulaci → klikni na město → označ řádky.
19. **Doplnit větu o nástroji:** „Simulace ukazuje výrobu nejvýše za 2 hodiny.“
    Je to údaj o přístroji, ne o postupu — odstraní pochybnost „je to rozbité?“,
    ale přepočet na 8 hodin nechá na žákovi. Nápovědu k postupu **nepřidáváme**.
20. **Nápovědu doplnit** o nové symboly, aby seděla s tím, co žák vidí.

## Otázka 3 — kamiony

21. **Rozbalovací nabídka zřetelnější** — podbarvené pole, výraznější rámeček,
    viditelná šipka dolů.
22. **Odlišit nabídku od rámečku na vysvětlení.** Teď vypadají stejně, i když se s nimi
    dělá něco jiného. Rámeček dostane popisek uvnitř („Napiš své vysvětlení…“) a bude vyšší.
23. **Zrušit dvojitý text „Vyber jednu možnost“** — je zároveň popiskem nad nabídkou
    i první položkou v ní. Popisek zmizí, blok se bude jmenovat „Odpověď“.

## Otázka 4 — splátka bance

24. **Obrázek farmy překreslit o několik úrovní.** Verze 1 je kuličkovitá a nenázorná,
    protože kopíruje letecký snímek. Nově: v popředí tři až pět modulů dost velkých,
    aby byla poznat koule s hladinou, sběrný pás a nohy; za nimi řady zmenšující se
    do dálky. Po straně moře, na druhé straně potrubí k **náznaku města** (střechy,
    vodojem) a kousek sadu, ať je vidět, že farma lidem dodává vodu. Pohled z mírného
    nadhledu, ne z ptačí perspektivy. Stylizace povolená, nemusí kopírovat předlohu.

## Výsledek a tisk

25. **Stav „Nezodpovězeno“** vedle „Nesprávně“. Nevyplněná úloha se teď tváří stejně
    jako špatná odpověď, což je k žákovi nefér. U otázky 2: bez města i bez řádků =
    nezodpovězeno, město bez řádků = částečně.
26. **Do tisku doplnit názorný postup** — teď je tam jen holý fakt, jak to mělo být.
    Ke každé úloze kroky s mezivýsledky a malý obrázek:
    - úloha 1: 71 % + 17 % = 88 % → zbývá 12 % → 0,12 · 7 000 = 840 milionů;
      obrázek sloupce se svorkou u obou kategorií
    - úloha 2: 2 920 : 365 = 8 l/den → 8 : 8 = 1 l/h → záření 6 → město B;
      řetězec čísel a proužek škály se zvýrazněnou šestkou
    - úloha 3: výška 95 cm daná značkou → 300 : 95 = 3 vrstvy → 770 : 159 = 4,
      820 : 159 = 5 → 24 proti 27; **půdorys obou ložných ploch** s krabicemi 4+4 a 4+5
    - úloha 4: 29 200 hl = 2 920 000 l → · 0,08 → · 15 → · 1,045 → : 240 = 15 257 zedů
    Tisk se tím roztáhne na dvě až tři A4. Hlídat, aby se úloha netrhala přes konec stránky.
27. **Potvrzení u „Nový pokus“** — upozornit, že se ztratí odpovědi.
28. **Potvrzení u „Zpět na úvodní stránku“** — totéž; protože nic neukládáme, odchod
    odpovědi smaže stejně jako nový pokus a žák o tom neví.

## Chyba k opravě

29. **Tažení kalkulačky.** Okno má v CSS ukotvené `bottom`, při tažení se nastavuje `top`,
    ale `bottom` zůstává — okno se mezi oba okraje roztáhne a pod klávesnicí zbyde bílý
    pruh. Oprava: při prvním pohybu zrušit i `bottom`, stejně jako se už ruší `right`.

## Otevřené otázky na později

- **Písmo z repozitáře, nebo systémové?** Vlastní písmo z Google Fonts by znamenalo
  požadavek na cizí server, což se tluče s tím, že test nic neodesílá. Uložit soubory
  písma přímo do repozitáře je čistší řešení.
- **Přepínače místo rozbalovací nabídky** u otázky 3? Tři možnosti vidět najednou by byly
  jednoznačnější, ale původní formulář předepisuje rozbalovací nabídku.
- **Napovědět u otázky 2 i přepočet na hodinu?** Udělalo by to z úlohy střední obtížnosti
  lehkou. Zatím nenapovídáme.
