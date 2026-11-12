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
