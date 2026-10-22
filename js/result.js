'use strict';
/* Závěr testu: potvrzení odevzdání, výsledek, prohlížení odpovědí a tisk do portfolia. */

var Result = (function () {

  var TITLES = [
    'Přístup k pitné vodě',
    'Kde bydlí Lucy',
    'Kamiony s krabicemi',
    'Splátka bance'
  ];

  var SOLUTIONS = [
    '<strong>840 milionů.</strong> Přímý přístup mají kategorie Bez rizika (71 %) ' +
    'a Základní (17 %), dohromady 88 %. Zbývá 12 %, a 12 % ze 7 000 milionů je 840 milionů.',

    '<strong>Město B.</strong> Při záření 6 kWh/m² vyrobí modul 1 litr za hodinu, tedy ' +
    '8 litrů za den a 2 920 litrů za rok. Jako důkaz stačí označit libovolný řádek se ' +
    'zářením 6. Ostatní města mají jiné záření: A má 4 (2 190 litrů za rok), C má 5 ' +
    '(2 555 litrů) a D má 8 (3 650 litrů).',

    '<strong>Kamion s návěsem II</strong> — vejde se do něj 27 modulů proti 24. Krabice ' +
    'musí stát touto stranou nahoru, takže do výšky 300 cm jdou tři vrstvy po 95 cm. ' +
    'Podél délky se krabice postaví rozměrem 159 cm: do návěsu 7,7 m jdou čtyři, ' +
    'do návěsu 8,2 m pět. Objem mají oba kamiony stejný, rozhoduje rozdělení délky. ' +
    'Malé krabice se vejdou do zbylého pruhu vedle velkých.',

    '<strong>15 257 zedů.</strong> 29 200 hl je 2 920 000 litrů, krát 0,08 zedu dá ' +
    '233 600 zedů ročně. Za 15 let je to 3 504 000 zedů, což je výše půjčky. Bance se ' +
    'zaplatí o 4,5 % víc, tedy 3 661 680 zedů, a to děleno 240 měsíci vychází 15 257 zedů.'
  ];

  var CHOICES = { I: 'Kamion s návěsem I', II: 'Kamion s návěsem II',
                  stejne: 'Oba typy jsou stejně výhodné' };

  /* ---------- pomocné ---------- */

  function points() {
    var s = Scoring.score(answers);
    return [s.q1, s.q2, s.q3, s.q4];
  }

  function maxPoints() { return [1, 2, 1, 1]; }

  /* Co je vyplněné — u otázky 2 a 3 má odpověď dvě části. */
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

  /* Co žák odpověděl, lidsky. */
  function given(i) {
    if (i === 0) return answers.q1 ? esc(answers.q1) + ' milionů' : null;
    if (i === 1) {
      if (!answers.q2town && !Scoring.markedRows(answers.q2rows).length) return null;
      return 'město ' + esc(answers.q2town || '—') + ', označené řádky: ' + esc(markedList());
    }
    if (i === 2) {
      if (!answers.q3) return null;
      return esc(CHOICES[answers.q3] || answers.q3);
    }
    if (i === 3) return answers.q4 ? esc(answers.q4) + ' zedů' : null;
    return null;
  }

  /* ---------- potvrzení odevzdání ---------- */

  function confirmSubmit(onYes) {
    var missing = incomplete();
    var text = missing.length
      ? 'V ' + missing.length + ' ze 4 úloh chybí odpověď nebo její část. ' +
        'Chceš test přesto odevzdat?'
      : 'Všechny úlohy máš vyplněné. Po odevzdání už odpovědi nepůjde měnit.';

    var back = document.createElement('div');
    back.className = 'modal-back';
    back.innerHTML = '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="mt">' +
      '<h2 id="mt">Odevzdat test?</h2><p>' + text + '</p>' +
      '<div class="modal-actions">' +
      '<button data-modal="no">Vrátit se k testu</button>' +
      '<button class="primary" data-modal="yes">Odevzdat</button>' +
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

  /* ---------- výsledek ---------- */

  function resultHTML() {
    var p = points(), max = maxPoints();
    var total = p.reduce(function (a, b) { return a + b; }, 0);
    var maxTotal = max.reduce(function (a, b) { return a + b; }, 0);
    var pct = Math.round(total / maxTotal * 1000) / 10;
    var name = Profile.read();

    var list = TITLES.map(function (t, i) {
      var ok = p[i] === max[i];
      var part = p[i] > 0 && p[i] < max[i];
      var label = ok ? 'Správně' : (part ? 'Částečně' : 'Nesprávně');
      var cls = ok ? 'ok' : (part ? 'part' : 'bad');
      return '<li><button type="button" data-action="review" data-q="' + i + '">' +
        '<span class="n">' + (i + 1) + '</span>' +
        '<span class="t">' + t + '</span>' +
        '<span class="badge ' + cls + '">' + label + '</span>' +
        '<span class="pts">' + p[i] + '/' + max[i] + '</span></button></li>';
    }).join('');

    return '<div class="result">' +
      '<p class="eyebrow">Pitná voda — výsledek</p>' +
      '<h1>' + Scoring.grade(total) + '</h1>' +
      (name ? '<p class="who">' + esc(name) + '</p>' : '') +
      '<div class="score-row">' +
      '<div class="score"><strong>' + total + ' / ' + maxTotal + '</strong><span>získaných bodů</span></div>' +
      '<div class="score"><strong>' + String(pct).replace('.', ',') + ' %</strong><span>úspěšnost</span></div>' +
      '<div class="score"><strong>' + formatTime(elapsed) + '</strong><span>čas řešení</span></div>' +
      '</div>' +
      '<p class="hint">Klikni na úlohu a prohlédni si svou odpověď i vysvětlení.</p>' +
      '<ul class="qlist">' + list + '</ul>' +
      '<div class="result-actions">' +
      '<button class="primary" data-action="portfolio">Vytiskni své odpovědi</button>' +
      '<button data-action="home">Zpět na úvodní stránku</button>' +
      '<button data-action="restart">Nový pokus</button>' +
      '</div></div>';
  }

  /* ---------- vysvětlení pod otázkou v prohlížení ---------- */

  function solutionHTML(i) {
    var p = points()[i], max = maxPoints()[i];
    var g = given(i);
    return '<div class="solution">' +
      '<p class="sol-head">Správná odpověď <span class="pts">' + p + '/' + max + ' bodu</span></p>' +
      '<p>' + SOLUTIONS[i] + '</p>' +
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
    var name = Profile.read();
    var date = new Date().toLocaleDateString('cs-CZ');

    var items = TITLES.map(function (t, i) {
      var ok = p[i] === max[i];
      var part = p[i] > 0 && p[i] < max[i];
      var cls = ok ? 'ok' : (part ? 'part' : 'bad');
      var label = ok ? 'Správně' : (part ? 'Částečně' : 'Nesprávně');
      var g = given(i);
      return '<section class="pf-item">' +
        '<h2>' + (i + 1) + '. ' + t +
        ' <span class="badge ' + cls + '">' + label + ' · ' + p[i] + '/' + max[i] + '</span></h2>' +
        '<p class="pf-given"><span>Moje odpověď:</span> ' + (g || '<em>bez odpovědi</em>') + '</p>' +
        (i === 2 && answers.q3text
          ? '<p class="pf-given"><span>Moje vysvětlení:</span> ' + esc(answers.q3text) + '</p>'
          : '') +
        '<p class="pf-sol">' + SOLUTIONS[i] + '</p>' +
        '</section>';
    }).join('');

    return '<div class="portfolio">' +
      '<p class="eyebrow">Moje práce do portfolia</p>' +
      '<h1>Pitná voda</h1>' +
      '<p class="meta">' + (name ? esc(name) + ' · ' : '') + total + ' z ' + maxTotal +
      ' bodů · čas řešení ' + formatTime(elapsed) + ' · ' + date + '</p>' +
      '<p class="hint no-print">Stránka je připravená k tisku. V tiskovém okně můžeš vypnout ' +
      'záhlaví a zápatí prohlížeče.</p>' +
      items + '</div>';
  }

  return {
    confirmSubmit: confirmSubmit,
    resultHTML: resultHTML,
    solutionHTML: solutionHTML,
    portfolioHTML: portfolioHTML,
    incomplete: incomplete,
    given: given
  };
})();
