'use strict';
/* Otázka 2 — modul Helio, simulace, mapa Zedlandu a tabulka naměřených hodnot. */

var Sim = (function () {

  /* Výroba vody za hodinu podle denního slunečního záření (kWh/m²).
     Hodnoty přebíráme z podkladové tabulky, ne ze vzorce: při slabém záření
     (1 a 2) modul vyrábí méně, než by lineární vztah dával. */
  var PER_HOUR = [0, 0.1875, 0.375, 0.625, 0.75, 0.875, 1, 1.125, 1.25];

  var HOURS = [0, 0.5, 1, 1.5, 2];
  var IRR = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  var MAX_ROWS = 12;

  var state = { hours: 1, irradiation: 4 };

  function water(hours, irradiation) {
    return hours * PER_HOUR[irradiation];
  }

  /* Nejvýš tři desetinná místa, bez zbytečných nul, s desetinnou čárkou. */
  function formatWater(v) {
    return Number(v).toFixed(3).replace(/0+$/, '').replace(/\.$/, '').replace('.', ',');
  }

  function num(v) {
    return String(v).replace('.', ',');
  }

  function rows() {
    if (!Array.isArray(answers.q2rows)) answers.q2rows = [];
    return answers.q2rows;
  }

  /* ---------- levý panel: zadání, mapa, škála ---------- */

  var SCALE = ['#2E3BC8', '#7B86D8', '#0A8A2A', '#7BD44F', '#FFE93B',
               '#F5A623', '#E8701A', '#E8231A', '#6B1A3A'];
  var SCALE_TEXT = ['#FFFFFF', '#26215C', '#FFFFFF', '#173404', '#412402',
                    '#412402', '#FFFFFF', '#FFFFFF', '#FFFFFF'];

  var TOWNS = [
    { id: 'A', x: 62,  y: 84,  light: true  },
    { id: 'B', x: 196, y: 150, light: true  },
    { id: 'C', x: 112, y: 182, light: true  },
    { id: 'D', x: 272, y: 250, light: false }
  ];

  function mapSVG() {
    var towns = TOWNS.map(function (t) {
      var on = answers.q2town === t.id;
      return '<g class="town' + (on ? ' selected' : '') + '" data-town="' + t.id + '" ' +
        'role="button" tabindex="0" aria-pressed="' + on + '" aria-label="Město ' + t.id + '">' +
        '<circle class="hit" cx="' + t.x + '" cy="' + t.y + '" r="17"></circle>' +
        '<circle class="dot" cx="' + t.x + '" cy="' + t.y + '" r="6"></circle>' +
        '<text x="' + t.x + '" y="' + (t.y - 13) + '" text-anchor="middle" font-size="15" ' +
        'font-weight="600" fill="' + (t.light ? '#1A1A1A' : '#FFFFFF') + '">' + t.id + '</text>' +
        '</g>';
    }).join('');

    return '<svg class="zedland" viewBox="0 0 300 280" width="100%" role="group" ' +
      'aria-label="Mapa Zedlandu obarvená podle slunečního záření se čtyřmi městy A až D.">' +
      '<rect width="300" height="280" fill="#FFE93B"></rect>' +
      '<path d="M0 0 H128 C116 22 92 32 58 30 C34 28 14 34 0 42 Z" fill="#7BD44F"></path>' +
      '<path d="M0 0 H52 C44 14 24 20 0 22 Z" fill="#0A8A2A"></path>' +
      '<path d="M0 158 C62 136 112 148 152 126 C204 100 252 114 300 104 V280 H0 Z" fill="#F5A623"></path>' +
      '<path d="M150 136 C200 114 252 124 300 114 V280 H120 C132 230 142 178 150 136 Z" fill="#E8701A"></path>' +
      '<path d="M230 168 C262 154 282 156 300 152 V280 H190 C202 232 216 198 230 168 Z" fill="#E8231A"></path>' +
      '<path d="M262 216 C278 208 290 206 300 204 V280 H226 C238 254 250 236 262 216 Z" fill="#6B1A3A"></path>' +
      '<path d="M300 0 H124 C134 32 152 56 152 82 C152 108 178 118 208 110 C242 100 272 114 300 108 Z" fill="#3FE0E8"></path>' +
      '<text x="234" y="54" font-size="14" fill="#0C447C" text-anchor="middle">Zedské moře</text>' +
      towns +
      '<rect x="0.5" y="0.5" width="299" height="279" fill="none" stroke="#5F5E5A"></rect>' +
      '</svg>';
  }

  function scaleHTML() {
    var cells = SCALE.map(function (c, i) {
      return '<span style="background:' + c + ';color:' + SCALE_TEXT[i] + '">' + i + '</span>';
    }).join('');
    return '<p class="scale-label">Dlouhodobý průměr denního slunečního záření (kWh/m²)</p>' +
      '<div class="scale" aria-hidden="true">' + cells + '</div>';
  }

  function leftHTML() {
    return '<p class="eyebrow">Otázka 2 ze 4</p>' +
      '<p>Lucy bydlí v jednom z měst na Zedlandu. Říká, že její rodina koupila jeden modul ' +
      'Helio a ten vyrobil 2 920 litrů pitné vody za rok. Modul pracoval průměrně 8 hodin denně.</p>' +
      '<p class="question">Ve kterém městě Lucy bydlí?</p>' +
      '<ol class="steps">' +
      '<li>Spusť simulaci a získej data.</li>' +
      '<li>Na mapě klikni na město, kde podle tebe Lucy bydlí.</li>' +
      '<li>V tabulce označ řádky, které tvou odpověď podporují.</li>' +
      '</ol>' +
      '<div class="map-wrap">' +
      '<div class="map">' + mapSVG() + '</div>' +
      scaleHTML() +
      '</div>' +
      '<p class="chosen">Vybrané město: <strong id="chosen-town">' +
      (answers.q2town || '—') + '</strong></p>';
  }

  /* ---------- pravý panel: modul, posuvníky, tabulka ---------- */

  /* Kresba modulu i scénář animace: slunce → panel → čerpadlo → přítok mořské vody →
     odpařování → pára → kondenzace na klenbě → kapky stékají → sběrný žlab → odtok
     přes remineralizaci ven. Jednotlivé fáze mají třídy, časování je v CSS. */
  function moduleSVG() {
    var dots = '';
    /* kapičky kondenzátu po vnitřní straně klenby */
    for (var a = 200; a <= 340; a += 14) {
      var rad = a * Math.PI / 180;
      dots += '<circle cx="' + (150 + 42 * Math.cos(rad)).toFixed(1) +
        '" cy="' + (76 + 42 * Math.sin(rad)).toFixed(1) + '" r="1.8" fill="#49A8E8"></circle>';
    }

    return '<svg class="helio" id="helio-svg" viewBox="0 0 260 172" width="100%" role="img" ' +
      'aria-label="Modul Helio: solární panel pohání čerpadlo, mořská voda se v kouli odpařuje, ' +
      'pára kondenzuje na klenbě, kapky stékají do sběrného žlabu a odtékají jako pitná voda.">' +
      '<defs><clipPath id="sphere"><circle cx="150" cy="76" r="46"></circle></clipPath></defs>' +

      /* slunce a paprsky */
      '<circle cx="26" cy="22" r="13" fill="#FFCE3A"></circle>' +
      '<g stroke="#F2A81D" stroke-width="2.2" stroke-linecap="round">' +
      '<path d="M26 2 V0"></path><path d="M6 22 H2"></path><path d="M11 7 L8 4"></path>' +
      '<path d="M41 7 L44 4"></path><path d="M11 37 L8 40"></path></g>' +
      '<path d="M40 30 L96 54" stroke="#FFCE3A" stroke-width="2.2" stroke-linecap="round"></path>' +
      '<path d="M96 54 L87 51 L91 59 Z" fill="#FFCE3A"></path>' +
      '<path d="M28 38 L30 96" stroke="#FFCE3A" stroke-width="2" stroke-dasharray="4 4"></path>' +

      /* koule, voda, sběrný žlab */
      '<circle cx="150" cy="76" r="46" fill="#EDF4FB" stroke="#9FC2E3" stroke-width="1.5"></circle>' +
      '<g clip-path="url(#sphere)">' +
      '<rect x="100" y="94" width="100" height="40" fill="#3B8FE0"></rect>' +
      '<g class="drops">' + dots +
      '<circle class="drop drop-a" cx="112" cy="58" r="2.6" fill="#2D7CD6"></circle>' +
      '<circle class="drop drop-b" cx="188" cy="54" r="2.6" fill="#2D7CD6"></circle>' +
      '</g></g>' +

      /* pára a odpařování */
      '<g class="vapor">' +
      '<path d="M128 52 q-8 0 -8 -7 q0 -7 8 -7 q2 -10 11 -10 q7 -7 15 -2 q10 -4 13 7 q8 1 8 7 ' +
      'q0 7 -8 7 Z" fill="#FFFFFF" stroke="#B9D4EC" stroke-width="1.2"></path>' +
      '<g stroke="#2D7CD6" stroke-width="2" stroke-dasharray="3 3">' +
      '<path d="M132 92 V70"></path><path d="M150 92 V66"></path><path d="M168 92 V70"></path></g>' +
      '<path d="M128 70 L132 64 L136 70 Z" fill="#2D7CD6"></path>' +
      '<path d="M146 66 L150 60 L154 66 Z" fill="#2D7CD6"></path>' +
      '<path d="M164 70 L168 64 L172 70 Z" fill="#2D7CD6"></path>' +
      '</g>' +
      '<path d="M106 80 H126 M174 80 H194" stroke="#1A69B8" stroke-width="5" ' +
      'stroke-linecap="round"></path>' +
      '<text x="150" y="128" font-size="9" text-anchor="middle" fill="#0A3A63">sběrný žlab</text>' +

      /* nohy a podstavec */
      '<path d="M118 112 C110 128 106 140 104 150" stroke="#5E6066" stroke-width="7" ' +
      'stroke-linecap="round" fill="none"></path>' +
      '<path d="M182 112 C190 128 194 140 196 150" stroke="#5E6066" stroke-width="7" ' +
      'stroke-linecap="round" fill="none"></path>' +
      '<ellipse cx="150" cy="150" rx="56" ry="7" fill="none" stroke="#8A8C92" stroke-width="2.5"></ellipse>' +

      /* potrubí: přítok tmavě, odtok světle */
      '<path class="flow-in" d="M60 164 H134 V98" stroke="#1A69B8" stroke-width="5" ' +
      'fill="none" stroke-dasharray="10 6"></path>' +
      '<path d="M0 164 H60" stroke="#1A69B8" stroke-width="5"></path>' +
      '<path class="flow-out" d="M190 82 V164 H230" stroke="#6FB6EE" stroke-width="5" ' +
      'fill="none" stroke-dasharray="10 6"></path>' +
      '<path d="M230 164 H260" stroke="#6FB6EE" stroke-width="5"></path>' +

      /* solární panel, čerpadlo, remineralizace */
      '<rect class="spark" x="10" y="96" width="42" height="28" rx="3" fill="#15396E"></rect>' +
      '<g stroke="#4C6FB0" stroke-width="1.2">' +
      '<path d="M24 96 V124"></path><path d="M38 96 V124"></path><path d="M10 106 H52"></path>' +
      '<path d="M10 115 H52"></path></g>' +
      '<path d="M31 124 V158 H44" stroke="#8A8C92" stroke-width="2" fill="none"></path>' +
      '<rect x="44" y="154" width="36" height="18" rx="3" fill="#5E6066"></rect>' +
      '<text x="48" y="167" font-size="8" fill="#FFFFFF">čerpadlo</text>' +
      '<rect x="196" y="152" width="30" height="20" rx="3" fill="#9FA2A8"></rect>' +
      '<g stroke="#5E6066" stroke-width="2">' +
      '<path d="M203 155 V169"></path><path d="M211 155 V169"></path><path d="M219 155 V169"></path></g>' +
      '<text x="0" y="158" font-size="9" fill="#1A69B8">mořská voda</text>' +
      '<text x="232" y="158" font-size="9" fill="#1A69B8">pitná voda</text>' +
      '<text x="8" y="92" font-size="9" fill="#15396E">solární panel</text>' +
      '</svg>';
  }

  function sliderHTML(id, label, values, current, unit) {
    var ticks = values.map(function (v) {
      return '<button type="button" class="tick' + (v === current ? ' on' : '') +
        '" data-slider="' + id + '" data-value="' + v + '">' + num(v) + '</button>';
    }).join('');
    return '<div class="slider-row">' +
      '<label for="' + id + '">' + label + '</label>' +
      '<div class="slider-body">' +
      '<input type="range" id="' + id + '" min="0" max="' + (values.length - 1) + '" step="1" ' +
      'value="' + values.indexOf(current) + '" aria-label="' + label + '">' +
      '<div class="ticks">' + ticks + '</div></div>' +
      '<output id="' + id + '-out">' + num(current) + (unit || '') + '</output>' +
      '</div>';
  }

  function tableHTML() {
    var body = rows().map(function (r, i) {
      return '<tr class="' + (r.selected ? 'marked' : '') + '">' +
        '<td class="star"><button type="button" class="mark" data-mark="' + i + '" ' +
        'aria-pressed="' + !!r.selected + '" aria-label="Označit řádek ' + (i + 1) + '">' +
        (r.selected ? '★' : '☆') + '</button></td>' +
        '<td>' + num(r.hours) + '</td>' +
        '<td>' + r.irradiation + '</td>' +
        '<td>' + formatWater(r.water) + '</td>' +
        '<td class="del"><button type="button" class="remove" data-del="' + i + '" ' +
        'title="Smazat řádek" aria-label="Smazat řádek ' + (i + 1) + '">' +
        '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">' +
        '<circle cx="11" cy="11" r="9.5" fill="#C62828"></circle>' +
        '<path d="M7.5 7.5 L14.5 14.5 M14.5 7.5 L7.5 14.5" stroke="#fff" stroke-width="2.2" ' +
        'stroke-linecap="round"></path></svg></button></td>' +
        '</tr>';
    }).join('');

    var empty = rows().length ? '' :
      '<tr class="empty"><td colspan="5">Zatím žádná data. Nastav hodnoty a spusť simulaci.</td></tr>';

    return '<table class="data"><thead><tr>' +
      '<th class="star">Označ</th>' +
      '<th>Doba (h)</th><th>Záření</th><th>Voda (l)</th>' +
      '<th class="del">Smazat</th>' +
      '</tr></thead><tbody>' + body + empty + '</tbody></table>';
  }

  function rightHTML() {
    return '<div class="helio-wrap">' + moduleSVG() +
      '<button type="button" class="play" id="play" ' +
      'aria-label="Přehrát, jak modul vyrábí vodu">▶</button></div>' +
      '<p class="hint helio-text">Helio je modul ve tvaru koule, který vyrábí pitnou vodu ' +
      'z mořské vody a pracuje jen na sluneční energii. Množství vody závisí na čase ' +
      'a slunečním záření.</p>' +
      '<div class="sim">' +
      sliderHTML('sim-hours', 'Pracovní doba', HOURS, state.hours, ' h') +
      sliderHTML('sim-irr', 'Sluneční záření', IRR, state.irradiation, '') +
      '<button type="button" class="primary run" id="run">Spustit simulaci</button>' +
      '<p class="sim-note">Simulace ukazuje výrobu nejvýše za 2 hodiny.</p>' +
      '</div>' +
      '<div id="table-wrap">' + tableHTML() + '</div>';
  }

  /* ---------- obsluha ---------- */

  function refreshTable() {
    var wrap = document.getElementById('table-wrap');
    if (wrap) wrap.innerHTML = tableHTML();
  }

  function setSlider(id, value) {
    var values = id === 'sim-hours' ? HOURS : IRR;
    state[id === 'sim-hours' ? 'hours' : 'irradiation'] = value;
    var input = document.getElementById(id);
    if (input) input.value = values.indexOf(value);
    var out = document.getElementById(id + '-out');
    if (out) out.textContent = num(value) + (id === 'sim-hours' ? ' h' : '');
    var ticks = document.querySelectorAll('[data-slider="' + id + '"]');
    Array.prototype.forEach.call(ticks, function (t) {
      t.classList.toggle('on', Number(t.getAttribute('data-value')) === value);
    });
  }

  function play() {
    var svg = document.getElementById('helio-svg');
    if (!svg) return;
    svg.classList.remove('playing');
    void svg.getBoundingClientRect();
    svg.classList.add('playing');
  }

  function selectTown(id) {
    answers.q2town = id;
    var all = document.querySelectorAll('[data-town]');
    Array.prototype.forEach.call(all, function (g) {
      var on = g.getAttribute('data-town') === id;
      g.classList.toggle('selected', on);
      g.setAttribute('aria-pressed', on);
    });
    var out = document.getElementById('chosen-town');
    if (out) out.textContent = id;
  }

  function run() {
    if (rows().length >= MAX_ROWS) rows().shift();
    rows().push({
      hours: state.hours,
      irradiation: state.irradiation,
      water: water(state.hours, state.irradiation),
      selected: false
    });
    refreshTable();
    play();
  }

  /* Jediný delegovaný posluchač — přežije přepisování tabulky. */
  function mount() {
    var panels = document.querySelector('.panels');
    if (!panels || panels.dataset.simBound === '1') { return; }
    panels.dataset.simBound = '1';

    panels.addEventListener('click', function (e) {
      var t = e.target;
      var town = t.closest ? t.closest('[data-town]') : null;
      var tick = t.closest ? t.closest('[data-slider]') : null;
      var mark = t.closest ? t.closest('[data-mark]') : null;
      var del = t.closest ? t.closest('[data-del]') : null;

      if (town) { selectTown(town.getAttribute('data-town')); }
      else if (tick) { setSlider(tick.getAttribute('data-slider'), Number(tick.getAttribute('data-value'))); }
      else if (mark) {
        var i = Number(mark.getAttribute('data-mark'));
        rows()[i].selected = !rows()[i].selected;
        refreshTable();
      }
      else if (del) { rows().splice(Number(del.getAttribute('data-del')), 1); refreshTable(); }
      else if (t.closest && t.closest('#run')) { run(); }
      else if (t.closest && t.closest('#play')) { play(); }
    });

    panels.addEventListener('keydown', function (e) {
      var town = e.target.closest ? e.target.closest('[data-town]') : null;
      if (town && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        selectTown(town.getAttribute('data-town'));
      }
    });

    panels.addEventListener('input', function (e) {
      var id = e.target.id;
      if (id === 'sim-hours' || id === 'sim-irr') {
        var values = id === 'sim-hours' ? HOURS : IRR;
        setSlider(id, values[Number(e.target.value)]);
      }
    });
  }

  return { leftHTML: leftHTML, rightHTML: rightHTML, mount: mount,
           water: water, formatWater: formatWater, PER_HOUR: PER_HOUR };
})();
