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

  // Any element with data-asmau-version shows the release number (2026.11.1);
  // data-asmau-notes gets the latest notes as a list. Read fresh, never from an old copy.
  var here = document.currentScript ? document.currentScript.src : location.href;
  function showVersion() {
    var url = new URL("../version.json", here).href;
    fetch(url, { cache: "no-cache" }).then(function (r) { return r.json(); }).then(function (v) {
      window.AsmauRelease = v;
      Array.prototype.forEach.call(document.querySelectorAll("[data-asmau-version]"), function (el) { el.textContent = "Version " + v.version; el.hidden = false; });
      Array.prototype.forEach.call(document.querySelectorAll("[data-asmau-notes]"), function (el) {
        el.innerHTML = "";
        (v.history || []).slice(0, 5).forEach(function (h) {
          var li = document.createElement("li");
          li.textContent = h.version + " (" + h.date + "): " + h.notes.join("; ");
          el.appendChild(li);
        });
      });
      window.dispatchEvent(new Event("asmau-version"));
    }).catch(function () { /* offline with nothing saved yet */ });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", showVersion); else showVersion();

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
    reloaded = true;
    location.reload();
  }
  navigator.serviceWorker.addEventListener("controllerchange", function () {
    if (!hadController) return;
    root.setAttribute("data-update", "ready");
    window.dispatchEvent(new Event("asmau-update"));
    if (Date.now() - opened < 15000) reload();
    else document.addEventListener("visibilitychange", function () { if (document.hidden) reload(); });
  });

  navigator.serviceWorker.register(sw.href).then(function (reg) {
    // look for a newer version every time the page is opened or comes back
    reg.update().catch(function () {});
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) reg.update().catch(function () {});
    });
  }).catch(function () { /* offline support is optional */ });

  navigator.serviceWorker.ready.then(function () {
    root.setAttribute("data-offline", "ready");
    window.dispatchEvent(new Event("asmau-offline"));
  });
})();
