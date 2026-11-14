/*
  Three volume sliders for grown-ups: music, sounds (effects and the sound of the
  place) and voice. Put <div data-sound-levels></div> anywhere on a page that
  loads shared/music.js and this file. The levels are kept on this device for
  every game until changed (music.js stores them); the on/off switches in each
  game are separate and still work as before.
*/
(function () {
  "use strict";
  var music = window.AsmauMusic;
  if (!music || !music.setLevel) return;
  var KINDS = [
    ["music", "Music", "🎵"],
    ["sounds", "Sounds and the place (river, wind, effects)", "🍃"],
    ["voice", "Voice (story reader)", "🗣️"]
  ];
  var iphone = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  function build(box) {
    box.classList.add("sound-levels");
    box.innerHTML = "";
    var h = document.createElement("p");
    h.className = "sl-title";
    h.textContent = "Volume on this device";
    box.appendChild(h);
    KINDS.forEach(function (k) {
      var row = document.createElement("label");
      row.className = "sl-row";
      var name = document.createElement("span");
      name.className = "sl-name";
      name.textContent = k[2] + " " + k[1];
      var input = document.createElement("input");
      input.type = "range"; input.min = "0"; input.max = "100"; input.step = "5";
      input.value = String(Math.round(music.level(k[0]) * 100));
      input.setAttribute("aria-label", k[1] + " volume");
      var val = document.createElement("span");
      val.className = "sl-val";
      val.textContent = input.value + "%";
      input.addEventListener("input", function () {
        val.textContent = input.value + "%";
        music.setLevel(k[0], input.value / 100);
      });
      // a little sample of the sound, so the level can be judged while sliding
      input.addEventListener("change", function () { if (k[0] === "sounds") music.fx("sparkle"); });
      row.appendChild(name); row.appendChild(input); row.appendChild(val);
      box.appendChild(row);
    });
    if (iphone) {
      var note = document.createElement("p");
      note.className = "sl-note";
      note.textContent = "On an iPhone or iPad the voice slider has no effect: use the device's own volume buttons for the voice.";
      box.appendChild(note);
    }
  }
  function init() { Array.prototype.forEach.call(document.querySelectorAll("[data-sound-levels]"), build); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
