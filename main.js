/* Portfolio behavior: hero slideshow, filterable grid, reveal on scroll, lightbox, cursor */
(function () {
  var photos = (window.PHOTOS || []);
  var featured = photos.filter(function (p) { return p.category === "featured"; });
  var gallery = photos.filter(function (p) { return p.category !== "featured"; });
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Hero slideshow ----------
  var slidesEl = document.getElementById("heroSlides");
  var slideSrc = (featured.length ? featured : gallery.slice(0, 5));
  slideSrc.forEach(function (p, i) {
    var img = document.createElement("img");
    img.src = p.src; img.alt = p.alt || "";
    if (i > 0) img.loading = "lazy";
    if (i === 0) img.classList.add("is-active");
    slidesEl.appendChild(img);
  });
  var slides = slidesEl.querySelectorAll("img");
  if (slides.length > 1 && !reduceMotion) {
    var cur = 0;
    setInterval(function () {
      slides[cur].classList.remove("is-active");
      cur = (cur + 1) % slides.length;
      slides[cur].classList.add("is-active");
    }, 5000);
  }

  // ---------- Grid ----------
  var grid = document.getElementById("grid");
  var tiles = [];
  gallery.forEach(function (p, i) {
    var a = document.createElement("a");
    a.href = p.src; a.className = "tile"; a.dataset.category = p.category; a.dataset.index = i;
    var img = document.createElement("img");
    img.src = p.src; img.alt = p.alt || ""; img.loading = "lazy"; img.decoding = "async";
    var label = document.createElement("span");
    label.className = "tile__label"; label.textContent = p.category;
    a.appendChild(img); a.appendChild(label);
    grid.appendChild(a); tiles.push(a);
  });

  var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px" }) : null;
  function observe(t) { if (io) io.observe(t); else t.classList.add("is-in"); }
  tiles.forEach(observe);

  // ---------- Filters ----------
  var filters = document.getElementById("filters");
  filters.addEventListener("click", function (e) {
    var btn = e.target.closest(".filter"); if (!btn) return;
    filters.querySelectorAll(".filter").forEach(function (b) { b.classList.toggle("is-active", b === btn); });
    var f = btn.dataset.filter;
    tiles.forEach(function (t) {
      var show = (f === "all" || t.dataset.category === f);
      t.classList.toggle("is-hidden", !show);
      if (show) { t.classList.remove("is-in"); void t.offsetWidth; observe(t); }
    });
  });
  // Hide filter buttons for categories with no photos
  filters.querySelectorAll(".filter").forEach(function (b) {
    var f = b.dataset.filter;
    if (f !== "all" && !gallery.some(function (p) { return p.category === f; })) b.hidden = true;
  });

  // ---------- Lightbox ----------
  var lb = document.getElementById("lightbox"), lbImg = document.getElementById("lightboxImg"), lbCap = document.getElementById("lightboxCap");
  var order = [], pos = 0;
  function visibleTiles() { return tiles.filter(function (t) { return !t.classList.contains("is-hidden"); }); }
  function show() {
    var t = order[pos]; if (!t) return;
    var p = gallery[+t.dataset.index];
    lbImg.src = p.src; lbImg.alt = p.alt || ""; lbCap.textContent = (pos + 1) + " / " + order.length;
  }
  function open(t) { order = visibleTiles(); pos = order.indexOf(t); lb.hidden = false; document.body.style.overflow = "hidden"; show(); }
  function close() { lb.hidden = true; document.body.style.overflow = ""; }
  function step(d) { pos = (pos + d + order.length) % order.length; show(); }
  grid.addEventListener("click", function (e) {
    var t = e.target.closest(".tile"); if (!t) return;
    e.preventDefault(); open(t);
  });
  lb.querySelector(".lightbox__close").addEventListener("click", close);
  lb.querySelector(".lightbox__prev").addEventListener("click", function () { step(-1); });
  lb.querySelector(".lightbox__next").addEventListener("click", function () { step(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
  var sx = 0;
  lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) step(dx > 0 ? -1 : 1);
  });

  // ---------- Custom cursor ----------
  var cursor = document.querySelector(".cursor");
  if (cursor && window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("mousemove", function (e) {
      cursor.classList.add("is-on");
      cursor.style.left = e.clientX + "px"; cursor.style.top = e.clientY + "px";
    });
    document.addEventListener("mouseover", function (e) {
      cursor.classList.toggle("is-big", !!e.target.closest(".tile, a, button"));
    });
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
