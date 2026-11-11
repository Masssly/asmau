/*
  Tiny speech-synthesis helper shared across games.
  Placeholder narration only — uses whatever voice the device/browser
  provides. Not a substitute for recorded narration in a finished game,
  and never used for Arabic words (pronunciation quality is unverified).
*/
window.AsmauSpeech = (function () {
  function speak(text, opts) {
    opts = opts || {};
    try {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.rate = opts.rate || 0.85;
      u.pitch = opts.pitch || 1.1;
      window.speechSynthesis.speak(u);
    } catch (err) {
      /* speech not available on this device — games must still work visually */
    }
  }
  return { speak: speak };
})();
