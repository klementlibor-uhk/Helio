'use strict';
// Jméno žáka žije jen v této záložce prohlížeče. Žádné cookies, žádné odesílání.
window.Profile = {
  read: function () {
    try { return (sessionStorage.getItem('helio-name') || '').slice(0, 60); }
    catch (e) { return ''; }
  },
  save: function (value) {
    try { sessionStorage.setItem('helio-name', String(value || '').trim().slice(0, 60)); }
    catch (e) { /* soukromé okno nebo zakázané úložiště — nevadí */ }
  }
};

(function () {
  var field = document.getElementById('pupil-name');
  if (!field) return;
  field.value = Profile.read();
  field.addEventListener('input', function () { Profile.save(field.value); });
})();
