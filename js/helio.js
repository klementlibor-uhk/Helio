'use strict';
/* Kresba modulu Helio — jediný zdroj pro úvodní stránku i otázku 2.
   Věrně podle schématu výrobce:

   solární panel → čerpadlo → mořská voda stoupá středem do MĚLKÉ VANIČKY
   uprostřed koule (tmavě modrá) → slunce ji ohřívá shora i odrazem od ZRCADLA
   pod koulí → voda se z vaničky odpařuje vzhůru → na chladnější stěně koule
   kondenzuje → kapky stékají po stěně dolů MEZEROU kolem vaničky →
   na dně se hromadí PITNÁ voda (světle modrá) → odtok → remineralizace → ven.

   V kresbě schválně není žádný text: popisky patří pod obrázek jako běžná
   typografie, aby se daly číst i když je kresba zmenšená. */

var Helio = (function () {

  var CX = 176, CY = 96, R = 66;      /* koule */
  var TRAY_Y = 96;                     /* vanička v polovině výšky */
  var TRAY_X1 = 128, TRAY_X2 = 224;    /* mezera ke stěně zůstává na obou stranách */
  var POOL_Y = 130;                    /* hladina pitné vody na dně */

  function dome() {
    /* kapičky kondenzátu po vnitřní straně klenby */
    var out = '';
    for (var a = 196; a <= 344; a += 11) {
      var rad = a * Math.PI / 180;
      out += '<circle cx="' + (CX + 57 * Math.cos(rad)).toFixed(1) +
        '" cy="' + (CY + 57 * Math.sin(rad)).toFixed(1) + '" r="1.7" fill="#49A8E8"></circle>';
    }
    return out;
  }

  /* Popisky jen pro úvodní stránku, kde je kresba velká. Leží VEDLE obrázku,
     ne v něm — proto se pro ně rozšíří viewBox do stran a dolů. V otázce 2 je
     kresba malá a princip je popsaný textem vedle ní, tam popisky nejsou. */
  function labels() {
    var t = function (x, y, anchor, text) {
      return '<text x="' + x + '" y="' + y + '" font-size="11" text-anchor="' + anchor +
        '" fill="#14558C" font-family="inherit">' + text + '</text>';
    };
    var lead = function (d) {
      return '<path d="' + d + '" stroke="#9FBBD2" stroke-width="1" fill="none"></path>';
    };
    return '<g class="popisky">' +
      t(-8, 99, 'end', 'vanička s mořskou vodou') + lead('M-4 96 H' + (TRAY_X1 - 16)) +
      t(-8, 149, 'end', 'solární panel') + lead('M-4 146 H8') +
      t(-8, 192, 'end', 'mořská voda') +
      t(304, 163, 'start', 'zrcadlo') + lead('M300 160 L258 153') +
      t(304, 192, 'start', 'pitná voda') +
      t(81, 230, 'middle', 'čerpadlo') + lead('M81 208 V221') +
      t(240, 230, 'middle', 'remineralizace') + lead('M240 209 V221') +
      '</g>';
  }

  /* opts.popisky = true → širší výřez a popisky okolo */
  function svg(extraClass, opts) {
    var sPopisky = !!(opts && opts.popisky);
    var poolHalf = Math.sqrt(R * R - (POOL_Y - CY) * (POOL_Y - CY));
    var poolX1 = (CX - poolHalf).toFixed(1), poolX2 = (CX + poolHalf).toFixed(1);
    var box = sPopisky ? '-152 -8 548 252' : '0 0 300 208';

    return '<svg class="helio' + (extraClass ? ' ' + extraClass : '') + '" id="helio-svg" ' +
      'viewBox="' + box + '" width="100%" role="img" ' +
      'aria-label="Modul Helio: čerpadlo žene mořskou vodu do vaničky uprostřed koule, ' +
      'voda se odpařuje, na stěně kondenzuje, kapky stékají na dno jako pitná voda ' +
      'a odtékají přes remineralizaci.">' +

      '<defs><clipPath id="ball"><circle cx="' + CX + '" cy="' + CY + '" r="' + R + '"></circle></clipPath></defs>' +

      /* slunce jako výseč z rohu */
      '<circle class="spark" cx="16" cy="-8" r="36" fill="#FFCE3A"></circle>' +
      '<g class="spark" stroke="#F2A81D" stroke-width="2.6" stroke-linecap="round">' +
      '<path d="M58 14 L66 18"></path><path d="M50 32 L57 39"></path>' +
      '<path d="M34 42 L38 50"></path><path d="M14 46 L14 55"></path></g>' +

      /* paprsky: na panel, do koule, a odraz od zrcadla vzhůru */
      '<path d="M30 48 L34 132" stroke="#FFCE3A" stroke-width="2.2" stroke-dasharray="5 4"></path>' +
      '<path d="M46 40 L142 74" stroke="#FFCE3A" stroke-width="2.4"></path>' +
      '<path d="M142 74 L132 71 L136 80 Z" fill="#FFCE3A"></path>' +
      '<path d="M120 150 L156 110" stroke="#FFCE3A" stroke-width="2.4"></path>' +
      '<path d="M156 110 L146 113 L153 119 Z" fill="#FFCE3A"></path>' +
      '<path d="M86 118 L118 148" stroke="#FFCE3A" stroke-width="2.2" stroke-dasharray="5 4"></path>' +

      /* zrcadlo pod koulí */
      '<ellipse cx="' + CX + '" cy="152" rx="80" ry="11" fill="#CBD6DF" stroke="#94A3AF" ' +
      'stroke-width="1.4"></ellipse>' +
      '<path d="M112 149 a80 11 0 0 1 60 -7" fill="none" stroke="#FFFFFF" stroke-width="2.6" ' +
      'opacity="0.85"></path>' +

      /* koule */
      '<circle cx="' + CX + '" cy="' + CY + '" r="' + R + '" fill="#F4FAFE" stroke="#9FC2E3" ' +
      'stroke-width="1.6"></circle>' +

      '<g clip-path="url(#ball)">' +
      /* pitná voda na dně */
      '<path d="M' + poolX1 + ' ' + POOL_Y + ' a' + R + ' ' + R + ' 0 0 0 ' +
      (poolHalf * 2).toFixed(1) + ' 0 Z" fill="#8FCDF0"></path>' +
      '<path d="M' + poolX1 + ' ' + POOL_Y + ' H' + poolX2 + '" stroke="#5FB4E6" stroke-width="1.4"></path>' +
      /* kondenzát na klenbě a stékající kapky */
      '<g class="drops">' + dome() +
      '<circle class="drop drop-a" cx="124" cy="58" r="2.8" fill="#2D7CD6"></circle>' +
      '<circle class="drop drop-b" cx="229" cy="54" r="2.8" fill="#2D7CD6"></circle>' +
      '<circle class="drop drop-c" cx="120" cy="86" r="2.4" fill="#2D7CD6"></circle>' +
      '</g>' +
      '</g>' +

      /* Pára a odpařování z vaničky.
         Obláček musí být CELÝ uvnitř koule — celý děj se odehrává v ní.
         Ve verzi 3 prostupoval stěnou: sahal od výšky 28 a byl 80 bodů široký,
         zatímco koule je v té výšce široká jen 50. Teď je menší, posunutý níž
         a navíc ořezaný tvarem koule jako pojistka. */
      '<g class="vapor" clip-path="url(#ball)">' +
      '<path d="M156 66 C148 66 146 59 153 55 C152 48 161 44 167 47 ' +
      'C171 42 182 42 186 47 C195 46 200 52 198 57 C203 59 202 66 195 66 Z" ' +
      'fill="#FFFFFF" stroke="#8FB6D8" stroke-width="1.8"></path>' +
      '<g stroke="#2D7CD6" stroke-width="2.2" stroke-dasharray="4 3">' +
      '<path d="M150 90 V74"></path><path d="M176 90 V70"></path><path d="M202 90 V74"></path></g>' +
      '<path d="M146 74 L150 67 L154 74 Z" fill="#2D7CD6"></path>' +
      '<path d="M172 70 L176 63 L180 70 Z" fill="#2D7CD6"></path>' +
      '<path d="M198 74 L202 67 L206 74 Z" fill="#2D7CD6"></path>' +
      '</g>' +

      /* vanička s mořskou vodou, zavěšená na obruči — mezera ke stěně zůstává */
      '<path d="M' + (TRAY_X1 - 12) + ' ' + TRAY_Y + ' H' + TRAY_X1 + ' M' + TRAY_X2 + ' ' +
      TRAY_Y + ' H' + (TRAY_X2 + 12) + '" stroke="#7B8793" stroke-width="1.6"></path>' +
      '<circle cx="' + (TRAY_X1 - 12) + '" cy="' + TRAY_Y + '" r="3" fill="#7B8793"></circle>' +
      '<circle cx="' + (TRAY_X2 + 12) + '" cy="' + TRAY_Y + '" r="3" fill="#7B8793"></circle>' +
      '<path d="M' + TRAY_X1 + ' ' + (TRAY_Y - 6) + ' V' + (TRAY_Y + 3) + ' H' + TRAY_X2 +
      ' V' + (TRAY_Y - 6) + '" fill="none" stroke="#6E7A86" stroke-width="2.4"></path>' +
      '<rect x="' + (TRAY_X1 + 1.5) + '" y="' + (TRAY_Y - 5) + '" width="' +
      (TRAY_X2 - TRAY_X1 - 3) + '" height="7.5" fill="#1A69B8"></rect>' +

      /* nohy a pata */
      '<path d="M132 140 C122 160 114 176 110 190" stroke="#59636D" stroke-width="8" ' +
      'stroke-linecap="round" fill="none"></path>' +
      '<path d="M220 140 C230 160 238 176 242 190" stroke="#59636D" stroke-width="8" ' +
      'stroke-linecap="round" fill="none"></path>' +

      /* potrubí: přítok mořské vody středem do vaničky, odtok pitné vody ze dna */
      '<path class="flow-in" d="M0 196 H168 V' + (TRAY_Y + 4) + '" stroke="#1A69B8" ' +
      'stroke-width="5.5" fill="none" stroke-dasharray="11 7"></path>' +
      '<path class="flow-out" d="M192 ' + (POOL_Y + 14) + ' V196 H300" stroke="#8FCDF0" ' +
      'stroke-width="5.5" fill="none" stroke-dasharray="11 7"></path>' +
      '<path d="M0 196 H60" stroke="#1A69B8" stroke-width="5.5"></path>' +
      '<path d="M258 196 H300" stroke="#8FCDF0" stroke-width="5.5"></path>' +

      /* solární panel, čerpadlo, remineralizace */
      '<rect class="spark" x="12" y="130" width="48" height="32" rx="3" fill="#15396E"></rect>' +
      '<g stroke="#4C6FB0" stroke-width="1.3">' +
      '<path d="M28 130 V162"></path><path d="M44 130 V162"></path>' +
      '<path d="M12 141 H60"></path><path d="M12 151 H60"></path></g>' +
      '<path d="M36 162 V188 H62" stroke="#8A8C92" stroke-width="2" fill="none"></path>' +
      '<rect x="62" y="186" width="38" height="20" rx="3" fill="#59636D"></rect>' +
      '<rect x="222" y="185" width="36" height="22" rx="3" fill="#A6ADB5"></rect>' +
      '<g stroke="#59636D" stroke-width="2.2">' +
      '<path d="M231 188 V204"></path><path d="M240 188 V204"></path><path d="M249 188 V204"></path></g>' +
      (sPopisky ? labels() : '') +
      '</svg>';
  }

  return { svg: svg };
})();
