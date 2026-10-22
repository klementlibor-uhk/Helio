'use strict';
/* Vyhodnocení úlohy Pitná voda. Celkem 5 bodů:
   otázka 1, 3 a 4 po jednom bodu, otázka 2 za dva.
   Soubor je oddělený schválně — dá se spustit i v Node a otestovat bez prohlížeče. */
(function (root) {

  var ids = ['PV1', 'PV2', 'PV3', 'PV4'];

  /* Přečte číslo zapsané po česku i po anglicku: "15 257", "15257,00", "0.08".
     Mezery a pevné mezery po tisících ignoruje, čárku bere jako desetinnou. */
  function number(raw) {
    var s = String(raw === null || raw === undefined ? '' : raw).trim();
    if (!s) return NaN;
    s = s.replace(/[\s ]/g, '').replace(',', '.');
    return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : NaN;
  }

  /* Otázka 2: označené řádky uznáme, jen když je aspoň jeden a všechny
     mají sluneční záření 6. Bez té podmínky by stačilo označit celou tabulku. */
  function evidenceOk(rows) {
    if (!Array.isArray(rows) || rows.length === 0) return false;
    return rows.every(function (r) { return Number(r.irradiation) === 6; });
  }

  function score(a) {
    a = a || {};
    var n1 = number(a.q1);
    var q1 = (n1 === 840 || n1 === 840000000) ? 1 : 0;
    var q2 = a.q2town === 'B' ? (evidenceOk(a.q2rows) ? 2 : 1) : 0;
    var q3 = a.q3 === 'II' ? 1 : 0;              /* vysvětlení se neboduje */
    var q4 = number(a.q4) === 15257 ? 1 : 0;
    return { q1: q1, q2: q2, q3: q3, q4: q4, total: q1 + q2 + q3 + q4, max: 5 };
  }

  function grade(points) {
    if (points >= 5) return 'Výborně!';
    if (points >= 4) return 'Velmi dobře!';
    if (points >= 2) return 'Dobře!';
    if (points >= 1) return 'Ještě trochu procvičování a půjde to lépe.';
    return 'Nevzdávej to, zkus úlohy znovu.';
  }

  root.Scoring = { ids: ids, number: number, evidenceOk: evidenceOk, score: score, grade: grade };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.Scoring;

})(typeof window === 'undefined' ? globalThis : window);
