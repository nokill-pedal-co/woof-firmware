// Builds the launch guide for nokillpedal.co/pages/pedal-builder-launch-guide.
// Content (LINKS + SECTIONS) comes from guide.html, which stays the single source.
//
//   node build-shopify-guide.js   then commit + push
//
// Outputs guide-shopify.html (scoped CSS + static markup) and guide-shopify.js (checkboxes
// and progress bar). The Shopify page body is just a small loader that fetches both from
// GitHub Pages, so updating the guide on the store is a git push, not a Shopify edit.
// All CSS is scoped under #nk-guide so it can't touch the theme.

const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "guide.html"), "utf8");
const script = src.slice(src.indexOf("<script>") + 8, src.lastIndexOf("</script>"));
const dataJs = script.split("// Count total tasks")[0];
const { SECTIONS } = new Function(dataJs + "\nreturn { LINKS, SECTIONS };")();

const disclosure = src.match(/<p class="disclosure">([\s\S]*?)<\/p>/)[1];
const intro = src.match(/<div class="hero">[\s\S]*?<p>([\s\S]*?)<\/p>/)[1];
const total = SECTIONS.reduce((n, s) => n + s.tasks.length, 0);

const check = `<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 6L5 9L10 3" stroke="#fff" stroke-width="2" stroke-linecap="square"/></svg>`;

const sectionsHtml = SECTIONS.map(s => `
<details class="nk-section" data-section="${s.id}">
  <summary class="nk-section-header">
    <span class="nk-section-icon">${s.icon}</span>
    <span class="nk-section-info">
      <span class="nk-section-title">${s.title}</span>
      <span class="nk-section-meta">${s.tasks.length} tasks</span>
    </span>
    <span class="nk-chevron">&#9660;</span>
  </summary>
  <div class="nk-section-body">${s.tasks.map(t => `
    <div class="nk-task" data-id="${t.id}">
      <div class="nk-task-row">
        <button type="button" class="nk-check" aria-label="Mark done: ${t.title.replace(/"/g, "&quot;")}" aria-pressed="false">${check}</button>
        <div class="nk-task-content">
          <div class="nk-task-title">${t.title}</div>
          <div class="nk-task-desc">${t.desc}</div>
        </div>
      </div>
      <details class="nk-more">
        <summary>details</summary>
        <div class="nk-detail">${t.detail}</div>
      </details>
    </div>`).join("")}
  </div>
</details>`).join("");

const css = `
#nk-guide { --nk-ink: #121212; --nk-soft: rgba(18,18,18,0.6); --nk-line: rgba(18,18,18,0.08); --nk-tint: rgba(18,18,18,0.03);
  color: var(--nk-ink); font-size: 16px; line-height: 1.6; max-width: 800px; margin: 0 auto; }
#nk-guide *, #nk-guide *::before, #nk-guide *::after { box-sizing: border-box; }
#nk-guide p { margin: 0 0 10px; }
#nk-guide a { color: var(--nk-ink); text-decoration: underline; }
#nk-guide .nk-intro { font-size: 18px; color: rgba(18,18,18,0.75); margin-bottom: 8px; }
#nk-guide .nk-disclosure { font-size: 14px; color: var(--nk-soft); margin-bottom: 28px; }
#nk-guide .nk-progress { display: none; background: var(--nk-tint); border: 1px solid var(--nk-line); padding: 18px 22px; margin-bottom: 28px; }
#nk-guide.nk-js .nk-progress { display: block; }
#nk-guide .nk-progress-head { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
#nk-guide .nk-progress-label { font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; }
#nk-guide .nk-progress-count { color: var(--nk-soft); }
#nk-guide .nk-bar { height: 6px; background: var(--nk-line); }
#nk-guide .nk-bar-fill { height: 100%; width: 0; background: var(--nk-ink); transition: width 0.3s ease; }
#nk-guide .nk-done-banner { display: none; background: var(--nk-ink); color: #fff; padding: 22px; margin-bottom: 24px; text-align: center; }
#nk-guide .nk-done-banner.show { display: block; }
#nk-guide .nk-done-banner strong { display: block; font-size: 22px; margin-bottom: 4px; }
#nk-guide .nk-section { border: 1px solid var(--nk-line); margin-bottom: 14px; }
#nk-guide summary { list-style: none; cursor: pointer; }
#nk-guide summary::-webkit-details-marker { display: none; }
#nk-guide .nk-section-header { display: flex; align-items: center; padding: 16px 20px; background: rgba(18,18,18,0.02); }
#nk-guide .nk-section[open] > .nk-section-header { border-bottom: 1px solid var(--nk-line); }
#nk-guide .nk-section-header:hover { background: rgba(18,18,18,0.04); }
#nk-guide .nk-section-icon { font-size: 22px; margin-right: 14px; flex-shrink: 0; }
#nk-guide .nk-section-info { flex: 1; display: flex; flex-direction: column; }
#nk-guide .nk-section-title { font-size: 18px; font-weight: 700; line-height: 1.3; }
#nk-guide .nk-section-meta { font-size: 13px; color: var(--nk-soft); margin-top: 2px; }
#nk-guide .nk-chevron { font-size: 13px; color: rgba(18,18,18,0.4); margin-left: 10px; transition: transform 0.2s ease; }
#nk-guide .nk-section[open] .nk-chevron { transform: rotate(180deg); }
#nk-guide .nk-task { border-bottom: 1px solid var(--nk-line); }
#nk-guide .nk-task:last-child { border-bottom: none; }
#nk-guide .nk-task-row { display: flex; align-items: flex-start; padding: 14px 20px 4px; }
#nk-guide .nk-check { display: none; width: 20px; height: 20px; min-width: 20px; padding: 0; margin: 2px 14px 0 0; border: 2px solid var(--nk-ink); background: #fff; cursor: pointer; align-items: center; justify-content: center; }
#nk-guide.nk-js .nk-check { display: flex; }
#nk-guide .nk-check svg { display: none; width: 12px; height: 12px; }
#nk-guide .nk-task.done .nk-check { background: var(--nk-ink); }
#nk-guide .nk-task.done .nk-check svg { display: block; }
#nk-guide .nk-task-content { flex: 1; }
#nk-guide .nk-task-title { font-size: 16px; font-weight: 700; line-height: 1.3; }
#nk-guide .nk-task-desc { font-size: 14px; color: var(--nk-soft); margin-top: 2px; }
#nk-guide .nk-task.done .nk-task-title { text-decoration: line-through; color: rgba(18,18,18,0.4); }
#nk-guide .nk-task.done .nk-task-desc { color: rgba(18,18,18,0.35); }
#nk-guide .nk-more > summary { display: inline-block; margin: 4px 20px 12px; font-size: 13px; color: rgba(18,18,18,0.55); border: 1px solid rgba(18,18,18,0.15); padding: 1px 8px; }
#nk-guide.nk-js .nk-more > summary { margin-left: 54px; }
#nk-guide .nk-more > summary:hover { background: rgba(18,18,18,0.04); }
#nk-guide .nk-more[open] > summary { margin-bottom: 0; }
#nk-guide .nk-detail { padding: 14px 20px 18px 20px; background: rgba(18,18,18,0.02); border-top: 1px solid rgba(18,18,18,0.06); margin-top: 10px; font-size: 15px; line-height: 1.65; }
#nk-guide.nk-js .nk-detail { padding-left: 54px; }
#nk-guide .nk-detail ol, #nk-guide .nk-detail ul { margin: 8px 0 12px 20px; padding: 0; }
#nk-guide .nk-detail li { margin-bottom: 6px; }
#nk-guide .nk-detail code { background: rgba(18,18,18,0.06); padding: 2px 6px; font-size: 13.5px; font-family: monospace; }
#nk-guide .tip-box { background: rgba(18,18,18,0.04); border-left: 3px solid var(--nk-ink); padding: 12px 16px; margin: 12px 0 4px; font-size: 14px; }
#nk-guide .tip-box strong:first-child { display: block; margin-bottom: 4px; font-size: 13.5px; text-transform: uppercase; letter-spacing: 0.5px; }
#nk-guide .info-box { background: rgba(18,18,18,0.04); border: 1px solid var(--nk-line); padding: 12px 16px; margin: 12px 0 4px; font-size: 14px; }
#nk-guide .nk-reset { display: none; margin: 26px auto 0; background: none; border: 1px solid rgba(18,18,18,0.15); color: rgba(18,18,18,0.5); padding: 8px 20px; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase; cursor: pointer; }
#nk-guide.nk-js .nk-reset { display: block; }
#nk-guide .nk-reset:hover { border-color: var(--nk-ink); color: var(--nk-ink); }
@media (max-width: 600px) {
  #nk-guide .nk-section-header { padding: 14px 16px; }
  #nk-guide .nk-task-row { padding: 12px 16px 4px; }
  #nk-guide .nk-more > summary, #nk-guide.nk-js .nk-more > summary { margin-left: 16px; }
  #nk-guide .nk-detail, #nk-guide.nk-js .nk-detail { padding-left: 16px; padding-right: 16px; }
}`;

const js = `
(function () {
  var root = document.getElementById("nk-guide");
  if (!root) return;
  var KEY = "nokill-guide-progress";
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} }
  root.classList.add("nk-js");
  var tasks = root.querySelectorAll(".nk-task");
  var sections = root.querySelectorAll(".nk-section");
  function paint() {
    var p = load(), done = 0;
    tasks.forEach(function (t) {
      var on = !!p[t.getAttribute("data-id")];
      t.classList.toggle("done", on);
      t.querySelector(".nk-check").setAttribute("aria-pressed", on ? "true" : "false");
      if (on) done++;
    });
    sections.forEach(function (s) {
      var ts = s.querySelectorAll(".nk-task"), n = s.querySelectorAll(".nk-task.done").length;
      s.querySelector(".nk-section-meta").textContent = n + " / " + ts.length + " tasks completed";
    });
    root.querySelector(".nk-bar-fill").style.width = Math.round(done / tasks.length * 100) + "%";
    root.querySelector(".nk-progress-count").textContent = done + " / " + tasks.length + " tasks";
    root.querySelector(".nk-done-banner").classList.toggle("show", done === tasks.length);
  }
  root.addEventListener("click", function (e) {
    var btn = e.target.closest(".nk-check");
    if (btn) {
      var id = btn.closest(".nk-task").getAttribute("data-id"), p = load();
      p[id] = !p[id]; save(p); paint(); return;
    }
    if (e.target.closest(".nk-reset") && confirm("Reset all progress? This cannot be undone.")) {
      try { localStorage.removeItem(KEY); } catch (err) {}
      paint();
    }
  });
  paint();
  var p = load();
  for (var i = 0; i < sections.length; i++) {
    var open = Array.prototype.some.call(sections[i].querySelectorAll(".nk-task"), function (t) { return !p[t.getAttribute("data-id")]; });
    if (open) { sections[i].open = true; break; }
  }
})();`;

const out = `<style>${css}
</style>
<div id="nk-guide">
<p class="nk-intro">${intro}</p>
<p class="nk-disclosure">${disclosure}</p>
<div class="nk-progress">
  <div class="nk-progress-head"><span class="nk-progress-label">Your Progress</span><span class="nk-progress-count">0 / ${total} tasks</span></div>
  <div class="nk-bar"><div class="nk-bar-fill"></div></div>
</div>
<div class="nk-done-banner"><strong>You're ready to launch!</strong>Every task is done. Time to share your store with the world.</div>
${sectionsHtml}
<button type="button" class="nk-reset">Reset all progress</button>
</div>
`;

fs.writeFileSync(path.join(__dirname, "guide-shopify.html"), out);
fs.writeFileSync(path.join(__dirname, "guide-shopify.js"), js.trimStart() + "\n");
console.log(`guide-shopify.html + .js: ${SECTIONS.length} sections, ${total} tasks, ${out.length} chars`);
