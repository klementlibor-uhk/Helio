'use strict';
(function () {
  var leftEl, rightEl, progressEl, clockEl, prevBtn, nextBtn, panelsEl;

  function renderProgress() {
    var html = '';
    for (var i = 0; i < QUESTIONS.length; i++) {
      var cls = i < page ? 'done' : (i === page ? 'now' : '');
      html += '<span class="' + cls + '"></span>';
    }
    progressEl.innerHTML = html;
    progressEl.setAttribute('aria-label', 'Otázka ' + (page + 1) + ' ze ' + QUESTIONS.length);
  }

  function bindAnswers() {
    var fields = panelsEl.querySelectorAll('[data-answer]');
    Array.prototype.forEach.call(fields, function (el) {
      var save = function () { answers[el.getAttribute('data-answer')] = el.value; };
      el.addEventListener('input', save);
      el.addEventListener('change', save);
    });
  }

  function render() {
    var q = QUESTIONS[page];
    leftEl.innerHTML = q.left();
    rightEl.innerHTML = q.right();
    leftEl.scrollTop = 0;
    rightEl.scrollTop = 0;
    bindAnswers();
    renderProgress();
    prevBtn.disabled = page === 0;
    nextBtn.textContent = page === QUESTIONS.length - 1 ? 'Odevzdat test' : 'Další otázka';
  }

  /* Provizorní závěr — skutečná výsledková obrazovka se teprve staví. */
  function submit() {
    finished = true;
    var r = Scoring.score(answers);
    leftEl.innerHTML = '<p class="eyebrow">Hotovo</p>' +
      '<h2>' + Scoring.grade(r.total) + '</h2>' +
      '<p>Získal jsi <strong>' + r.total + ' z ' + r.max + ' bodů</strong>.</p>' +
      '<p class="hint">Čas řešení ' + formatTime(elapsed) + '.</p>';
    rightEl.innerHTML = '<div class="placeholder">Výsledková obrazovka, prohlížení odpovědí ' +
      's vysvětlením a tisk do portfolia se teprve staví. Tohle je jen provizorní shrnutí, ' +
      'aby se dal test proklikat celý.</div>';
    prevBtn.disabled = true;
    nextBtn.disabled = true;
  }

  function go(delta) {
    if (page === QUESTIONS.length - 1 && delta > 0) { submit(); return; }
    page = Math.min(QUESTIONS.length - 1, Math.max(0, page + delta));
    render();
  }

  function tick() {
    elapsed += 1;
    clockEl.textContent = formatTime(elapsed);
  }

  document.addEventListener('DOMContentLoaded', function () {
    panelsEl = document.querySelector('.panels');
    leftEl = document.getElementById('panel-left');
    rightEl = document.getElementById('panel-right');
    progressEl = document.getElementById('progress');
    clockEl = document.getElementById('clock');
    prevBtn = document.getElementById('prev');
    nextBtn = document.getElementById('next');

    prevBtn.addEventListener('click', function () { go(-1); });
    nextBtn.addEventListener('click', function () { go(1); });

    var name = Profile.read();
    if (name) document.getElementById('pupil').textContent = name;

    clockEl.textContent = formatTime(0);
    setInterval(tick, 1000);
    render();
  });
})();
