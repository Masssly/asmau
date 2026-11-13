// Sync between two devices through a fake of the Worker: the code, MP3 conversion, redo replaces, removal, limit.
const path = require("path");
const { chromium } = require("playwright");
const { serve, fakeWorker, useFakeWorker, checker } = require("./lib");

module.exports = async function () {
  const T = checker("sync"), root = path.join(__dirname, ".."), site = await serve(root), fake = await fakeWorker({ limit: 60 * 1024 });
  const browser = await chromium.launch({ args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream"] });
  const REAL = (await (await fetch(site.url + "config.json")).json()).server;
  const U = site.url + "tools/record-voice/index.html", errs = [];
  const info = (p) => p.evaluate(async () => { const b = await window.AsmauNarration.getRecordedClip("yusuf", "c1-a"); return b ? { type: b.type, size: b.size } : null; });
  const done = (p) => p.waitForFunction(() => /Done|Could not|full/.test(document.getElementById("syncStatus").textContent), null, { timeout: 40000 });

  const A = await browser.newContext({ permissions: ["microphone"], serviceWorkers: "block" }); await useFakeWorker(A, REAL, fake.url);
  const pa = await A.newPage(); pa.on("pageerror", (e) => errs.push(e.message));
  await pa.goto(U, { waitUntil: "networkidle" }); await pa.selectOption("#gameSelect", "yusuf"); await pa.waitForTimeout(300);
  const rec = pa.locator(".row").first().locator("button.record");
  await rec.click(); await pa.waitForTimeout(1200); await rec.click(); await pa.waitForTimeout(2500);
  const first = await info(pa);
  T.check(first && first.type === "audio/mpeg", "a new recording is saved as an MP3 (plays on every device): " + JSON.stringify(first));

  // an old WebM recording made before conversion existed
  await pa.evaluate(async () => { const rec = await new Promise(async (res) => { const s = await navigator.mediaDevices.getUserMedia({ audio: true }); const mr = new MediaRecorder(s, { mimeType: "audio/webm;codecs=opus" }); const ch = []; mr.ondataavailable = (e) => ch.push(e.data); mr.onstop = () => res(new Blob(ch, { type: "audio/webm;codecs=opus" })); mr.start(); setTimeout(() => mr.stop(), 1200); }); await window.AsmauNarration.saveRecordedClip("yusuf", "c1-a", rec); });
  await pa.locator("#syncBox summary").click();
  T.check(await pa.locator("#syncOff").isVisible(), "sync is off by default and offered");
  await pa.click("#syncNew"); const code = (await pa.textContent("#syncCodeShow")).trim();
  T.check(/^[A-Z2-9]{4}(-[A-Z2-9]{4}){3}$/.test(code), "a family code is made");
  T.check(await pa.locator("#syncGo").isDisabled(), "sync cannot be turned on until the code is confirmed saved");
  await pa.check("#syncSaved"); await pa.click("#syncGo"); await done(pa);
  const conv = await info(pa);
  T.check(conv && conv.type === "audio/mpeg", "turning sync on converted the old recording to MP3");
  T.check([...fake.store.values()].every((v) => !v.bytes.includes(Buffer.from("OggS")) && !v.bytes.includes(Buffer.from("ID3"))), "what the server holds is encrypted, not an MP3 or Ogg stream");

  const B = await browser.newContext({ serviceWorkers: "block" }); await useFakeWorker(B, REAL, fake.url);
  const pb = await B.newPage(); pb.on("pageerror", (e) => errs.push(e.message));
  await pb.goto(U, { waitUntil: "networkidle" }); await pb.locator("#syncBox summary").click();
  await pb.fill("#syncCodeIn", "nonsense"); await pb.click("#syncUse");
  T.check((await pb.textContent("#syncStatus")).includes("does not look like"), "a malformed code is refused");
  await pb.fill("#syncCodeIn", code.toLowerCase()); await pb.click("#syncUse"); await pb.waitForTimeout(5000); await pb.waitForLoadState("networkidle");
  const got = await info(pb);
  T.check(got && got.size === conv.size, "the second device received the same recording");
  const C = await browser.newContext({ serviceWorkers: "block" }); await useFakeWorker(C, REAL, fake.url);
  const pc = await C.newPage(); await pc.goto(U, { waitUntil: "networkidle" }); await pc.locator("#syncBox summary").click();
  await pc.fill("#syncCodeIn", "ABCD-EFGH-JKLM-NPQR"); await pc.click("#syncUse"); await pc.waitForTimeout(4000);
  T.check((await info(pc)) === null, "a different code gets nothing");

  // redo on A reaches B and replaces the old online copy
  const before = fake.store.size;
  await pa.selectOption("#gameSelect", "yusuf"); await pa.waitForTimeout(300);
  await pa.locator(".row").first().locator("button.record").click(); await pa.waitForTimeout(1800); await pa.locator(".row").first().locator("button.record").click(); await pa.waitForTimeout(3000);
  const redone = await info(pa);
  T.check(redone.size !== conv.size && fake.store.size === before, "recording again replaces the online copy (no extra copy kept)");
  await pb.click("#syncNow"); await pb.waitForTimeout(4000); await pb.waitForLoadState("networkidle");
  T.check((await info(pb)).size === redone.size, "the other device picks up the redo");
  // remove on B removes it online and it does not come back to A
  pb.on("dialog", (d) => d.accept());
  await pb.selectOption("#gameSelect", "yusuf"); await pb.waitForTimeout(300);
  await pb.locator(".row").first().locator("button.delete").click(); await pb.waitForTimeout(2500);
  T.check(![...fake.store.keys()].some((k) => k.endsWith("/yusuf:c1-a")), "removing a recording removes its online copy");
  await pa.click("#syncNow"); await pa.waitForTimeout(3500); await pa.waitForLoadState("networkidle");
  T.check(![...fake.store.keys()].some((k) => k.endsWith("/yusuf:c1-a")) && (await info(pa)) === null, "and the other device removes its copy instead of uploading it again");

  pa.on("dialog", (d) => d.accept()); await pa.click("#syncWipe"); await pa.waitForTimeout(1500);
  T.check(fake.store.size === 0, "'Delete my online copy' empties it");
  await pa.click("#syncOffBtn");
  T.check(await pa.evaluate(() => localStorage.getItem("asmau-sync-code")) === null, "turning off forgets the code on the device");
  T.check(errs.length === 0, "no page errors" + (errs[0] ? ": " + errs[0] : ""));
  await browser.close(); await site.close(); await fake.close();
  return T.done();
};
