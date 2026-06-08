/* =========================================================
   HIRING RUTHVIK · PITCH DECK · 2026  ·  interactions
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

  /* ---- Slides + current indicator ---- */
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var total = slides.length;
  var curEl = document.querySelector(".chrome__center .cur");
  var totEl = document.querySelector(".chrome__center .total");
  var titleEl = document.querySelector(".chrome__center .name");
  var prevBtn = document.querySelector(".foot__prev");
  var nextBtn = document.querySelector(".foot__next");
  var prevName = document.querySelector(".foot__prev .name");
  var nextName = document.querySelector(".foot__next .name");
  var dotsWrap = document.querySelector(".foot__dots");

  if (totEl) totEl.textContent = String(total).padStart(2, "0");

  /* build dots */
  if (dotsWrap) {
    slides.forEach(function (s, i) {
      var b = document.createElement("button");
      b.setAttribute("aria-label", "Slide " + (i + 1));
      b.addEventListener("click", function () { s.scrollIntoView({ behavior: "smooth" }); });
      dotsWrap.appendChild(b);
    });
  }
  var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.children) : [];

  function setCurrent(i) {
    if (curEl) curEl.textContent = String(i + 1).padStart(2, "0");
    if (titleEl) titleEl.textContent = slides[i].getAttribute("data-name") || "";
    dots.forEach(function (d, idx) { d.classList.toggle("active", idx === i); });

    var prevIdx = i - 1, nextIdx = i + 1;
    if (prevBtn) {
      prevBtn.classList.toggle("disabled", prevIdx < 0);
      if (prevName) prevName.textContent = prevIdx >= 0 ? (slides[prevIdx].getAttribute("data-name") || "") : "";
      prevBtn.onclick = prevIdx >= 0 ? function () { slides[prevIdx].scrollIntoView({ behavior: "smooth" }); } : null;
    }
    if (nextBtn) {
      nextBtn.classList.toggle("disabled", nextIdx >= total);
      if (nextName) nextName.textContent = nextIdx < total ? (slides[nextIdx].getAttribute("data-name") || "") : "";
      nextBtn.onclick = nextIdx < total ? function () { slides[nextIdx].scrollIntoView({ behavior: "smooth" }); } : null;
    }
  }

  if (slides.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      var best = null, bestRatio = 0;
      entries.forEach(function (e) {
        if (e.intersectionRatio > bestRatio) { best = e.target; bestRatio = e.intersectionRatio; }
      });
      if (best) {
        var idx = slides.indexOf(best);
        if (idx >= 0) setCurrent(idx);
        best.classList.add("in-view");
        best.querySelectorAll("[data-reveal]").forEach(function (el) { el.classList.add("in"); });
        best.querySelectorAll(".bar__col[data-h]").forEach(function (b) { b.style.height = b.getAttribute("data-h"); });
        best.querySelectorAll("[data-count]").forEach(function (el) {
          if (el.dataset._done) return;
          el.dataset._done = "1";
          var target = parseFloat(el.getAttribute("data-count"));
          var suffix = el.getAttribute("data-suffix") || "";
          var prefix = el.getAttribute("data-prefix") || "";
          var dur = 1200, start = null;
          function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = prefix + Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      }
    }, { threshold: [0.25, 0.55, 0.85] });
    slides.forEach(function (s) { io.observe(s); });
    setCurrent(0);
  }

  /* ---- Scroll progress ---- */
  var progress = document.querySelector(".progress");
  function onScroll() {
    if (!progress) return;
    var h = document.documentElement;
    var sc = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
    progress.style.width = Math.max(0, Math.min(1, sc)) * 100 + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Keyboard nav ---- */
  document.addEventListener("keydown", function (e) {
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
    var current = -1;
    slides.forEach(function (s, i) {
      var r = s.getBoundingClientRect();
      if (r.top >= -50 && r.top <= window.innerHeight * 0.5) current = i;
    });
    if (current < 0) {
      var top = Infinity;
      slides.forEach(function (s, i) {
        var r = Math.abs(s.getBoundingClientRect().top);
        if (r < top) { top = r; current = i; }
      });
    }
    if ((e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") && current < total - 1) {
      e.preventDefault();
      slides[current + 1].scrollIntoView({ behavior: "smooth" });
    } else if ((e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "PageUp") && current > 0) {
      e.preventDefault();
      slides[current - 1].scrollIntoView({ behavior: "smooth" });
    }
  });

  /* ---- Mobile menu ---- */
  var burger = document.querySelector(".chrome__burger");
  var menu = document.querySelector(".menu");
  var menuClose = document.querySelector(".menu__close");
  if (burger && menu) {
    burger.addEventListener("click", function () { menu.classList.add("open"); document.body.style.overflow = "hidden"; });
    if (menuClose) menuClose.addEventListener("click", function () { menu.classList.remove("open"); document.body.style.overflow = ""; });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { menu.classList.remove("open"); document.body.style.overflow = ""; });
    });
  }

  /* ---- Compose -> mailto ---- */
  var form = document.querySelector("#compose-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = new FormData(form);
      var subject = encodeURIComponent("[pitch deck] " + (f.get("subject") || "from " + (f.get("name") || "the site")));
      var body = encodeURIComponent(
        "from: " + (f.get("name") || "") + " <" + (f.get("email") || "") + ">\n\n" +
        (f.get("message") || "")
      );
      var hint = form.querySelector(".hint");
      window.location.href = "mailto:sjruthvik99@gmail.com?subject=" + subject + "&body=" + body;
      if (hint) hint.textContent = "opening mail client…";
    });
  }
})();
