/*
  Draws the people of a story in code. Every one has dark skin. A game calls
  AsmauPeople(presets) with its own cast (see games/yusuf/people.js) and gets
  back { svg(name, opts), names }.

  People.svg(name, opts) returns an <svg> string: head and shoulders, in a
  flat cartoon style. A preset gives each character their own robe, headwrap
  and beard; opts can override anything, most often:
    expr   happy | calm | neutral | sad | worried | cry | surprised | scared | angry | sleep
    blind  milky eyes, for Yaqub in his grief
    flip   face the other way
    rot    lean forward by this many degrees (bowing)
*/
window.AsmauPeople = function (PRESETS) {
  "use strict";

  var SKINS = [
    { base: "#5a3825", shade: "#3f2618", light: "#7a4d34" },
    { base: "#6b4530", shade: "#4a2d1e", light: "#8a5b3f" },
    { base: "#4b2f21", shade: "#331f15", light: "#684331" },
    { base: "#7b5239", shade: "#5a3826", light: "#9a6b4b" },
    { base: "#3f281c", shade: "#2a1a12", light: "#59392a" }
  ];
  var INK = "#1a0f0a";
  var HAIR = "#1d130d";
  var MOUTH = "#4a1410";

  function f(n) { return Math.round(n * 10) / 10; }

  function brows(cx, cy, expr, col, w) {
    var L, R;
    if (expr === "sad" || expr === "worried" || expr === "cry" || expr === "scared") {
      L = "M" + (cx - 15) + " " + (cy - 7) + " L" + (cx - 4) + " " + (cy - 11.5);
      R = "M" + (cx + 4) + " " + (cy - 11.5) + " L" + (cx + 15) + " " + (cy - 7);
    } else if (expr === "angry") {
      L = "M" + (cx - 15) + " " + (cy - 12) + " L" + (cx - 4) + " " + (cy - 7);
      R = "M" + (cx + 4) + " " + (cy - 7) + " L" + (cx + 15) + " " + (cy - 12);
    } else if (expr === "surprised") {
      L = "M" + (cx - 15) + " " + (cy - 11) + " Q" + (cx - 9) + " " + (cy - 16) + " " + (cx - 4) + " " + (cy - 11.5);
      R = "M" + (cx + 4) + " " + (cy - 11.5) + " Q" + (cx + 9) + " " + (cy - 16) + " " + (cx + 15) + " " + (cy - 11);
    } else {
      L = "M" + (cx - 15) + " " + (cy - 8) + " Q" + (cx - 9) + " " + (cy - 12) + " " + (cx - 4) + " " + (cy - 8.5);
      R = "M" + (cx + 4) + " " + (cy - 8.5) + " Q" + (cx + 9) + " " + (cy - 12) + " " + (cx + 15) + " " + (cy - 8);
    }
    return '<path d="' + L + " " + R + '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round"/>';
  }

  function mouth(cx, my, expr) {
    var line = 'fill="none" stroke="' + MOUTH + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
    switch (expr) {
      case "happy":
        return '<path d="M' + (cx - 8) + " " + (my - 1) + " Q" + cx + " " + (my + 11) + " " + (cx + 8) + " " + (my - 1) + ' Z" fill="' + MOUTH + '"/>' +
          '<path d="M' + (cx - 6) + " " + my + " Q" + cx + " " + (my + 5) + " " + (cx + 6) + " " + my + " L" + (cx + 5) + " " + (my + 2) + " Q" + cx + " " + (my + 6.5) + " " + (cx - 5) + " " + (my + 2) + ' Z" fill="#fff"/>';
      case "calm": case "sleep":
        return '<path d="M' + (cx - 7) + " " + my + " Q" + cx + " " + (my + 6) + " " + (cx + 7) + " " + my + '" ' + line + "/>";
      case "sad":
        return '<path d="M' + (cx - 7) + " " + (my + 5) + " Q" + cx + " " + (my - 2) + " " + (cx + 7) + " " + (my + 5) + '" ' + line + "/>";
      case "worried":
        return '<path d="M' + (cx - 6) + " " + (my + 4) + " Q" + (cx - 3) + " " + (my + 1) + " " + cx + " " + (my + 4) + " Q" + (cx + 3) + " " + (my + 7) + " " + (cx + 6) + " " + (my + 4) + '" ' + line + "/>";
      case "cry":
        return '<path d="M' + (cx - 7) + " " + (my + 6) + " Q" + cx + " " + (my - 4) + " " + (cx + 7) + " " + (my + 6) + ' Z" fill="' + MOUTH + '"/>';
      case "surprised": case "scared":
        return '<ellipse cx="' + cx + '" cy="' + (my + 2) + '" rx="4.5" ry="6" fill="' + MOUTH + '"/>';
      case "angry":
        return '<path d="M' + (cx - 7) + " " + (my + 4) + " Q" + cx + " " + my + " " + (cx + 7) + " " + (my + 4) + '" ' + line + "/>";
      default:
        return '<path d="M' + (cx - 6) + " " + (my + 1) + " L" + (cx + 6) + " " + (my + 1) + '" ' + line + "/>";
    }
  }

  function build(p) {
    var sk = SKINS[p.skin || 0];
    var child = p.age === "child", elder = p.age === "elder";
    var cx = 50, cy = child ? 46 : 43, r = child ? 26 : 24;
    var ex = child ? 10 : 9.5;
    var big = (p.expr === "surprised" || p.expr === "scared") ? 1.12 : 1;
    var erx = (child ? 5.4 : 4.6) * big, ery = (child ? 6.2 : 5.2) * big;
    var expr = p.expr || "happy";
    var sleeping = expr === "sleep";
    var by = child ? 82 : 77;
    var browCol = elder ? "#f3efe6" : INK;
    var o = [];

    // hair halo, behind the head
    if (p.hair) {
      o.push('<circle cx="' + cx + '" cy="' + (cy - 5) + '" r="' + (r + 3) + '" fill="' + HAIR + '"/>');
      for (var a = -160; a <= -20; a += 20) {
        var rad = a * Math.PI / 180;
        o.push('<circle cx="' + f(cx + (r + 3) * Math.cos(rad)) + '" cy="' + f(cy - 5 + (r + 3) * Math.sin(rad)) + '" r="6.5" fill="' + HAIR + '"/>');
      }
    }

    // shoulders, neck, collar
    o.push('<path d="' + (child ? "M14 112C14 92 28 82 50 82s36 10 36 30Z" : "M8 112C8 88 26 77 50 77s42 11 42 35Z") + '" fill="' + p.robe + '"/>');
    o.push('<path d="' + (child ? "M26 96 L74 112" : "M20 92 L78 112") + '" stroke="' + p.trim + '" stroke-width="5" opacity=".5" stroke-linecap="round"/>');
    if (p.head === "scarf") {
      o.push('<path d="M18 56 C10 4 90 4 82 56 C84 70 90 80 95 92 L5 92 C10 80 16 70 18 56 Z" fill="' + p.cloth + '"/>');
      o.push('<path d="M24 70 C30 80 34 86 40 92 M76 70 C70 80 66 86 60 92" fill="none" stroke="#000" stroke-width="2" opacity=".15" stroke-linecap="round"/>');
    }
    o.push('<rect x="43" y="' + (cy + r - 8) + '" width="14" height="22" rx="6" fill="' + sk.shade + '"/>');
    o.push('<path d="M41 ' + (by + 1) + " L50 " + (by + 17) + " L59 " + (by + 1) + ' Z" fill="' + sk.shade + '"/>');
    o.push('<path d="M40 ' + by + " L50 " + (by + 18) + " L60 " + by + '" fill="none" stroke="' + p.trim + '" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>');

    // ears and head
    [-1, 1].forEach(function (s) {
      o.push('<circle cx="' + (cx + s * (r + 1)) + '" cy="' + (cy + 3) + '" r="5.5" fill="' + sk.base + '"/>');
      o.push('<circle cx="' + (cx + s * (r + 1)) + '" cy="' + (cy + 3) + '" r="2.8" fill="' + sk.shade + '" opacity=".6"/>');
    });
    o.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + sk.base + '"/>');
    o.push('<ellipse cx="' + (cx - 6) + '" cy="' + (cy - 11) + '" rx="9" ry="5" fill="' + sk.light + '" opacity=".4"/>');
    [-1, 1].forEach(function (s) {
      o.push('<circle cx="' + (cx + s * 15) + '" cy="' + (cy + 9) + '" r="5" fill="' + sk.light + '" opacity="' + (child ? 0.4 : 0.3) + '"/>');
    });

    // beards
    if (p.beard === "long") {
      o.push('<path d="M' + (cx - r + 2) + " " + (cy + 8) + " C" + (cx - r) + " " + (cy + 32) + " " + (cx - 6) + " " + (cy + r + 22) + " " + cx + " " + (cy + r + 24) +
        " C" + (cx + 6) + " " + (cy + r + 22) + " " + (cx + r) + " " + (cy + 32) + " " + (cx + r - 2) + " " + (cy + 8) +
        " C" + (cx + r - 6) + " " + (cy + 16) + " " + (cx + 9) + " " + (cy + 12.5) + " " + cx + " " + (cy + 12.5) +
        " C" + (cx - 9) + " " + (cy + 12.5) + " " + (cx - r + 6) + " " + (cy + 16) + " " + (cx - r + 2) + " " + (cy + 8) + ' Z" fill="#f3efe6" stroke="#cfc7b4" stroke-width="1.2"/>');
    } else if (p.beard === "short") {
      o.push('<path d="M' + (cx - r + 2) + " " + (cy + 4) + " C" + (cx - r + 2) + " " + (cy + r + 8) + " " + (cx + r - 2) + " " + (cy + r + 8) + " " + (cx + r - 2) + " " + (cy + 4) +
        " C" + (cx + r - 6) + " " + (cy + 13) + " " + (cx + 9) + " " + (cy + 10) + " " + cx + " " + (cy + 10) +
        " C" + (cx - 9) + " " + (cy + 10) + " " + (cx - r + 6) + " " + (cy + 13) + " " + (cx - r + 2) + " " + (cy + 4) + ' Z" fill="' + HAIR + '"/>');
    }

    // nose
    o.push('<ellipse cx="' + cx + '" cy="' + (cy + 6) + '" rx="4.2" ry="3" fill="' + sk.shade + '" opacity=".6"/>');

    // eyes
    var delay = "-" + (Math.round(Math.random() * 40) / 10) + "s";
    o.push('<g class="eyes" style="animation-delay:' + delay + '">');
    [-1, 1].forEach(function (s) {
      var x = cx + s * ex, y = cy - 1;
      if (sleeping) {
        o.push('<g><path d="M' + (x - 5) + " " + y + " Q" + x + " " + (y + 4) + " " + (x + 5) + " " + y + '" fill="none" stroke="' + INK + '" stroke-width="2.4" stroke-linecap="round"/></g>');
      } else if (p.blind) {
        o.push('<g><ellipse cx="' + x + '" cy="' + y + '" rx="' + erx + '" ry="' + ery + '" fill="#e8edf3" stroke="#b9c4d2" stroke-width="1"/></g>');
      } else {
        o.push('<g><ellipse cx="' + x + '" cy="' + y + '" rx="' + erx + '" ry="' + ery + '" fill="#fffdf5"/>' +
          '<circle cx="' + x + '" cy="' + (y + 0.5) + '" r="' + (child ? 3.4 : 2.9) + '" fill="' + INK + '"/>' +
          '<circle cx="' + (x + 1.1) + '" cy="' + (y - 1) + '" r="1" fill="#fff"/></g>');
      }
    });
    o.push("</g>");

    if (p.lashes && !sleeping) {
      [-1, 1].forEach(function (sd) {
        var x = cx + sd * ex + sd * erx, y = cy - 3;
        o.push('<path d="M' + x + " " + y + " l" + (sd * 3.2) + " -2.6 M" + x + " " + (y + 2.5) + " l" + (sd * 3.6) + ' -0.6" fill="none" stroke="' + INK + '" stroke-width="1.6" stroke-linecap="round"/>');
      });
    }
    o.push(brows(cx, cy, expr, browCol, child ? 3.2 : 2.8));
    o.push(mouth(cx, cy + 14, expr));

    if (expr === "cry") {
      [-1, 1].forEach(function (s) {
        var x = cx + s * ex;
        o.push('<path d="M' + x + " " + (cy + 6) + " q-3 6 0 9 q3 -3 0 -9 Z" + '" fill="#8fd0ec"/>');
      });
    }

    // the fringe of the hair, over the forehead
    if (p.hair) {
      o.push('<path d="M' + (cx - r + 2) + " " + (cy - 6) + " Q" + (cx - r + 2) + " " + (cy - r + 1) + " " + cx + " " + (cy - r) +
        " Q" + (cx + r - 2) + " " + (cy - r + 1) + " " + (cx + r - 2) + " " + (cy - 6) + " Q" + cx + " " + (cy - 20) + " " + (cx - r + 2) + " " + (cy - 6) + ' Z" fill="' + HAIR + '"/>');
    }

    // headwear
    if (p.head === "scarf") {
      o.push('<path d="M' + (cx - r - 2) + " " + (cy + 2) + " C" + (cx - r - 6) + " " + (cy - 36) + " " + (cx + r + 6) + " " + (cy - 36) + " " + (cx + r + 2) + " " + (cy + 2) +
        " C" + (cx + r - 2) + " " + (cy - 18) + " " + (cx - r + 2) + " " + (cy - 18) + " " + (cx - r - 2) + " " + (cy + 2) + ' Z" fill="' + p.cloth + '"/>');
      o.push('<path d="M26 30 C40 14 62 14 76 28" fill="none" stroke="#000" stroke-width="2" opacity=".18" stroke-linecap="round"/>');
    } else if (p.head === "turban") {
      o.push('<path d="M22 40 C18 -2 82 -2 78 40 C67 24 33 24 22 40 Z" fill="' + p.cloth + '"/>');
      o.push('<path d="M26 30 C40 12 64 12 76 28 M24 35 C40 20 62 20 77 33" fill="none" stroke="' + p.band + '" stroke-width="2" opacity=".55" stroke-linecap="round"/>');
      o.push('<path d="M22 40 C33 24 67 24 78 40" fill="none" stroke="' + p.band + '" stroke-width="4" stroke-linecap="round"/>');
    } else if (p.head === "crown") {
      o.push('<path d="M27 33 L27 10 L38 21 L50 5 L62 21 L73 10 L73 33 Q50 27 27 33 Z" fill="#f0b84b" stroke="#b9801a" stroke-width="1.5" stroke-linejoin="round"/>');
      o.push('<circle cx="50" cy="19" r="3" fill="#d94a4a"/><circle cx="35" cy="24" r="2.2" fill="#4a8fd9"/><circle cx="65" cy="24" r="2.2" fill="#4a8fd9"/>');
    }

    var tf = [];
    if (p.flip) tf.push("scaleX(-1)");
    if (p.rot) tf.push("rotate(" + p.rot + "deg)");
    var style = tf.length ? ' style="transform:' + tf.join(" ") + ';transform-origin:50% 100%"' : "";
    return '<svg class="fig" viewBox="0 0 100 112" aria-hidden="true"' + style + ">" + o.join("") + "</svg>";
  }

  // A person with a portrait in art.js is shown as that round picture; anyone
  // else is drawn. A portrait has one face, so expr is ignored for it.
  function portrait(name, opts) {
    var tf = [];
    if (opts && opts.flip) tf.push("scaleX(-1)");
    if (opts && opts.rot) tf.push("rotate(" + opts.rot + "deg)");
    var style = tf.length ? ' style="transform:' + tf.join(" ") + ';transform-origin:50% 100%"' : "";
    return '<img class="fig ava" src="assets/img/p-' + name + '.webp" alt="" draggable="false"' + style + ">";
  }

  function svg(name, opts) {
    if ((window.STORY_ART || {})["p-" + name]) return portrait(name, opts);
    var p = {}, k, base = PRESETS[name] || PRESETS.yusuf;
    for (k in base) p[k] = base[k];
    for (k in (opts || {})) p[k] = opts[k];
    return build(p);
  }

  return { svg: svg, names: Object.keys(PRESETS) };
};
