'use strict';
/* Nápověda pod otazníkem. Čtyři oddíly, které odpovídají tomu, co test opravdu
   obsahuje: pohyb v testu, způsoby odpovídání, simulace a přehled vzorců.
   Struktura vychází z nápovědy PISA, texty jsou napsané na naše ovládací prvky. */

var Help = (function () {

  var box = null;

  function fig(svg) {
    return '<span class="fig">' + svg + '</span>';
  }

  var ICON = {
    next: '<svg viewBox="0 0 24 18" width="30" height="22"><rect x="1" y="1" width="22" height="16" rx="3" fill="#2E6DB4"/><path d="M9 5 l6 4 -6 4 Z" fill="#fff"/></svg>',
    prev: '<svg viewBox="0 0 24 18" width="30" height="22"><rect x="1" y="1" width="22" height="16" rx="3" fill="#B9C6D4"/><path d="M15 5 l-6 4 6 4 Z" fill="#fff"/></svg>',
    progress: '<svg viewBox="0 0 60 12" width="60" height="12"><rect x="0" y="2" width="12" height="8" rx="2" fill="#7E8C99"/><rect x="16" y="2" width="12" height="8" rx="2" fill="#2E6DB4"/><rect x="32" y="2" width="12" height="8" rx="2" fill="#B9C6D4"/><rect x="48" y="2" width="12" height="8" rx="2" fill="#B9C6D4"/></svg>',
    clock: '<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="9" fill="none" stroke="#5F5E5A" stroke-width="2"/><path d="M12 7 v5 l3 2" fill="none" stroke="#5F5E5A" stroke-width="2"/></svg>',
    field: '<svg viewBox="0 0 48 20" width="44" height="20"><rect x="1" y="1" width="46" height="18" rx="4" fill="#fff" stroke="#B9C6D4"/><path d="M8 5 v10" stroke="#2C2C2A" stroke-width="1.5"/></svg>',
    select: '<svg viewBox="0 0 48 20" width="44" height="20"><rect x="1" y="1" width="46" height="18" rx="4" fill="#fff" stroke="#B9C6D4"/><path d="M36 8 l4 4 4 -4" fill="none" stroke="#5F5E5A" stroke-width="2"/></svg>',
    area: '<svg viewBox="0 0 48 28" width="44" height="26"><rect x="1" y="1" width="46" height="26" rx="4" fill="#fff" stroke="#B9C6D4"/><path d="M7 9 h22 M7 15 h30 M7 21 h16" stroke="#B9C6D4" stroke-width="2"/></svg>',
    pin: '<svg viewBox="0 0 30 26" width="30" height="26"><rect width="30" height="26" rx="3" fill="#F5A623"/><circle cx="15" cy="14" r="5" fill="#fff" stroke="#185FA5" stroke-width="3"/><text x="15" y="8" font-size="8" text-anchor="middle" fill="#1A1A1A" font-family="sans-serif">B</text></svg>',
    slider: '<svg viewBox="0 0 60 20" width="60" height="20"><path d="M3 12 h54" stroke="#B9C6D4" stroke-width="4" stroke-linecap="round"/><circle cx="34" cy="12" r="7" fill="#2E6DB4"/><text x="3" y="6" font-size="7" fill="#5F5E5A" font-family="sans-serif">0</text><text x="50" y="6" font-size="7" fill="#5F5E5A" font-family="sans-serif">8</text></svg>',
    star: '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 3 l2.6 5.6 6 .8 -4.4 4.3 1.1 6.1 -5.3 -2.9 -5.3 2.9 1.1 -6.1 -4.4 -4.3 6 -.8 Z" fill="#639922"/></svg>',
    minus: '<svg viewBox="0 0 22 22" width="22" height="22"><circle cx="11" cy="11" r="9.5" fill="#C62828"/><path d="M7.5 7.5 L14.5 14.5 M14.5 7.5 L7.5 14.5" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="10" fill="#2E6DB4"/><path d="M10 8 l6 4 -6 4 Z" fill="#fff"/></svg>'
  };

  var SHAPE = {
    pyth: '<svg viewBox="0 0 44 34"><polygon points="6,28 6,8 34,28" fill="#E6F1FB" stroke="#2E6DB4"/><text x="2" y="20" font-size="9" fill="#2C2C2A" font-family="sans-serif">a</text><text x="19" y="33" font-size="9" fill="#2C2C2A" font-family="sans-serif">b</text><text x="22" y="15" font-size="9" fill="#2C2C2A" font-family="sans-serif">c</text></svg>',
    rect: '<svg viewBox="0 0 44 34"><rect x="6" y="10" width="30" height="18" fill="#E6F1FB" stroke="#2E6DB4"/><text x="19" y="33" font-size="9" fill="#2C2C2A" font-family="sans-serif">a</text><text x="39" y="22" font-size="9" fill="#2C2C2A" font-family="sans-serif">b</text></svg>',
    tri: '<svg viewBox="0 0 44 34"><polygon points="6,28 38,28 24,8" fill="#E6F1FB" stroke="#2E6DB4"/><path d="M24 8 v20" stroke="#2E6DB4" stroke-dasharray="3 2"/><text x="26" y="20" font-size="9" fill="#2C2C2A" font-family="sans-serif">v</text><text x="19" y="33" font-size="9" fill="#2C2C2A" font-family="sans-serif">b</text></svg>',
    circ: '<svg viewBox="0 0 44 34"><circle cx="22" cy="18" r="12" fill="#E6F1FB" stroke="#2E6DB4"/><path d="M22 18 h12" stroke="#2E6DB4"/><text x="26" y="15" font-size="9" fill="#2C2C2A" font-family="sans-serif">r</text></svg>',
    cuboid: '<svg viewBox="0 0 44 34"><polygon points="6,14 14,8 38,8 30,14" fill="#CFE4F7" stroke="#2E6DB4"/><polygon points="30,14 38,8 38,22 30,28" fill="#B5D4F4" stroke="#2E6DB4"/><rect x="6" y="14" width="24" height="14" fill="#E6F1FB" stroke="#2E6DB4"/><text x="16" y="33" font-size="9" fill="#2C2C2A" font-family="sans-serif">a</text><text x="0" y="23" font-size="9" fill="#2C2C2A" font-family="sans-serif">c</text><text x="33" y="25" font-size="9" fill="#2C2C2A" font-family="sans-serif">b</text></svg>',
    cyl: '<svg viewBox="0 0 44 34"><path d="M10 10 v16 a12 5 0 0 0 24 0 v-16" fill="#E6F1FB" stroke="#2E6DB4"/><ellipse cx="22" cy="10" rx="12" ry="5" fill="#CFE4F7" stroke="#2E6DB4"/><path d="M22 10 h12" stroke="#2E6DB4"/><text x="26" y="8" font-size="9" fill="#2C2C2A" font-family="sans-serif">r</text><text x="36" y="22" font-size="9" fill="#2C2C2A" font-family="sans-serif">v</text></svg>',
    sphere: '<svg viewBox="0 0 44 34"><circle cx="22" cy="18" r="13" fill="#E6F1FB" stroke="#2E6DB4"/><ellipse cx="22" cy="18" rx="13" ry="5" fill="none" stroke="#9FC2E3" stroke-dasharray="3 2"/><path d="M22 18 h13" stroke="#2E6DB4"/><text x="27" y="15" font-size="9" fill="#2C2C2A" font-family="sans-serif">r</text></svg>'
  };

  function row(icon, title, text) {
    return '<div class="help-row">' + fig(icon) +
      '<div><p class="help-row-title">' + title + '</p><p>' + text + '</p></div></div>';
  }

  function formulaRow(shape, popis, vzorec) {
    return '<tr><td class="shape">' + SHAPE[shape] + '</td><td>' + popis +
      '</td><td class="formula">' + vzorec + '</td></tr>';
  }

  function contentHTML() {
    return '<section class="help-sec"><h2>Pohyb v testu a sledování postupu</h2>' +
      row(ICON.next, 'Další otázka', 'Přejdeš k následující úloze.') +
      row(ICON.prev, 'Zpět', 'Vrátíš se k předchozí úloze. Když se vrátit nedá, je tlačítko šedé.') +
      row(ICON.progress, 'Proužek postupu', 'Každý obdélníček je jedna úloha. Modrý je ta, ' +
        'na které právě pracuješ, tmavší jsou ty, kterými jsi prošel.') +
      row(ICON.clock, 'Čas řešení', 'Test nemá časový limit. Čas se jen měří a uvidíš ho ' +
        'na konci. Odpovědi můžeš měnit, dokud test neodevzdáš.') +
      '</section>' +

      '<section class="help-sec"><h2>Jak odpovídat na otázky</h2>' +
      row(ICON.field, 'Napiš číslo', 'Klikni do políčka a napiš odpověď. Desetinnou čárku ' +
        'i tečku bereme obě, mezery po tisících můžeš a nemusíš psát.') +
      row(ICON.select, 'Vyber z nabídky', 'Klikni na nabídku a zvol jednu možnost. ' +
        'Chceš-li odpověď změnit, otevři nabídku znovu.') +
      row(ICON.area, 'Napiš vysvětlení', 'Klikni do velkého rámečku a napiš odpověď ' +
        'vlastními slovy.') +
      row(ICON.pin, 'Klikni na mapu', 'Klikni na kolečko u města. Vybrané město se obtáhne ' +
        'modře a objeví se pod mapou. Kliknutím na jiné město odpověď změníš.') +
      '</section>' +

      '<section class="help-sec"><h2>Úlohy se simulací</h2>' +
      row(ICON.slider, 'Posuvník', 'Chyť puntík a táhni po stupnici, nebo klikni rovnou ' +
        'na číslo pod ní.') +
      row(ICON.play, 'Spustit simulaci', 'Přidá do tabulky řádek s naměřenou hodnotou. ' +
        'Spouštět můžeš opakovaně s různým nastavením. Šipka na obrázku modulu přehraje, ' +
        'jak voda vzniká.') +
      row(ICON.star, 'Označ řádek s daty (hvězdička ve sloupci Označ)', 'Klikni na hvězdičku vlevo od řádku. Označený ' +
        'řádek zezelená. Dalším kliknutím označení zrušíš.') +
      row(ICON.minus, 'Smaž řádek (červené kolečko s křížkem)', 'Klikni na červené tlačítko vpravo. Smazání se nedá ' +
        'vzít zpět, ale stejná data získáš opakováním simulace se stejným nastavením.') +
      '</section>' +

      '<section class="help-sec"><h2>Přehled vzorců</h2>' +
      '<p class="hint">Tyto vzorce ti mohou pomoci při řešení některých úloh.</p>' +
      '<table class="formulas"><tbody>' +
      formulaRow('pyth', 'Pythagorova věta pro pravoúhlý trojúhelník se stranami a, b a c, kde c je přepona.', 'a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup>') +
      formulaRow('rect', 'Obsah obdélníku se stranami a, b.', 'S = a · b') +
      formulaRow('tri', 'Obsah trojúhelníku se základnou b a výškou v.', 'S = (b · v) : 2') +
      formulaRow('circ', 'Obvod a obsah kruhu s poloměrem r.', 'o = 2 · π · r<br>S = π · r<sup>2</sup>') +
      formulaRow('cuboid', 'Objem kvádru s délkou a, šířkou b a výškou c.', 'V = a · b · c') +
      formulaRow('cyl', 'Povrch a objem válce s poloměrem r a výškou v.', 'S = 2 · π · r · (r + v)<br>V = π · r<sup>2</sup> · v') +
      formulaRow('sphere', 'Povrch a objem koule s poloměrem r.', 'S = 4 · π · r<sup>2</sup><br>V = (4 : 3) · π · r<sup>3</sup>') +
      '</tbody></table></section>';
  }

  function close() {
    if (!box) return;
    document.removeEventListener('keydown', onKey);
    document.body.removeChild(box);
    box = null;
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
  }

  function open() {
    if (box) { close(); return; }
    box = document.createElement('div');
    box.className = 'help-back';
    box.innerHTML = '<div class="help" role="dialog" aria-modal="true" aria-labelledby="ht">' +
      '<div class="help-bar"><h1 id="ht">Nápověda</h1>' +
      '<button type="button" class="help-close" aria-label="Zavřít nápovědu">×</button></div>' +
      '<div class="help-body">' + contentHTML() + '</div>' +
      '<div class="help-foot"><button type="button" class="primary help-close">Zavřít</button></div>' +
      '</div>';

    box.addEventListener('click', function (e) {
      if (e.target === box || (e.target.classList && e.target.classList.contains('help-close'))) close();
    });

    document.body.appendChild(box);
    document.addEventListener('keydown', onKey);
    var btn = box.querySelector('.help-close');
    if (btn) btn.focus();
  }

  return { open: open, close: close };
})();
