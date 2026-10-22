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
      '<p class="hint">Spusť simulaci, klikni na mapě na jedno město a v tabulce označ řádky, ' +
      'které tvou odpověď podporují.</p>' +
      '<div class="map">' + mapSVG() + '</div>' +
      scaleHTML() +
      '<p class="chosen">Vybrané město: <strong id="chosen-town">' +
      (answers.q2town || '—') + '</strong></p>';
  }

  /* ---------- pravý panel: modul, posuvníky, tabulka ---------- */

  function moduleSVG() {
    return '<svg class="helio" id="helio-svg" viewBox="0 0 240 150" width="100%" role="img" ' +
      'aria-label="Modul Helio: mořská voda se v kouli odpařuje a odtéká jako pitná voda.">' +
      '<defs><clipPath id="sphere"><circle cx="120" cy="66" r="44"></circle></clipPath></defs>' +
      '<circle cx="24" cy="24" r="13" fill="#FFCE3A"></circle>' +
      '<g stroke="#F2A81D" stroke-width="2.2" stroke-linecap="round">' +
      '<path d="M24 4 V0"></path><path d="M4 24 H0"></path><path d="M9 9 L6 6"></path>' +
      '<path d="M39 9 L42 6"></path><path d="M9 39 L6 42"></path></g>' +
      '<path d="M40 30 L74 46" stroke="#FFCE3A" stroke-width="2.2" stroke-linecap="round"></path>' +
      '<circle cx="120" cy="66" r="44" fill="#EDF4FB" stroke="#9FC2E3" stroke-width="1.4"></circle>' +
      '<g clip-path="url(#sphere)"><g class="level">' +
      '<rect x="74" y="70" width="92" height="60" fill="#3B8FE0"></rect></g></g>' +
      '<g class="vapor">' +
      '<path d="M102 56 q-7 0 -7 -6 q0 -6 7 -6 q2 -9 10 -9 q6 -6 13 -2 q9 -3 12 6 q7 1 7 6 ' +
      'q0 6 -7 6 Z" fill="#FFFFFF" stroke="#B9D4EC"></path>' +
      '<g stroke="#2D7CD6" stroke-width="1.8" stroke-dasharray="3 3">' +
      '<path d="M104 70 V61"></path><path d="M120 70 V59"></path><path d="M136 70 V61"></path></g>' +
      '</g>' +
      '<rect x="74" y="68" width="92" height="5" rx="2" fill="#1A69B8"></rect>' +
      '<path d="M96 73 C88 96 84 112 82 124" stroke="#5E6066" stroke-width="6.5" ' +
      'stroke-linecap="round" fill="none"></path>' +
      '<path d="M144 73 C152 96 156 112 158 124" stroke="#5E6066" stroke-width="6.5" ' +
      'stroke-linecap="round" fill="none"></path>' +
      '<ellipse cx="120" cy="124" rx="55" ry="7" fill="none" stroke="#8A8C92" stroke-width="2.5"></ellipse>' +
      '<path d="M110 73 V142" stroke="#2D7CD6" stroke-width="5"></path>' +
      '<path d="M132 73 V142" stroke="#6FB6EE" stroke-width="5"></path>' +
      '<path d="M0 142 H240" stroke="#2D7CD6" stroke-width="5"></path>' +
      '<path d="M132 142 H240" stroke="#6FB6EE" stroke-width="5"></path>' +
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
        'aria-label="Smazat řádek ' + (i + 1) + '">−</button></td>' +
        '</tr>';
    }).join('');

    var empty = rows().length ? '' :
      '<tr class="empty"><td colspan="5">Zatím žádná data. Nastav hodnoty a spusť simulaci.</td></tr>';

    return '<table class="data"><thead><tr>' +
      '<th><span class="sr-only">Označení</span></th>' +
      '<th>Doba (h)</th><th>Záření</th><th>Voda (l)</th>' +
      '<th><span class="sr-only">Smazat</span></th>' +
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
