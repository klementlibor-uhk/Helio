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
    left: function () {
      return '<p class="eyebrow">Otázka 2 ze 4</p>' +
        '<p class="question">Ve kterém městě Lucy bydlí?</p>' +
        placeholder('Mapa Zedlandu s výběrem města a barevná škála slunečního záření se připravují.');
    },
    right: function () {
      return placeholder('Simulace modulu Helio: posuvníky pracovní doby a slunečního záření, ' +
        'tlačítko Spustit a tabulka naměřených hodnot s označováním řádků.');
    }
  },
  {
    code: 'PV3',
    left: function () {
      return '<p class="eyebrow">Otázka 3 ze 4</p>' +
        '<p class="question">Do kterého typu kamionu se vejde více modulů Helio?</p>' +
        placeholder('Rozbalovací nabídka a rámeček na vysvětlení se připravují.');
    },
    right: function () {
      return placeholder('Kresby obou přepravních krabic s kótami a nákresy obou kamionů ' +
        's délkou úložných prostorů se připravují.');
    }
  },
  {
    code: 'PV4',
    left: function () {
      return '<p class="eyebrow">Otázka 4 ze 4</p>' +
        '<p class="question">Jaká je jedna měsíční splátka, kterou je třeba platit bance?</p>' +
        placeholder('Text o návratnosti investice a políčko na odpověď se připravují.');
    },
    right: function () {
      return placeholder('Ilustrace farmy Helio a vysvětlivka pojmu návratnost investice ' +
        'se připravují.');
    }
  }
];
