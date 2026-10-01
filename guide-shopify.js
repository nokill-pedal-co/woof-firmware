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
})();
