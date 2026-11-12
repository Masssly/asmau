/*
  Registers the service worker (../sw.js) so the site works offline after the
  first visit, and reports two things on <html>:
    data-offline="ready"   the whole site is saved on this device
    data-update="ready"    a newer version took over while this page was open
  The root page shows both. A page that doesn't care can ignore them.
*/
(function () {
  "use strict";
  if (!("serviceWorker" in navigator)) return;

  var script = document.currentScript;
  var sw = new URL("../sw.js", script ? script.src : location.href);
  var hadController = !!navigator.serviceWorker.controller;
  var root = document.documentElement;

  navigator.serviceWorker.addEventListener("controllerchange", function () {
    if (hadController) {
      root.setAttribute("data-update", "ready");
      window.dispatchEvent(new Event("asmau-update"));
    }
  });

  navigator.serviceWorker.register(sw.href).catch(function () { /* offline support is optional */ });

  navigator.serviceWorker.ready.then(function () {
    root.setAttribute("data-offline", "ready");
    window.dispatchEvent(new Event("asmau-offline"));
  });
})();
