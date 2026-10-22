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

  function svg(extraClass) {
    var poolHalf = Math.sqrt(R * R - (POOL_Y - CY) * (POOL_Y - CY));
    var poolX1 = (CX - poolHalf).toFixed(1), poolX2 = (CX + poolHalf).toFixed(1);

    return '<svg class="helio' + (extraClass ? ' ' + extraClass : '') + '" id="helio-svg" ' +
      'viewBox="0 0 300 208" width="100%" role="img" ' +
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

      /* pára a odpařování z vaničky */
      '<g class="vapor">' +
      '<path d="M146 50 q-10 0 -10 -9 q0 -9 10 -9 q3 -13 14 -13 q9 -9 19 -3 q13 -5 17 9 ' +
      'q10 1 10 9 q0 9 -10 9 Z" fill="#FFFFFF" stroke="#BBD7EC" stroke-width="1.3"></path>' +
      '<g stroke="#2D7CD6" stroke-width="2.2" stroke-dasharray="4 3">' +
      '<path d="M150 90 V66"></path><path d="M176 90 V62"></path><path d="M202 90 V66"></path></g>' +
      '<path d="M146 66 L150 59 L154 66 Z" fill="#2D7CD6"></path>' +
      '<path d="M172 62 L176 55 L180 62 Z" fill="#2D7CD6"></path>' +
      '<path d="M198 66 L202 59 L206 66 Z" fill="#2D7CD6"></path>' +
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
      '</svg>';
  }

  return { svg: svg };
})();
