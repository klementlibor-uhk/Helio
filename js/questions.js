'use strict';
/* Jednotlivé otázky. Každá vrací obsah levého panelu (zadání a odpovídání)
   a pravého panelu (podnět — materiál, ze kterého žák čerpá). */

/* Skládaný sloupcový graf přístupu k pitné vodě v roce 2015.
   Kreslíme ho z dat, ne jako obrázek — je ostrý v každé velikosti. */
function chartAccess() {
  /* Jeden modrý odstínový pás přes všech pět kategorií. Záměrně neutrální:
     kdyby se kategorie bez přístupu lišily barvou, prozradilo by to řešení. */
  var rows = [
    { label: 'Povrchová voda',  pct: 2,  color: '#D8E8F5', dark: true },
    { label: 'Neupravená',      pct: 6,  color: '#AFD0EA', dark: true },
    { label: 'Omezený přístup', pct: 4,  color: '#7FB0DC', dark: true },
    { label: 'Základní',        pct: 17, color: '#3E82BE', dark: false },
    { label: 'Bez rizika',      pct: 71, color: '#14558C', dark: false }
  ];

  var top = 18, height = 232, barX = 34, barW = 54;
  var labelX = 128, leadEnd = 120;
  /* Tři horní kategorie jsou tenké, popisky by se překryly — rozestoupí se. */
  var labelY = [26, 52, 78, 116, 206];

  var y = top, bars = '', leads = '', labels = '';
  rows.forEach(function (r, i) {
    var h = height * r.pct / 100;
    bars += '<rect x="' + barX + '" y="' + y.toFixed(1) + '" width="' + barW +
      '" height="' + h.toFixed(1) + '" fill="' + r.color + '"></rect>';
    var mid = y + h / 2;
    leads += '<path d="M' + (barX + barW) + ' ' + mid.toFixed(1) + ' H' + (barX + barW + 12) +
      ' L' + leadEnd + ' ' + labelY[i] + ' H' + (labelX - 4) +
      '" fill="none" stroke="#9FBBD2" stroke-width="1"></path>';
    labels += '<text x="' + labelX + '" y="' + (labelY[i] + 4) + '" font-size="14" fill="#162434">' +
      r.label + ' <tspan font-weight="600">' + r.pct + ' %</tspan></text>';
    y += h;
  });

  /* Jemné bílé spáry mezi segmenty, aby byly rozeznatelné i tenké kategorie. */
  var seams = '', sy = top;
  rows.forEach(function (r, i) {
    sy += height * r.pct / 100;
    if (i < rows.length - 1) {
      seams += '<rect x="' + barX + '" y="' + (sy - 0.75).toFixed(1) + '" width="' + barW +
        '" height="1.5" fill="#fff"></rect>';
    }
  });

  var axis = '';
  [0, 50, 100].forEach(function (p) {
    var ay = top + height * (100 - p) / 100;
    axis += '<path d="M' + (barX - 7) + ' ' + ay + ' H' + barX + '" stroke="#C6D8E6"></path>' +
      '<text x="' + (barX - 11) + '" y="' + (ay + 4) + '" font-size="12" text-anchor="end" ' +
      'fill="#7589A0">' + p + '</text>';
  });

  return '<p class="figure-title">Přístup k pitné vodě v roce 2015 <span class="unit-note">' +
    'podíl obyvatel světa v %</span></p>' +
    '<svg viewBox="0 0 330 268" width="100%" style="max-width:430px;display:block" role="img" ' +
    'aria-label="Skládaný sloupec: bez rizika 71 procent, základní 17, omezený přístup 4, ' +
    'neupravená 6, povrchová voda 2 procenta.">' +
    axis + bars + seams + leads + labels +
    '</svg>' +
    '<p class="figure-source">Zdroj: Progress on drinking water, sanitation and hygiene 2017, WHO a UNICEF.</p>';
}

function placeholder(text) {
  return '<div class="placeholder">' + text + '</div>';
}

var QUESTIONS = [
  {
    code: 'PV1',
    left: function () {
      return '<p class="eyebrow">Otázka 1 ze 4</p>' +
        '<p>Na Zemi je nedostatek čisté pitné vody, která je pro mnoho lidí stále nedostupná.</p>' +
        '<p>Přímý přístup k pitné vodě mají pouze osoby z kategorií <strong>Základní</strong> ' +
        'a <strong>Bez rizika</strong>.</p>' +
        '<hr class="sep-thin">' +
        '<p class="question">V roce 2015 žilo na Zemi přibližně 7 miliard lidí. ' +
        'Kolik z nich nemělo přímý přístup k pitné vodě?</p>' +
        '<p class="hint">Odpověď uveď v milionech.</p>' +
        answerBlock(answerNumber('q1', 'milionů'));
    },
    right: function () { return '<div class="center-fig">' + chartAccess() + '</div>'; }
  },
  {
    code: 'PV2',
    left: function () { return Sim.leftHTML(); },
    right: function () { return Sim.rightHTML(); },
    mount: function () { Sim.mount(); }
  },
  {
    code: 'PV3',
    left: function () {
      return '<p class="eyebrow">Otázka 3 ze 4</p>' +
        '<p class="question">Do kterého typu kamionu se vejde více modulů Helio?</p>' +
        answerBlock(
          answerSelect('q3', [
            { value: 'I', text: 'Kamion s návěsem I' },
            { value: 'II', text: 'Kamion s návěsem II' },
            { value: 'stejne', text: 'Oba typy jsou stejně výhodné' }
          ]) +
          answerText('q3text', 'Vysvětli svou odpověď.', 'Napiš své vysvětlení…',
            'Vysvětlení se neboduje. V přehledu odpovědí ho uvidíš vedle vzorového řešení.')
        );
    },
    right: function () {
      return '<p>Městský úřad se rozhodl vyřešit problémy s pitnou vodou výstavbou farmy ' +
        'Helio, která se skládá z mnoha modulů. Jeden modul se veze ve dvou krabicích.</p>' +
        /* Krabice a kamiony vedle sebe, ne pod sebou — panel je široký a výšky
           je málo. Obojí se tím může nakreslit výrazně větší. */
        '<div class="q3-cols">' +
        '<div class="q3-boxes">' +
        '<div class="boxes">' +
        '<img src="img/krabice-velka.svg" alt="Velká krabice 167 krát 159 krát 95 centimetrů.">' +
        '<img src="img/krabice-mala.svg" alt="Malá krabice 131 krát 56 krát 40 centimetrů.">' +
        '</div>' +
        '<p class="hint">Obě krabice se musí vézt touto stranou nahoru.</p>' +
        '</div>' +
        '<div class="q3-trucks">' +
        '<p class="figure-title trucks-title">Úložný prostor</p>' +
        '<p class="truck-label">Kamion s návěsem I</p>' +
        '<img class="truck" src="img/kamion-1.svg" ' +
        'alt="Kamion s návěsem I: dva úložné prostory po 7,7 metru.">' +
        '<p class="truck-label">Kamion s návěsem II</p>' +
        '<img class="truck" src="img/kamion-2.svg" ' +
        'alt="Kamion s návěsem II: úložné prostory 7,3 a 8,2 metru.">' +
        '<p class="hint trucks-note">Oba typy mají úložný prostor široký 2,48 m, ' +
        'vysoký 3,0 m, o celkovém objemu 115 m³.</p>' +
        '</div></div>';
    }
  },
  {
    code: 'PV4',
    left: function () {
      return '<p class="eyebrow">Otázka 4 ze 4</p>' +
        '<p>Návratnost investice do farmy Helio s roční produkcí 29 200 hl pitné vody ' +
        'a pevnou cenou pro občany 0,08 zedu za jeden litr je vypočítána na 15 let.</p>' +
        '<p>Městský úřad si na celou investici vezme půjčku od banky. Bance celkem zaplatí ' +
        'částku o 4,5 % vyšší, než byla půjčka, a bude ji splácet v pravidelných měsíčních ' +
        'splátkách po dobu 20 let.</p>' +
        '<hr class="sep-thin">' +
        '<p class="question">Jaká je jedna měsíční splátka, kterou je třeba platit bance?</p>' +
        answerBlock(answerNumber('q4', 'zedů'));
    },
    right: function () {
      return '<div class="center-fig">' +
        '<img class="farm" src="img/farma.svg" ' +
        'alt="Farma Helio: skupiny modulů rozmístěné v kruzích na pobřežní krajině.">' +
        '<p class="farm-text">Městský úřad se rozhodl vyřešit problémy s pitnou vodou ' +
        've svém městě výstavbou farmy Helio. Farma se skládá z mnoha modulů.</p>' +
        '<div class="note"><strong>Návratnost investice</strong> je doba, za kterou se ' +
        'vložené peníze vrátí z výnosů.</div></div>';
    }
  }
];
