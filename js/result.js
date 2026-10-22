'use strict';
/* Závěr testu: potvrzovací okna, výsledek, prohlížení odpovědí a tisk do portfolia. */

var Result = (function () {

  var TITLES = [
    'Přístup k pitné vodě',
    'Kde bydlí Lucy',
    'Kamiony s krabicemi',
    'Splátka bance'
  ];

  var ANSWER = ['840 milionů', 'Město B', 'Kamion s návěsem II', '15 257 zedů'];

  /* Postup po krocích — v prohlížení odpovědí i na tiskové stránce. */
  var STEPS = [
    [
      'Přímý přístup mají kategorie Bez rizika (71 %) a Základní (17 %).',
      '71 % + 17 % = 88 % lidí přístup má.',
      '100 % − 88 % = 12 % lidí přístup nemá.',
      '12 % ze 7 000 milionů: 0,12 · 7 000 = <strong>840 milionů</strong>.'
    ],
    [
      'Lucy má 2 920 litrů za rok. Rok má 365 dní: 2 920 : 365 = 8 litrů za den.',
      'Modul pracuje 8 hodin denně: 8 : 8 = 1 litr za hodinu.',
      'V simulaci nastav 1 hodinu a hledej, při kterém záření vyjde 1 litr — je to záření 6.',
      'Na mapě má barvu odpovídající šestce <strong>město B</strong>.'
    ],
    [
      'Značka „touto stranou nahoru“ drží krabici na výšku 95 cm, otáčet jde jen půdorys.',
      'Do výšky 300 cm se vejdou 300 : 95 = 3 vrstvy.',
      'Podél délky se krabice postaví rozměrem 159 cm: do 7,7 m jdou 4, do 8,2 m jich jde 5.',
      'Kamion I: (4 + 4) · 3 = 24 modulů. Kamion II: (4 + 5) · 3 = <strong>27 modulů</strong>.',
      'Objem mají oba stejný, rozhoduje rozdělení délky. Malé krabice se vejdou vedle velkých.'
    ],
    [
      '29 200 hl je 2 920 000 litrů.',
      '2 920 000 · 0,08 zedu = 233 600 zedů ročně.',
      'Návratnost 15 let: 233 600 · 15 = 3 504 000 zedů — to je výše půjčky.',
      'Bance se zaplatí o 4,5 % víc: 3 504 000 · 1,045 = 3 661 680 zedů.',
      '20 let je 240 měsíců: 3 661 680 : 240 = <strong>15 257 zedů</strong>.'
    ]
  ];

  var CHOICES = { I: 'Kamion s návěsem I', II: 'Kamion s návěsem II',
                  stejne: 'Oba typy jsou stejně výhodné' };

  /* ---------- body a stavy ---------- */

  function points() {
    var s = Scoring.score(answers);
    return [s.q1, s.q2, s.q3, s.q4];
  }

  function maxPoints() { return [1, 2, 1, 1]; }

  function answered(i) {
    if (i === 0) return !!String(answers.q1 || '').trim();
    if (i === 1) return !!answers.q2town || Scoring.markedRows(answers.q2rows).length > 0;
    if (i === 2) return !!answers.q3;
    return !!String(answers.q4 || '').trim();
  }

  /* ok / part / bad / none — nevyplněná úloha se nemá tvářit jako špatná odpověď */
  function status(i) {
    if (!answered(i)) return { cls: 'none', label: 'Nezodpovězeno' };
    var p = points()[i], max = maxPoints()[i];
    if (p === max) return { cls: 'ok', label: 'Správně' };
    if (p > 0) return { cls: 'part', label: 'Částečně' };
    return { cls: 'bad', label: 'Nesprávně' };
  }

  /* Co je vyplněné jen zčásti — pro hlášku před odevzdáním. */
  function incomplete() {
    var out = [];
    if (!String(answers.q1 || '').trim()) out.push(0);
    if (!answers.q2town || Scoring.markedRows(answers.q2rows).length === 0) out.push(1);
    if (!answers.q3 || !String(answers.q3text || '').trim()) out.push(2);
    if (!String(answers.q4 || '').trim()) out.push(3);
    return out;
  }

  function markedList() {
    var m = Scoring.markedRows(answers.q2rows);
    if (!m.length) return 'žádné';
    return m.map(function (r) {
      return String(r.hours).replace('.', ',') + ' h při záření ' + r.irradiation;
    }).join('; ');
  }

  function given(i) {
    if (i === 0) return answers.q1 ? esc(answers.q1) + ' milionů' : null;
    if (i === 1) {
      if (!answered(1)) return null;
      return 'město ' + esc(answers.q2town || '—') + ', označené řádky: ' + esc(markedList());
    }
    if (i === 2) return answers.q3 ? esc(CHOICES[answers.q3] || answers.q3) : null;
    return answers.q4 ? esc(answers.q4) + ' zedů' : null;
  }

  /* ---------- okénka ---------- */

  function dialog(title, text, yesLabel, noLabel, onYes) {
    var back = document.createElement('div');
    back.className = 'modal-back';
    back.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="mt">' +
      '<h2 id="mt">' + title + '</h2><p>' + text + '</p>' +
      '<div class="modal-actions">' +
      '<button data-modal="no">' + noLabel + '</button>' +
      '<button class="primary" data-modal="yes">' + yesLabel + '</button>' +
      '</div></div>';
    back.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-modal]') : null;
      if (!b) return;
      document.body.removeChild(back);
      if (b.getAttribute('data-modal') === 'yes') onYes();
    });
    document.body.appendChild(back);
    var yes = back.querySelector('[data-modal="yes"]');
    if (yes) yes.focus();
  }

  function confirmSubmit(onYes) {
    var missing = incomplete();
    var text = missing.length
      ? 'V ' + missing.length + ' ze 4 úloh chybí odpověď nebo její část. ' +
        'Chceš test přesto odevzdat?'
      : 'Všechny úlohy máš vyplněné. Po odevzdání už odpovědi nepůjde měnit.';
    dialog('Odevzdat test?', text, 'Odevzdat', 'Vrátit se k testu', onYes);
  }

  function confirmRestart(onYes) {
    dialog('Začít znovu?',
      'Test se spustí od začátku a o všechny dosavadní odpovědi přijdeš. Nic se neukládá, ' +
      'takže je nepůjde vrátit.', 'Začít znovu', 'Zůstat tady', onYes);
  }

  function confirmHome(onYes) {
    dialog('Odejít na úvodní stránku?',
      'Odchodem se test zavře a všechny odpovědi se ztratí. Nic se neukládá, ' +
      'takže je nepůjde vrátit.', 'Odejít', 'Zůstat tady', onYes);
  }

  /* ---------- obrázky k postupu ---------- */

  function figure(i) {
    if (i === 0) {
      return '<svg viewBox="0 0 360 120" width="100%" role="img" ' +
        'aria-label="Pás rozdělený na 71, 17 a 12 procent; prvních 88 procent má přímý přístup.">' +
        /* stejné odstíny jako hlavní graf u otázky — data se nepřebarvují,
           to podstatné vyznačují svorky a popis */
        '<rect x="20" y="44" width="213" height="32" fill="#14558C"></rect>' +
        '<rect x="233" y="44" width="51" height="32" fill="#3E82BE"></rect>' +
        '<rect x="284" y="44" width="12" height="32" fill="#7FB0DC"></rect>' +
        '<rect x="296" y="44" width="18" height="32" fill="#AFD0EA"></rect>' +
        '<rect x="314" y="44" width="6" height="32" fill="#D8E8F5"></rect>' +
        '<text x="126" y="65" font-size="13" fill="#fff" text-anchor="middle">71 %</text>' +
        '<text x="258" y="65" font-size="13" fill="#fff" text-anchor="middle">17 %</text>' +
        '<path d="M20 36 V28 H284 V36" fill="none" stroke="#44566B" stroke-width="1.4"></path>' +
        '<text x="152" y="20" font-size="13" fill="#162434" text-anchor="middle">88 % má přímý přístup</text>' +
        '<path d="M284 84 V92 H320 V84" fill="none" stroke="#9A2727" stroke-width="1.4"></path>' +
        '<text x="320" y="110" font-size="13" fill="#9A2727" text-anchor="end">12 % nemá = 840 milionů</text>' +
        '</svg>';
    }
    if (i === 1) {
      var sc = ['#2E3BC8', '#7B86D8', '#0A8A2A', '#7BD44F', '#FFE93B',
                '#F5A623', '#E8701A', '#E8231A', '#6B1A3A'];
      var strip = sc.map(function (c, n) {
        var on = n === 6;
        return '<rect x="' + (20 + n * 30) + '" y="78" width="30" height="22" fill="' + c + '"></rect>' +
          (on ? '<rect x="' + (20 + n * 30) + '" y="78" width="30" height="22" fill="none" ' +
                'stroke="#162434" stroke-width="3"></rect>' : '') +
          '<text x="' + (35 + n * 30) + '" y="94" font-size="12" text-anchor="middle" fill="' +
          (n === 4 || n === 5 || n === 3 ? '#162434' : '#fff') + '">' + n + '</text>';
      }).join('');
      return '<svg viewBox="0 0 360 120" width="100%" role="img" ' +
        'aria-label="Řetězec přepočtu a barevná škála se zvýrazněnou šestkou.">' +
        '<text x="20" y="26" font-size="13" fill="#162434">2 920 l za rok</text>' +
        '<path d="M108 21 H140" stroke="#1C6EB4" stroke-width="1.4"></path>' +
        '<path d="M140 21 l-7 -3 v6 Z" fill="#1C6EB4" transform="rotate(180 140 21)"></path>' +
        '<text x="124" y="14" font-size="11" fill="#14558C" text-anchor="middle">: 365</text>' +
        '<text x="148" y="26" font-size="13" fill="#162434">8 l za den</text>' +
        '<path d="M214 21 H246" stroke="#1C6EB4" stroke-width="1.4"></path>' +
        '<path d="M246 21 l-7 -3 v6 Z" fill="#1C6EB4" transform="rotate(180 246 21)"></path>' +
        '<text x="230" y="14" font-size="11" fill="#14558C" text-anchor="middle">: 8 h</text>' +
        '<text x="254" y="26" font-size="13" fill="#162434" font-weight="600">1 l za hodinu</text>' +
        '<text x="20" y="58" font-size="13" fill="#162434">V simulaci dá 1 litr za hodinu záření 6:</text>' +
        strip +
        '<text x="296" y="94" font-size="13" fill="#14558C" font-weight="600">= město B</text>' +
        '</svg>';
    }
    if (i === 2) {
      /* Každý součet patří pod svou dvojici návěsů — ve verzi 2 byl jeden
         společný řádek o šest bodů níž, takže se popisky překrývaly, a dvě
         sdělení oddělená mezerami se slepila (SVG opakované mezery zahazuje). */
      function floorPlan(y, label, lens, counts, total) {
        var out = '<text x="0" y="' + y + '" font-size="12" font-weight="600" ' +
          'fill="#162434">' + label + '</text>';
        var x = 62, top = y + 10;
        lens.forEach(function (len, k) {
          var w = Math.round(len * 18);
          out += '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="46" ' +
            'fill="#EEF5FB" stroke="#14558C" stroke-width="1.4"></rect>';
          for (var b = 0; b < counts[k]; b++) {
            out += '<rect x="' + (x + 3 + b * 29) + '" y="' + (top + 3) + '" width="26" ' +
              'height="30" fill="#8A1E2B" stroke="#F7FAFD" stroke-width="1.4"></rect>';
          }
          out += '<text x="' + (x + w / 2) + '" y="' + (top + 60) + '" font-size="11" ' +
            'text-anchor="middle" fill="#44566B">' + String(len).replace('.', ',') + ' m — ' +
            counts[k] + ' krabice</text>';
          x += w + 10;
        });
        out += '<text x="0" y="' + (top + 78) + '" font-size="12" fill="#14558C">' +
          total + '</text>';
        return out;
      }
      return '<svg viewBox="0 0 360 230" width="100%" role="img" ' +
        'aria-label="Půdorys ložných ploch: kamion I pojme 4 a 4 krabice, kamion II 4 a 5.">' +
        floorPlan(14, 'Kamion s návěsem I', [7.7, 7.7], [4, 4],
          '8 krabic v jedné vrstvě · 3 vrstvy = 24 modulů') +
        floorPlan(128, 'Kamion s návěsem II', [7.3, 8.2], [4, 5],
          '9 krabic v jedné vrstvě · 3 vrstvy = 27 modulů') +
        '</svg>';
    }
    var rows = [
      ['29 200 hl', '= 2 920 000 l'],
      ['· 0,08 zedu', '= 233 600 zedů ročně'],
      ['· 15 let', '= 3 504 000 zedů (půjčka)'],
      ['· 1,045', '= 3 661 680 zedů bance'],
      [': 240 měsíců', '= 15 257 zedů měsíčně']
    ];
    var body = rows.map(function (r, n) {
      var y = 20 + n * 24;
      return '<text x="20" y="' + y + '" font-size="13" fill="#14558C" text-anchor="end" ' +
        'transform="translate(100 0)">' + r[0] + '</text>' +
        '<text x="130" y="' + y + '" font-size="13" fill="#162434"' +
        (n === 4 ? ' font-weight="600"' : '') + '>' + r[1] + '</text>';
    }).join('');
    return '<svg viewBox="0 0 360 140" width="100%" role="img" ' +
      'aria-label="Pět kroků výpočtu měsíční splátky.">' + body +
      '<path d="M125 8 V128" stroke="#A9CBE8" stroke-width="1.4"></path></svg>';
  }

  function stepsHTML(i) {
    return '<ol class="sol-steps">' + STEPS[i].map(function (s) {
      return '<li>' + s + '</li>';
    }).join('') + '</ol>';
  }

  /* ---------- výsledek ---------- */

  function resultHTML() {
    var p = points(), max = maxPoints();
    var total = p.reduce(function (a, b) { return a + b; }, 0);
    var maxTotal = max.reduce(function (a, b) { return a + b; }, 0);
    var pct = Math.round(total / maxTotal * 1000) / 10;

    var list = TITLES.map(function (t, i) {
      var st = status(i);
      return '<li><button type="button" data-action="review" data-q="' + i + '">' +
        '<span class="n">' + (i + 1) + '</span>' +
        '<span class="t">' + t + '</span>' +
        '<span class="badge ' + st.cls + '">' + st.label + '</span>' +
        '<span class="pts">' + p[i] + '/' + max[i] + '</span></button></li>';
    }).join('');

    return '<div class="result">' +
      '<p class="eyebrow">Pitná voda — výsledek</p>' +
      '<h1>' + Scoring.grade(total) + '</h1>' +
      '<div class="score-row">' +
      '<div class="score"><strong>' + total + ' / ' + maxTotal + '</strong><span>získaných bodů</span></div>' +
      '<div class="score"><strong>' + String(pct).replace('.', ',') + ' %</strong><span>úspěšnost</span></div>' +
      '<div class="score"><strong>' + formatTime(elapsed) + '</strong><span>čas řešení</span></div>' +
      '</div>' +
      '<p class="hint">Klikni na úlohu a prohlédni si svou odpověď i postup řešení.</p>' +
      '<ul class="qlist">' + list + '</ul>' +
      '<div class="result-actions">' +
      '<button class="primary" data-action="portfolio">Vytiskni své odpovědi</button>' +
      '<button data-action="home">Zpět na úvodní stránku</button>' +
      '<button data-action="restart">Nový pokus</button>' +
      '</div></div>';
  }

  /* ---------- vysvětlení pod otázkou v prohlížení ---------- */

  function solutionHTML(i) {
    var st = status(i);
    var g = given(i);
    return '<div class="solution">' +
      '<p class="sol-head">Správná odpověď: ' + ANSWER[i] +
      '<span class="pts">' + points()[i] + '/' + maxPoints()[i] + ' bodu · ' + st.label + '</span></p>' +
      stepsHTML(i) +
      '<p class="sol-given">Tvoje odpověď: ' + (g || '<em>bez odpovědi</em>') + '</p>' +
      (i === 2 && answers.q3text
        ? '<p class="sol-given">Tvoje vysvětlení: ' + esc(answers.q3text) +
          ' <span class="hint small">(nebodovalo se)</span></p>'
        : '') +
      '</div>';
  }

  /* ---------- tisk do portfolia ---------- */

  function portfolioHTML() {
    var p = points(), max = maxPoints();
    var total = p.reduce(function (a, b) { return a + b; }, 0);
    var maxTotal = max.reduce(function (a, b) { return a + b; }, 0);
    var date = new Date().toLocaleDateString('cs-CZ');

    var items = TITLES.map(function (t, i) {
      var st = status(i);
      var g = given(i);
      return '<section class="pf-item">' +
        '<h2>' + (i + 1) + '. ' + t +
        ' <span class="badge ' + st.cls + '">' + st.label + ' · ' + p[i] + '/' + max[i] + '</span></h2>' +
        '<p class="pf-given"><span>Moje odpověď:</span> ' + (g || '<em>bez odpovědi</em>') + '</p>' +
        (i === 2 && answers.q3text
          ? '<p class="pf-given"><span>Moje vysvětlení:</span> ' + esc(answers.q3text) + '</p>'
          : '') +
        '<div class="pf-sol"><strong>Správná odpověď: ' + ANSWER[i] + '</strong>' +
        stepsHTML(i) +
        '<div class="pf-fig">' + figure(i) + '</div>' +
        '</div></section>';
    }).join('');

    return '<div class="portfolio">' +
      '<p class="eyebrow">Moje práce do portfolia</p>' +
      '<h1>Pitná voda</h1>' +
      '<p class="meta">' + total + ' z ' + maxTotal + ' bodů · čas řešení ' +
      formatTime(elapsed) + ' · ' + date + '</p>' +
      '<p class="nameline">Jméno: <span class="fill-line"></span></p>' +
      '<p class="hint no-print">Stránka je připravená k tisku. V tiskovém okně můžeš vypnout ' +
      'záhlaví a zápatí prohlížeče.</p>' +
      items + '</div>';
  }

  return {
    confirmSubmit: confirmSubmit,
    confirmRestart: confirmRestart,
    confirmHome: confirmHome,
    resultHTML: resultHTML,
    solutionHTML: solutionHTML,
    portfolioHTML: portfolioHTML,
    incomplete: incomplete,
    status: status,
    given: given
  };
})();
