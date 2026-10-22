'use strict';
/* Stav testu. Nic z toho se nikam neposílá ani neukládá — žije to jen v paměti stránky. */

var answers = {};          /* odpovědi žáka: q1, q2town, q2rows, q3, q3text, q4 */
var page = 0;              /* index zobrazené otázky */
var finished = false;      /* po odevzdání */
var elapsed = 0;           /* uplynulé sekundy */

function esc(s) {
  return String(s === null || s === undefined ? '' : s)
    .replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

/* 00:00 */
function formatTime(sec) {
  var m = Math.floor(sec / 60), s = sec % 60;
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

/* Číslo po česku: mezery po tisících, desetinná čárka. */
function formatNumber(value, decimals) {
  var d = decimals === undefined ? 0 : decimals;
  var parts = Number(value).toFixed(d).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join(',');
}

/* Odpověď má vlastní ohraničený blok, aby byla jasně oddělená od zadání. */
function answerBlock(inner) {
  return '<div class="answer-block"><p class="answer-title">Odpověď</p>' + inner + '</div>';
}

/* Číselná odpověď s jednotkou. Popisek nese nadpis bloku, nemusí být dvakrát. */
function answerNumber(key, unit) {
  return '<div class="answer-row">' +
    '<input type="text" id="' + key + '" data-answer="' + key + '" inputmode="decimal" ' +
    'autocomplete="off" maxlength="20" aria-label="Odpověď" value="' + esc(answers[key] || '') + '"' +
    (finished ? ' readonly' : '') + '>' +
    (unit ? '<span class="unit">' + unit + '</span>' : '') +
    '</div>';
}

/* Rozbalovací nabídka. Výchozí položka říká, co se má udělat. */
function answerSelect(key, options) {
  var opts = options.map(function (o) {
    return '<option value="' + o.value + '"' +
      (answers[key] === o.value ? ' selected' : '') + '>' + o.text + '</option>';
  }).join('');
  return '<select id="' + key + '" data-answer="' + key + '" aria-label="Odpověď"' +
    (finished ? ' disabled' : '') + '>' +
    '<option value=""' + (answers[key] ? '' : ' selected') + '>Vyber jednu možnost</option>' +
    opts + '</select>';
}

/* Volná odpověď textem. */
function answerText(key, label, placeholder, note) {
  return '<label class="text-label" for="' + key + '">' + label + '</label>' +
    '<textarea id="' + key + '" data-answer="' + key + '" rows="4" ' +
    'placeholder="' + esc(placeholder || '') + '"' +
    (finished ? ' readonly' : '') + '>' + esc(answers[key] || '') + '</textarea>' +
    (note ? '<p class="hint small">' + note + '</p>' : '');
}
