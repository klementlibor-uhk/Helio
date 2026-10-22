# Verze 4 — zadání úprav

Sepsáno 22. 10. 2026 po třetím projití všech šesti obrazovek.
Verze 3 opravila princip Helia, vrstvení oken i rolování, ale **přestřelila
v úspoře místa**. Verze 4 je proto především o práci s prostorem.

## Poučení, ze kterého verze 4 vychází

Ve verzi 2 karty vyplňovaly celou výšku okna, ale obsah se tísnil nahoře a pod
ním zela prázdná bílá plocha. Opravil jsem to tím, že jsem karty smrskl na výšku
obsahu — a tím vznikl prázdný modrý pás nad nimi i pod nimi. **Obě verze jsou
špatně.** Správně je: karty vyplní okno a **obsah se uvnitř nich rozprostře**.
Prázdné místo pak není zbytek, ale vzduch mezi prvky.

## 1. Společné pro celý test

1. **Karty roztáhnout nahoru, dolů, doleva i doprava.** Prostor je ve všech
   čtyřech směrech nevyužitý. Obsah uvnitř rozložit, ne stlačit k hornímu okraji.
2. **Horní modrý pruh zakulatit a odsadit** stejně jako karty. Teď je jediný
   hranatý a přilepený k hraně okna, takže působí jako cizí prvek.
3. **Spodní lištu přitáhnout ke kartám.** I když je zakulacená, odděluje ji od
   nich tolik místa, že vypadá jako samostatný ostrůvek.
4. **Pravidlo „nikde se neroluje" platí dál**, jen mu vzroste rozpočet. Kresby se
   už řídí výškou okna, ne šířkou panelu, takže se zvětší samy a úměrně.
   Po každé změně znovu ověřit měřením (`scrollHeight` proti `innerHeight`)
   na 1280×720, 1366×720 a 1280×800.

## 2. Kresba Helia — věcná chyba

5. **Obláček vyčnívá z koule.** Koule má poloměr 66 a vrchol ve výšce 30, obláček
   sahá od 28 a je široký 80 bodů, zatímco koule je v té výšce široká 50 — doslova
   prostupuje stěnou. Fyzikálně nemožné, celý děj se odehrává **uvnitř** koule.
   Oprava dvojí: obláček nakreslit **menší a níž**, aby měl kolem sebe volno,
   a navíc ho **ořezat tvarem koule** jako pojistku. Samotné ořezání nestačí —
   obláček by se o stěnu opřel plochou hranou.
6. **Popisky jen na úvodní stránce.** Solární panel, čerpadlo, mořská voda,
   vanička, zrcadlo, pitná voda, remineralizace — umístit **kolem obrázku, ne
   v něm**, spojené krátkými vynášecími čárkami. V otázce 2 je kresba malá a princip
   je popsaný textem vedle ní, tam popisky nebudou. Udělat jako druhý režim téhož
   zdroje (`js/helio.js`), ať zůstane jeden obrázek, ne dva.

## 3. Úvodní stránka

7. **Karta si vezme většinu výšky okna**, obsah se rozprostře — nadpis a text
   nahoře, patička se zdrojem a odkazem na soukromí dole u spodní hrany karty.
8. **Obrázek Helia výrazně zvětšit** (ve vyšší kartě na to bude místo).

## 4. Otázka 1

9. **Víc odsadit zadání od odpovědi** — ve vyšší kartě na to bude prostor.
10. **Linku mezi zadáním a odpovědí zachovat** (schváleno).

## 5. Otázka 2

11. **Doplnit chybějící linku** mezi zadáním a otázkou, stejnou jako na obrazovce 1.
12. **Popisek škály na jeden řádek.** Teď se láme na dva a vypadá, jako by patřil
    k mapě nad ním. Musí být jasné, že vysvětluje barevnou škálu — nechat ho
    roztáhnout na šířku panelu, ne ho držet v úzkém sloupci pod mapou.
13. **Zvětšit písmeno u „Vybrané město"**, ať je volba jednoznačně čitelná.
14. **Obrázek Helia výrazně zvětšit**, klidně i na šířku. Rozmístění obrázku vedle
    ovladačů zůstává — to je podle uživatele vyřešené dobře.
15. **Tabulku zvětšit**, aby šlo bez rolování přečíst víc řádků; žák v ní porovnává
    data. S tím zvednout i strop počtu řádků (teď 12, nejstarší se zahazuje).
16. **Mapa může zase povyrůst** — ve verzi 3 byla seškrtaná nejvíc ze všeho.

## 6. Otázka 3

17. Bez věcných připomínek, jen prostor. **Krabice a kamiony dostanou zpět
    velikost**, kterou jsem jim ve verzi 3 ubral kvůli rolování.

## 7. Otázka 4

18. Bez věcných připomínek, jen prostor — větší pole se zadáním i s obrázkem.

## Otevřené k rozhodnutí

- **Výška tabulky u otázky 2** — kolik řádků má být vidět naráz?
- **Orientace obrázku u úlohy 1 v tisku** — naležato, nebo nastojato jako hlavní graf?
- **`docs/helio-nahled.html`** — kontrolní stránka na prohlížení kresby ve dvou
  velikostech a se spuštěním animace. Zatím ponechána v repozitáři; jestli nebude
  užitečná, smazat.

## Stav před verzí 4

Poslední commit verze 3: `8e1de2e`, pushnutý. Test je obsahově kompletní
(úvod, čtyři otázky, výsledek, prohlížení odpovědí, tisk do portfolia, nápověda,
kalkulačka). Repozitář je **privátní** — pro GitHub Pages ho bude potřeba
přepnout na veřejný.
