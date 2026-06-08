/* =========================================================
   ISSUE 03 · 2026 · RUTHVIK S.J.  ·  Field Manual interactions
   ========================================================= */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  document.querySelectorAll("[data-today]").forEach(function (el) {
    var d = new Date();
    var m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    el.textContent = d.getDate() + " " + m[d.getMonth()] + " " + d.getFullYear();
  });

  if ("IntersectionObserver" in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll("[data-reveal]").forEach(function (el) { ro.observe(el); });
  } else {
    document.querySelectorAll("[data-reveal]").forEach(function (el) { el.classList.add("in"); });
  }

  var tocLinks = document.querySelectorAll(".toc a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var targets = Array.prototype.map.call(tocLinks, function (a) {
      var el = document.querySelector(a.getAttribute("href"));
      return el ? { a: a, el: el } : null;
    }).filter(Boolean);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          tocLinks.forEach(function (l) { l.classList.remove("active"); });
          var m = targets.find(function (t) { return t.el === e.target; });
          if (m) m.a.classList.add("active");
        }
      });
    }, { rootMargin: "-25% 0px -65% 0px" });
    targets.forEach(function (t) { io.observe(t.el); });
  }

  var burger = document.querySelector(".navbar__burger");
  var navList = document.querySelector(".navbar__list");
  if (burger && navList) {
    burger.addEventListener("click", function () {
      var open = navList.classList.toggle("open");
      burger.textContent = open ? "Close" : "Menu";
    });
  }

  function animate(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    var dur = 1300;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && !reduce) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animate(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = (el.getAttribute("data-prefix") || "") + el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
    });
  }

  var form = document.querySelector("#compose-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = new FormData(form);
      var subject = encodeURIComponent("[Issue 03] " + (f.get("subject") || "from " + (f.get("name") || "the site")));
      var body = encodeURIComponent(
        "from: " + (f.get("name") || "") + " <" + (f.get("email") || "") + ">\n\n" +
        (f.get("message") || "")
      );
      var hint = form.querySelector(".compose__hint");
      window.location.href = "mailto:sjruthvik99@gmail.com?subject=" + subject + "&body=" + body;
      if (hint) hint.textContent = "Opening your mail client…";
    });
  }
})();
