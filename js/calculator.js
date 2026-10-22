'use strict';
/* Kalkulačka s českým zápisem: desetinná čárka, násobení ·, dělení :, mínus −.
   Počítá vlastním parserem, nikoli funkcí eval. */

var Calculator = (function () {

  var box = null;
  var expr = '';       /* zapsaný výraz v české notaci */
  var result = '';     /* výsledek posledního = */

  var KEYS = [
    ['C', 'back', '(', ')'],
    ['x2', 'sqrt', '1/x', 'pi'],
    ['7', '8', '9', ':'],
    ['4', '5', '6', '·'],
    ['1', '2', '3', '−'],
    ['0', ',', '+-', '+']
  ];

  var LABELS = {
    'C': 'C', 'back': '←', 'x2': 'x²', 'sqrt': '√x',
    '1/x': '1/x', 'pi': 'π', '+-': '±'
  };

  /* ---------- počítání ---------- */

  function evaluate(src) {
    var s = String(src)
      .replace(/[\s ]/g, '')
      .replace(/,/g, '.')
      .replace(/·/g, '*')
      .replace(/:/g, '/')
      .replace(/−/g, '-');
    var i = 0;

    function peek() { return s.charAt(i); }

    function primary() {
      if (peek() === '(') {
        i++;
        var v = expression();
        if (peek() === ')') i++;
        return v;
      }
      var start = i;
      while (i < s.length && /[0-9.]/.test(s.charAt(i))) i++;
      if (start === i) throw new Error('chyba');
      return Number(s.slice(start, i));
    }

    function unary() {
      if (peek() === '-') { i++; return -unary(); }
      if (peek() === '+') { i++; return unary(); }
      return primary();
    }

    function term() {
      var v = unary();
      while (peek() === '*' || peek() === '/') {
        var op = s.charAt(i++);
        var r = unary();
        v = op === '*' ? v * r : v / r;
      }
      return v;
    }

    function expression() {
      var v = term();
      while (peek() === '+' || peek() === '-') {
        var op = s.charAt(i++);
        var r = term();
        v = op === '+' ? v + r : v - r;
      }
      return v;
    }

    var value = expression();
    if (i < s.length) throw new Error('chyba');
    return value;
  }

  /* Výsledek po česku: mezery po tisících, desetinná čárka, bez balastních nul. */
  function formatResult(v) {
    if (!isFinite(v)) return 'chyba';
    /* toPrecision srovná plovoucí ocasy typu 3661679,999999999 */
    var clean = Number(v.toPrecision(12));
    var parts = String(clean).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join(',');
  }

  /* ---------- obsluha kláves ---------- */

  /* Funkce jako x² nebo √x se počítají hned nad posledním číslem výrazu. */
  function applyToLast(fn) {
    var m = expr.match(/(\d+(?:,\d+)?)$/);
    if (!m) return;
    var n = Number(m[1].replace(',', '.'));
    var out = fn(n);
    if (!isFinite(out)) { expr = ''; result = 'chyba'; return; }
    expr = expr.slice(0, expr.length - m[1].length) + formatResult(out).replace(/ /g, '');
  }

  function press(key) {
    if (key === 'C') { expr = ''; result = ''; }
    else if (key === 'back') { expr = expr.slice(0, -1); }
    else if (key === '=') {
      try { result = formatResult(evaluate(expr)); }
      catch (e) { result = 'chyba'; }
    }
    else if (key === 'x2') applyToLast(function (n) { return n * n; });
    else if (key === 'sqrt') applyToLast(function (n) { return n < 0 ? NaN : Math.sqrt(n); });
    else if (key === '1/x') applyToLast(function (n) { return n === 0 ? NaN : 1 / n; });
    else if (key === 'pi') expr += '3,14159265';
    else if (key === '+-') applyToLast(function (n) { return -n; });
    else expr += key;
    draw();
  }

  /* ---------- okno ---------- */

  function keysHTML() {
    return KEYS.map(function (row) {
      return row.map(function (k) {
        var cls = /^[0-9]$/.test(k) ? 'digit' : (k === ',' ? 'digit' : 'op');
        var special = (k === ':' || k === '·' || k === ',') ? ' cz' : '';
        return '<button type="button" class="' + cls + special + '" data-key="' + k + '">' +
          (LABELS[k] || k) + '</button>';
      }).join('');
    }).join('') +
    '<button type="button" class="eq" data-key="=">=</button>';
  }

  function draw() {
    if (!box) return;
    box.querySelector('.calc-expr').textContent = expr || ' ';
    box.querySelector('.calc-result').textContent = result || (expr ? ' ' : '0');
  }

  function dragFrom(handle) {
    handle.addEventListener('mousedown', function (e) {
      e.preventDefault();
      var r = box.getBoundingClientRect();
      var dx = e.clientX - r.left, dy = e.clientY - r.top;
      function move(ev) {
        box.style.left = Math.max(0, Math.min(window.innerWidth - r.width, ev.clientX - dx)) + 'px';
        box.style.top = Math.max(0, Math.min(window.innerHeight - r.height, ev.clientY - dy)) + 'px';
        box.style.right = 'auto';
        box.style.bottom = 'auto';   /* jinak zustane ukotveny spodek a okno se roztahne */
      }
      function up() {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      }
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });
  }

  function onKeydown(e) {
    if (!box) return;
    var k = e.key;
    if (/^[0-9]$/.test(k)) press(k);
    else if (k === ',' || k === '.') press(',');
    else if (k === '+') press('+');
    else if (k === '-') press('−');
    else if (k === '*' || k === 'x' || k === 'X') press('·');
    else if (k === '/') press(':');
    else if (k === '(' || k === ')') press(k);
    else if (k === 'Enter' || k === '=') press('=');
    else if (k === 'Backspace') press('back');
    else if (k === 'Escape') close();
    else return;
    e.preventDefault();
  }

  function close() {
    if (!box) return;
    document.removeEventListener('keydown', onKeydown);
    document.body.removeChild(box);
    box = null;
  }

  function open() {
    if (box) { close(); return; }
    box = document.createElement('div');
    box.className = 'calc';
    box.innerHTML =
      '<div class="calc-bar"><span class="grip" aria-hidden="true">✥</span>' +
      '<span class="calc-title">Kalkulačka</span>' +
      '<button type="button" class="calc-close" data-key="close" aria-label="Zavřít kalkulačku">×</button></div>' +
      '<div class="calc-screen"><div class="calc-expr"> </div><div class="calc-result">0</div></div>' +
      '<div class="calc-keys">' + keysHTML() + '</div>' +
      '<p class="calc-note">Desetinná čárka, násobení · a dělení : jako v sešitě. ' +
      'Psát jde i klávesnicí počítače.</p>';

    box.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-key]') : null;
      if (!b) return;
      if (b.getAttribute('data-key') === 'close') close();
      else press(b.getAttribute('data-key'));
    });

    /* Každé otevření začíná načisto. Zbytek starého výpočtu by se nalepil
       na nově psané číslo a žák by si toho nemusel všimnout. */
    expr = '';
    result = '';

    document.body.appendChild(box);
    dragFrom(box.querySelector('.calc-bar'));
    document.addEventListener('keydown', onKeydown);
    draw();
  }

  return { open: open, close: close, evaluate: evaluate, formatResult: formatResult };
})();
