/*
  Registers the service worker (../sw.js) so the site works offline after the
  first visit, and reports two things on <html>:
    data-offline="ready"   the whole site is saved on this device
    data-update="ready"    a newer version took over while this page was open
                           (the page then reloads itself to show it)
  The root page shows both. A page that doesn't care can ignore them.
*/
(function () {
  "use strict";

  // The old address (masssly.github.io/asmau) moves each family to asmau.org with what this device keeps there:
  // the family code, sync state, voice, language and each story's place (scripts/KEEPING.md). They travel in the
  // part of the link after "#", which browsers never send to a server; move.html on asmau.org saves them.
  if (location.hostname === "masssly.github.io") {
    var keep = {};
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i), v = localStorage.getItem(k);
        if (/^asmau-/.test(k) && v != null && v.length < 20000) keep[k] = v;
      }
    } catch (e) { /* nothing readable: move without it */ }
    var to = (location.pathname.replace(/^\/asmau(?=\/|$)/, "") || "/") + location.search;
    var data = btoa(unescape(encodeURIComponent(JSON.stringify(keep))));
    location.replace("https://asmau.org/move.html#to=" + encodeURIComponent(to) + "&keep=" + encodeURIComponent(data));
    return;
  }

  // Any element with data-asmau-version shows the release number (2026.11.1);
  // data-asmau-notes gets the latest notes as a list. Read fresh, never from an old copy.
  var here = document.currentScript ? document.currentScript.src : location.href;
  function showVersion() {
    var url = new URL("../version.json", here).href;
    fetch(url, { cache: "no-cache" }).then(function (r) { return r.json(); }).then(function (v) {
      window.AsmauRelease = v;
      Array.prototype.forEach.call(document.querySelectorAll("[data-asmau-version]"), function (el) { el.textContent = "Version " + v.version; el.hidden = false; });
      Array.prototype.forEach.call(document.querySelectorAll("[data-asmau-notes]"), function (el) {
        // the latest release in full; the four before it folded, so the list stays short to read
        el.innerHTML = "";
        var mk = function (tag, text) { var e = document.createElement(tag); if (text != null) e.textContent = text; return e; };
        var entry = function (h) {
          var li = mk("li"); li.appendChild(mk("strong", h.version + " · " + h.date));
          var ul = mk("ul"); (h.notes || []).forEach(function (n) { ul.appendChild(mk("li", n)); }); li.appendChild(ul);
          return li;
        };
        var hist = v.history || [];
        if (hist[0]) el.appendChild(entry(hist[0]));
        if (hist.length > 1) {
          var li = mk("li"), d = mk("details"), list = mk("ul");
          d.appendChild(mk("summary", "Earlier changes"));
          hist.slice(1, 5).forEach(function (h) { list.appendChild(entry(h)); });
          d.appendChild(list); li.appendChild(d); el.appendChild(li);
        }
      });
      window.dispatchEvent(new Event("asmau-version"));
    }).catch(function () { /* offline with nothing saved yet */ });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", showVersion); else showVersion();

  function voiceSet() { try { return localStorage.getItem("asmau-voice") === "m" ? "m" : "w"; } catch (e) { return "w"; } }

  // Keep this device's Asmau: ask the browser not to clear it when space runs low (the family code, recordings, saved
  // games, the child's place). Asked when there is something to keep, and always in the app on the home screen, so no
  // browser asks a family about it out of the blue. (scripts/KEEPING.md)
  window.AsmauKeep = function () {
    try { if (navigator.storage && navigator.storage.persist) navigator.storage.persisted().then(function (y) { if (!y) return navigator.storage.persist(); }).catch(function () {}); } catch (e) { /* not supported */ }
  };
  (function () {
    var app = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone;
    var code = null; try { code = localStorage.getItem("asmau-sync-code"); } catch (e) { /* private window */ }
    if (app || code) window.AsmauKeep();
  })();

  if (!("serviceWorker" in navigator)) return;

  var script = document.currentScript;
  var sw = new URL("../sw.js", script ? script.src : location.href);
  var hadController = !!navigator.serviceWorker.controller;
  var root = document.documentElement;

  // When a newer version takes over, show it without anyone having to reload
  // by hand. Right after the page opened, reload at once (nothing is lost
  // yet). Later, wait until the page is put away, so a child in the middle of
  // an activity is not interrupted; progress is saved step by step anyway.
  var opened = Date.now(), reloaded = false;
  function reload() {
    if (reloaded) return;
    // never in the middle of something that would be lost (a parent recording a line: window.AsmauBusy)
    if (window.AsmauBusy && window.AsmauBusy()) { setTimeout(reload, 3000); return; }
    reloaded = true;
    // the page comes back where it was: a story asks to carry on from the same page (shared/story-engine.js)
    try { sessionStorage.setItem("asmau-updated", JSON.stringify({ path: location.pathname, resume: !!(window.AsmauResumeHint && window.AsmauResumeHint()) })); } catch (e) { /* private window */ }
    location.reload();
  }
  navigator.serviceWorker.addEventListener("controllerchange", function () {
    if (!hadController) return;
    root.setAttribute("data-update", "ready");
    window.dispatchEvent(new Event("asmau-update"));
    var soon = +((/[?&]updatems=(\d+)/.exec(location.search) || [0, 15000])[1]);   // ?updatems= is for the automated tests
    if (Date.now() - opened < soon) reload();
    else document.addEventListener("visibilitychange", function () { if (document.hidden) reload(); });
  });

  navigator.serviceWorker.register(sw.href).then(function (reg) {
    // look for a newer version every time the page is opened or comes back
    reg.update().catch(function () {});
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) reg.update().catch(function () {});
    });
  }).catch(function () { /* offline support is optional */ });

  navigator.serviceWorker.ready.then(function (reg) {
    // A game is kept as it is played (sw.js); the whole game is downloaded only when a parent chooses to (data costs money).
    root.setAttribute("data-offline", "ready");
    window.dispatchEvent(new Event("asmau-offline"));
  });
})();
