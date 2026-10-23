# Verze 5 — zadání úprav

Sepsáno 23. 10. 2026 po čtvrtém projití všech šesti obrazovek.
Verze 4 roztáhla karty na celé okno, ale **obsah s nimi nenarostl**, takže uvnitř
vznikla prázdná bílá plocha. Verze 5 je o tom, aby obsah kartu vyplnil —
a o opravě tří věcí, které verze 4 rozbila.

## Hlavní myšlenka

Uživatel si zvětšil prohlížeč na 130–160 % a teprve tam to vypadalo správně:
text zaplnil kartu, nadpisy byly výrazné, kresby velké. **Tohle má být vidět
rovnou při 100 %.** Nejde tedy o větší rám, ale o větší obsah v něm.

## 1. Společné pro celý test

1. **Jedna plynulá stupnice písma svázaná s velikostí okna.** Dnes jsou velikosti
   napevno (16–18 bodů); nově rozsah, který se mezi dvěma mezemi plynule mění.
   Na běžném monitoru to má vypadat jako dnešních 130–140 %.
   **Poctivě k očekávání:** na nízkém okně (školní notebook, 720 bodů výšky)
   to tak vypadat nebude a nemůže — tam není kam růst, aniž by se začalo rolovat.
   Růst začne zhruba od 900 bodů výšky.
2. **Kresby navázat na panel, ne na výšku okna.** Dnes používám `vh`, jenže
   zvětšení v prohlížeči zmenšuje okno měřené v CSS bodech — proto se při 130 %
   mapa naopak **zmenšila**. Po navázání na šířku panelu poroste všechno společně,
   jak člověk čeká.
3. **Zrušit „odsunutí k dolní hraně".** Ve verzi 4 jsem blok odpovědi a mapu
   poslal `margin-top: auto` dolů, aby se obsah rozprostřel. U otázky 1 to vyšlo,
   u otázky 2 to vytrhlo mapu z textu, ke kterému patří, a u otázky 4 nechalo
   odpovědní políčko osamoceně dole. Nově **pevný velkorysý odstup** a volné místo
   zůstane pod obsahem.
4. **Před prohlášením obrazovky za hotovou se na ni podívat** na snímku ve dvou
   velikostech okna. Automatická kontrola umí jen rolování — o vyváženosti
   neřekne nic, a právě proto prošla karta plná prázdna.
5. **Měnit míň věcí najednou.** Verze 4 sáhla na rozvržení všech šesti obrazovek
   zároveň, takže jedna chyba v rozvaze se projevila všude.

## 2. Úvodní stránka

6. Obsah poroste s kartou, takže ji vyplní. Karta smí být i o něco menší než teď.
7. **Paprsky od slunce jsou rozbité.** Dnes jsou tři různé: k panelu čárkovaný
   (správně), ke kouli plný se šipkou, k zrcadlu čárkovaný, ale nezačíná u slunce.
   Navíc je tam čtvrtý, plný, od zrcadla vzhůru do koule.
   Nově: slunce i čtyři krátké paprsky kolem něj zůstanou; od slunce povedou
   **tři stejné čárkované paprsky bez šipek** — k panelu, k zrcadlu, ke kouli.
   *Pozor:* tím zmizí odražený paprsek od zrcadla vzhůru. Zrcadlo zůstane
   i s popiskem. Kdyby ho uživatel chtěl zachovat, udělat ho taky čárkovaný.

## 3. Otázka 1

8. Jen plynulá stupnice písma — jinak je obrazovka v pořádku.

## 4. Otázka 2

9. **Mapu odepnout od dolní hrany**, půjde hned za kroky.
10. **Mapa je přednostní prvek rozpočtu výšky**, ne první věc ke zmenšení.
    Dosud se při každém ladění scvrkávala jako první.
11. Plynulá stupnice písma.

## 5. Otázka 3

12. **Odstavec „Městský úřad se rozhodl…" patří do levého panelu** — je to zadání,
    ne podklad. Levý panel pak bude mít stejnou stavbu jako otázka 1:
    text zadání → linka → otázka → blok s odpovědí.
13. **V pravém panelu krabice nahoře, kamiony pod nimi**, obojí přes celou šířku.
    Je to možné právě díky bodu 12: odstavec zabíral výšku, kvůli které jsem ve
    verzi 4 musel krabice a kamiony postavit vedle sebe. Kamiony i krabice tím
    budou výrazně větší.

## 6. Otázka 4

14. **Odpovědní políčko odepnout od dolní hrany** (viz bod 3).
15. **Slunce u farmy svítí jen nahoru.** Všechny čtyři paprsky míří vzhůru nebo
    do stran, dolů k modulům žádný — přitom právě ty jsou věcně podstatné.
    Doplnit paprsky směrem dolů k farmě.

## 7. Výsledek

16. **Pod výsledkem se vykresluje prázdná bílá karta.** Příčina: pravý panel se
    skrývá atributem `hidden`, ale verze 4 dala všem panelům `display: flex`,
    což skrytí přebije. Oprava: `.panel[hidden] { display: none; }`.

## Otevřené z minula

- Výška tabulky u otázky 2 — kolik řádků má být vidět naráz?
- Orientace obrázku u úlohy 1 v tisku — naležato, nebo nastojato?
- Repozitář je privátní; pro GitHub Pages ho bude potřeba přepnout na veřejný.
