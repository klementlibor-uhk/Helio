'use strict';
/* Jednotlivé otázky. Každá vrací obsah levého panelu (zadání a odpovídání)
   a pravého panelu (podnět — materiál, ze kterého žák čerpá). */

/* Skládaný sloupcový graf přístupu k pitné vodě v roce 2015.
   Kreslíme ho z dat, ne jako obrázek — je ostrý v každé velikosti. */
function chartAccess() {
  var rows = [
    { label: 'Povrchová voda', pct: 2,  color: '#D85A30', text: null },
    { label: 'Neupravená',     pct: 6,  color: '#EF9F27', text: null },
    { label: 'Omezený přístup', pct: 4, color: '#FAC775', text: null },
    { label: 'Základní',       pct: 17, color: '#85B7EB', text: '#042C53' },
    { label: 'Bez rizika',     pct: 71, color: '#378ADD', text: '#FFFFFF' }
  ];

  var top = 20, height = 200, barX = 60, barW = 52, y = top, bars = '', legend = '';
  rows.forEach(function (r, i) {
    var h = height * r.pct / 100;
    bars += '<rect x="' + barX + '" y="' + y + '" width="' + barW + '" height="' + h +
            '" fill="' + r.color + '"></rect>';
    if (r.text) {
      bars += '<text x="' + (barX + barW / 2) + '" y="' + (y + h / 2 + 4) +
              '" font-size="12" text-anchor="middle" fill="' + r.text + '">' + r.pct + '</text>';
    }
    y += h;
    var ly = 70 + i * 24;
    legend += '<rect x="128" y="' + ly + '" width="12" height="12" rx="2" fill="' + r.color + '"></rect>' +
              '<text x="148" y="' + (ly + 10) + '" font-size="12" fill="#2C2C2A">' +
              r.label + ' — ' + r.pct + ' %</text>';
  });

  var axis = '';
  [100, 80, 60, 40, 20, 0].forEach(function (p) {
    var ay = top + height * (100 - p) / 100;
    axis += '<text x="50" y="' + (ay + 4) + '" font-size="11" text-anchor="end" fill="#888780">' +
            p + ' %</text>';
  });

  return '<p class="figure-title">Přístup k pitné vodě v roce 2015</p>' +
    '<svg viewBox="0 0 300 240" width="100%" style="max-width:420px;display:block" role="img" ' +
    'aria-label="Skládaný sloupcový graf: bez rizika 71 procent, základní 17, omezený přístup 4, ' +
    'neupravená 6, povrchová voda 2 procenta.">' +
    axis + bars + legend +
    '<line x1="59" y1="' + top + '" x2="59" y2="' + (top + height) + '" stroke="#D9DEE4"></line>' +
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
        '<p>Přímý přístup k pitné vodě mají pouze osoby z kategorií <mark>Základní</mark> ' +
        'a <mark>Bez rizika</mark>.</p>' +
        '<hr class="sep-thin">' +
        '<p class="question">V roce 2015 žilo na Zemi přibližně 7 miliard lidí. ' +
        'Kolik z nich nemělo přímý přístup k pitné vodě?</p>' +
        '<p class="hint">Odpověď uveď v milionech.</p>' +
        answerNumber('q1', 'milionů');
    },
    right: chartAccess
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
        answerSelect('q3', 'Vyber jednu možnost:', [
          { value: 'I', text: 'Kamion s návěsem I' },
          { value: 'II', text: 'Kamion s návěsem II' },
          { value: 'stejne', text: 'Oba typy jsou stejně výhodné' }
        ]) +
        answerText('q3text', 'Vysvětli svou odpověď.',
          'Vysvětlení se neboduje. V přehledu odpovědí ho uvidíš vedle vzorového řešení.');
    },
    right: function () {
      return '<p>Městský úřad se rozhodl vyřešit problémy s pitnou vodou výstavbou farmy ' +
        'Helio, která se skládá z mnoha modulů. Jeden modul se veze ve dvou krabicích.</p>' +
        '<div class="boxes">' +
        '<img src="img/krabice-velka.svg" alt="Velká krabice 167 krát 159 krát 95 centimetrů.">' +
        '<img src="img/krabice-mala.svg" alt="Malá krabice 131 krát 56 krát 40 centimetrů.">' +
        '</div>' +
        '<p class="hint">Obě krabice se musí vézt touto stranou nahoru.</p>' +
        '<p class="figure-title trucks-title">Úložný prostor</p>' +
        '<p class="truck-label">Kamion s návěsem I</p>' +
        '<img class="truck" src="img/kamion-1.svg" ' +
        'alt="Kamion s návěsem I: dva úložné prostory po 7,7 metru.">' +
        '<p class="truck-label">Kamion s návěsem II</p>' +
        '<img class="truck" src="img/kamion-2.svg" ' +
        'alt="Kamion s návěsem II: úložné prostory 7,3 a 8,2 metru.">' +
        '<p class="hint trucks-note">Oba typy mají úložný prostor široký 2,48 m, ' +
        'vysoký 3,0 m, o celkovém objemu 115 m³.</p>';
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
        answerNumber('q4', 'zedů');
    },
    right: function () {
      return '<img class="farm" src="img/farma.svg" ' +
        'alt="Farma Helio: skupiny modulů rozmístěné v kruzích na pobřežní krajině.">' +
        '<p class="farm-text">Městský úřad se rozhodl vyřešit problémy s pitnou vodou ' +
        've svém městě výstavbou farmy Helio. Farma se skládá z mnoha modulů.</p>' +
        '<div class="note"><strong>Návratnost investice</strong> je doba, za kterou se ' +
        'vložené peníze vrátí z výnosů.</div>';
    }
  }
];
