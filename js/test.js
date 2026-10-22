'use strict';
/* Řízení testu: režimy, navigace, časomíra. Závěrečné obrazovky má na starosti result.js. */

var Engine = (function () {

  var el = {};
  var mode = 'test';   /* test | review | result | portfolio */
  var timer = null;

  function currentMode() { return mode; }

  function renderProgress() {
    var html = '';
    for (var i = 0; i < QUESTIONS.length; i++) {
      var cls = (mode === 'test' && i < page) || mode !== 'test' ? 'done' : '';
      if (i === page && mode !== 'result' && mode !== 'portfolio') cls = 'now';
      html += '<span class="' + cls + '"></span>';
    }
    el.progress.innerHTML = html;
    el.progress.setAttribute('aria-label', 'Otázka ' + (page + 1) + ' ze ' + QUESTIONS.length);
  }

  function bindAnswers() {
    var fields = el.panels.querySelectorAll('[data-answer]');
    Array.prototype.forEach.call(fields, function (f) {
      var save = function () { answers[f.getAttribute('data-answer')] = f.value; };
      f.addEventListener('input', save);
      f.addEventListener('change', save);
    });
  }

  function footerHTML() {
    var last = page === QUESTIONS.length - 1;
    if (mode === 'test') {
      return '<button data-action="calc" disabled title="Kalkulačka se teprve staví">Kalkulačka</button>' +
        '<button class="spacer" data-action="prev"' + (page === 0 ? ' disabled' : '') + '>Zpět</button>' +
        '<button class="primary" data-action="' + (last ? 'submit' : 'next') + '">' +
        (last ? 'Odevzdat test' : 'Další otázka') + '</button>';
    }
    if (mode === 'review') {
      return '<button data-action="calc" disabled>Kalkulačka</button>' +
        '<button class="spacer" data-action="prev"' + (page === 0 ? ' disabled' : '') + '>Zpět</button>' +
        '<button data-action="next"' + (last ? ' disabled' : '') + '>Další úloha</button>' +
        '<button class="primary" data-action="result">Zpět na výsledek</button>';
    }
    if (mode === 'portfolio') {
      return '<button class="spacer" data-action="result">Zpět na výsledek</button>' +
        '<button class="primary" data-action="print">Vytisknout nebo uložit jako PDF</button>';
    }
    return '<button class="spacer" data-action="home">Zpět na úvodní stránku</button>';
  }

  /* Jedna otázka — v testu i v prohlížení odpovědí. */
  function renderQuestion() {
    var q = QUESTIONS[page];
    el.panels.className = 'panels' + (mode === 'review' ? ' review' : '');
    el.right.hidden = false;
    el.left.innerHTML = (mode === 'review' ? '<p class="review-flag">Prohlížení odpovědí</p>' : '') +
      q.left() + (mode === 'review' ? Result.solutionHTML(page) : '');
    el.right.innerHTML = q.right();
    el.left.scrollTop = 0;
    el.right.scrollTop = 0;
    bindAnswers();
    if (typeof q.mount === 'function') q.mount();
    renderProgress();
    el.footer.innerHTML = footerHTML();
  }

  /* Celostránkový obsah — výsledek a tisk do portfolia. */
  function renderWide(html) {
    el.panels.className = 'panels single';
    el.right.hidden = true;
    el.right.innerHTML = '';
    el.left.innerHTML = html;
    el.left.scrollTop = 0;
    renderProgress();
    el.footer.innerHTML = footerHTML();
  }

  function setMode(next, index) {
    mode = next;
    if (typeof index === 'number') page = index;
    if (mode === 'test' || mode === 'review') renderQuestion();
    else if (mode === 'result') renderWide(Result.resultHTML());
    else if (mode === 'portfolio') renderWide(Result.portfolioHTML());
  }

  function go(delta) {
    page = Math.min(QUESTIONS.length - 1, Math.max(0, page + delta));
    renderQuestion();
  }

  function stopClock() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function finish() {
    finished = true;
    stopClock();
    setMode('result');
  }

  function onFooterClick(e) {
    var btn = e.target.closest ? e.target.closest('[data-action]') : null;
    if (!btn || btn.disabled) return;
    var action = btn.getAttribute('data-action');

    if (action === 'prev') go(-1);
    else if (action === 'next') go(1);
    else if (action === 'submit') Result.confirmSubmit(finish);
    else if (action === 'result') setMode('result');
    else if (action === 'review') setMode('review', Number(btn.getAttribute('data-q')));
    else if (action === 'portfolio') setMode('portfolio');
    else if (action === 'print') window.print();
    else if (action === 'home') location.href = 'index.html';
    else if (action === 'restart') location.reload();
  }

  function tick() {
    elapsed += 1;
    el.clock.textContent = formatTime(elapsed);
  }

  document.addEventListener('DOMContentLoaded', function () {
    el.panels = document.querySelector('.panels');
    el.left = document.getElementById('panel-left');
    el.right = document.getElementById('panel-right');
    el.progress = document.getElementById('progress');
    el.clock = document.getElementById('clock');
    el.footer = document.getElementById('footer');

    el.footer.addEventListener('click', onFooterClick);
    el.panels.addEventListener('click', onFooterClick);

    var name = Profile.read();
    if (name) document.getElementById('pupil').textContent = name;

    el.clock.textContent = formatTime(0);
    timer = setInterval(tick, 1000);
    setMode('test', 0);
  });

  return { setMode: setMode, mode: currentMode, stopClock: stopClock, el: el };
})();
