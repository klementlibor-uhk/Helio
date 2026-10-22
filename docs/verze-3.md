# Verze 3 — zadání úprav

Sepsáno 22. 10. 2026 po druhém projití všech šesti obrazovek.
Verze 2 přinesla nový vzhled, ale taky dvě regrese a jedno zásadní nepochopení
principu Helia. To je tu na prvním místě.

## 1. Princip Helia — co jsem měl špatně

Ve verzi 2 byla kresba věcně chybná. Správně to funguje takto:

- Solární panel vyrábí elektřinu pro **čerpadlo**.
- Čerpadlo žene **mořskou vodu** středovou stoupačkou nahoru do **mělké vaničky
  uprostřed koule**, zavěšené na obruči v polovině výšky. To je ta **tmavě modrá** voda.
- Mezi okrajem vaničky a stěnou koule je **po celém obvodu mezera**.
- Slunce ohřívá vodu ve vaničce přímo shora a navíc odrazem od **zrcadla pod koulí**.
- Z hladiny ve vaničce se voda **odpařuje vzhůru**.
- Na **chladnější stěně koule** pára kondenzuje do mikrokapiček.
- Kapky **stékají po stěně dolů**, mezerou kolem vaničky, až **na dno koule**.
- Na dně se hromadí **pitná voda** — ta **světle modrá**.
- Odtud se odčerpává, prochází **remineralizací** a teče k lidem.

Slaná voda je tedy **nahoře ve vaničce**, sladká **dole na dně**, a nikdy se nepotkají.

**Chyby verze 2:** mořská voda byla na dně; prvek uprostřed byl vyložen jako sběrný
žlab na kondenzát místo vaničky; kapky končily v tom žlabu místo na dně; zrcadlo chybělo.

## 2. Kresba Helia

1. **Maximálně věrná** namalovanému schématu — naše ruka, ale stejné rozvržení,
   prvky i barvy.
2. **Žádný text uvnitř obrázku.** Popisky a vysvětlení patří pod obrázek jako
   běžný text. Kresba se tak dá použít velká i malá a zůstane čitelná.
3. **Slunce jen jako výseč z horního rohu**, ne celý kotouč v prázdném nebi.
   Obecně platí: **žádné mrtvé okraje** v žádné kresbě.
4. **Jeden sdílený soubor** pro úvodní stránku i otázku 2.
5. **Animace** podle opraveného principu: slunce → panel → čerpadlo → přítok do
   vaničky → odpařování → pára → kondenzace na stěně → kapky stékají kolem vaničky
   na dno → odtok → remineralizace → ven.

## 3. Regrese z verze 2 — okénka se nevrství

**Chyba:** prohlášení o soukromí, kalkulačka i nápověda se nezobrazí jako okénko nad
stránkou, ale vysypou se do textu stránky.

**Příčina:** při přepisu `test.css` ve verzi 2 se ztratily styly kalkulačky a nápovědy
(v souboru nejsou vůbec). Bez `position: fixed` se okno zařadí do toku stránky.
Styly okénka `.modal` v `test.css` zůstaly, ale **úvodní stránka `test.css` nenačítá**.

**Oprava:** nový `css/overlay.css` se vším, co se vznáší nad stránkou (okénka,
kalkulačka, nápověda), načtený **oběma** stránkami.

## 4. Layout — celistvost a žádné rolování

6. **Spodní lišta patří do kompozice.** Teď je hranatá, přes celou šířku a přilepená
   ke spodní hraně, kdežto karty jsou zakulacené a odsazené. Dostane stejné odsazení,
   stejné zakulacení a tlačítka zarovnaná s kartami.
7. **Karty se nebudou natahovat na celou výšku okna.** Teď pod obsahem zeje prázdná
   bílá plocha. Výška podle obsahu s rozumným minimem, volné místo rovnoměrně.
8. **Nikde se nesmí rolovat.** Platí pro všechny obrazovky, zvlášť pro otázku 2
   (mapa a simulace) a otázku 3 (krabice a kamiony).
   Postup: rozpočítat výšku panelu mezi prvky a **ověřit měřením** (`scrollHeight`
   proti `clientHeight`), ne okem.

## 5. Úvodní stránka

9. **Vypustit** řádek „4 úlohy · nespěchej, čas není omezený“ — pro patnáctileté
   je zbytečný.
10. **Zvětšit** bílou kartu i obsah.
11. Použít **novou kresbu Helia**.

## 6. Otázka 1

12. **Větší mezera mezi zadáním a otázkou**, obsah o kousek níž.
13. Slova **„Základní“ a „Bez rizika“ tučně** místo žlutého podbarvení.
14. Otázka velkým tučným písmem a blok odpovědi zůstávají (schváleno).

## 7. Otázka 2

15. Nová kresba a animace, **popisky mimo obrázek**.
16. **Mapu zmenšit a zarovnat na střed**, včetně popisku „Zedské moře“.
17. **Puntíky A–D zvětšit** i s neviditelnou záchytnou plochou, ať se do nich
    žák snadno trefí.
18. **Vejít se bez rolování** — součástí rozpočtu je i výška tabulky.

## 8. Otázka 3

19. Panel s krabicemi a kamiony se **musí vejít bez rolování**: oříznout mrtvé
    okraje kreseb, zmenšit krabice, stáhnout mezery.

## 9. Otázka 4

20. Popisek **„mořská voda“ posunout** tak, aby nekřížil modré potrubí.
    Prověřit i druhý popisek.

## 10. Výsledek a tisk

21. **Obrázek u úlohy 3 je rozbitý:** popisky návěsů a shrnující řádek se překrývají
    (rozdíl šesti bodů je menší než výška písma) a obě shrnutí se slepila, protože
    SVG zahazuje opakované mezery. Každý součet patří pod svou dvojici návěsů
    a obrázek potřebuje víc výšky.
22. **Sladit barvy obrázku u úlohy 1 s hlavním grafem.** Nepřebarvovat data:
    stejné odstíny jako v otázce, a to podstatné vyznačit **svorkami a popisem**
    („88 % má přímý přístup“, „12 % nemá = 840 milionů“), ne jinou barvou.
23. **Každý obrázek prohlédnout vykreslený v plné velikosti.** Ve verzi 2 jsem
    ověřil jen to, že se vykreslil, ne jak vypadá — proto kolize textu prošla.

## Otevřené k rozhodnutí

- **Výška tabulky u otázky 2:** nechat ji nižší a nechat růst, jak žák přidává data?
- **Orientace obrázku u úlohy 1 v tisku:** naležato (vejde se líp), nebo nastojato
  jako hlavní graf?
