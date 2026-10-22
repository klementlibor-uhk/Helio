'use strict';
/* Stav testu. Nic z toho se nikam neposílá ani neukládá — žije to v paměti stránky. */

var answers = {};          /* odpovědi žáka podle klíčů q1, q2town, q2rows, q3, q3text, q4 */
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
  var fixed = Number(value).toFixed(d);
  var parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return parts.join(',');
}

/* Políčko na číselnou odpověď. */
function answerNumber(key, unit, label) {
  return '<div class="answer-row">' +
    '<label for="' + key + '">' + (label || 'Odpověď:') + '</label>' +
    '<input type="text" id="' + key + '" data-answer="' + key + '" inputmode="decimal" ' +
      'autocomplete="off" maxlength="20" value="' + esc(answers[key] || '') + '"' +
      (finished ? ' readonly' : '') + '>' +
    (unit ? '<span class="unit">' + unit + '</span>' : '') +
    '</div>';
}
