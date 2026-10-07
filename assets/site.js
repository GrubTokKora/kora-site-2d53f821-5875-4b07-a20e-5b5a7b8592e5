/* JayaKrishna Arts — Ivory Museum behaviour: mobile menu, hero slideshow, reveal, quote rotator. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Shell anchors point at homepage sections; off the homepage, send them home.
  if (document.body.getAttribute('data-page') !== 'home') {
    document.querySelectorAll('.hdr a[href^="#"], .mnav a[href^="#"], .ftr a[href^="#"]').forEach(function (a) {
      a.setAttribute('href', '/' + a.getAttribute('href'));
    });
  }

  // Mobile menu (below 1000px, as in the design).
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');
  if (toggle && menu) {
    var setOpen = function (open) {
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'CLOSE' : 'MENU';
    };
    toggle.addEventListener('click', function () { setOpen(!menu.classList.contains('is-open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  // Hero slideshow: 6.5s crossfade with slow zoom, caption + counter + bars.
  var hero = document.querySelector('[data-slideshow]');
  if (hero) {
    var slides = hero.querySelectorAll('[data-slide]');
    var bars = hero.querySelectorAll('[data-dot]');
    var cap = hero.querySelector('[data-cap-out]');
    var num = hero.querySelector('[data-num]');
    var i = 0, timer = null;
    var show = function (n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
      bars.forEach(function (b, k) { b.classList.toggle('is-active', k === i); b.setAttribute('aria-current', String(k === i)); });
      if (cap) cap.textContent = slides[i].getAttribute('data-cap');
      if (num) num.textContent = '0' + (i + 1);
    };
    var start = function () {
      clearInterval(timer);
      if (!reduce) timer = setInterval(function () { show(i + 1); }, 6500);
    };
    bars.forEach(function (b, k) { b.addEventListener('click', function () { show(k); start(); }); });
    hero.addEventListener('focusin', function () { clearInterval(timer); });
    hero.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', function () { document.hidden ? clearInterval(timer) : start(); });
    show(0); start();
  }

  // Reveal on scroll, staggered by data-r (ms).
  var items = document.querySelectorAll('[data-r]');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var d = en.target.getAttribute('data-r') || '0';
        en.target.style.transitionDelay = d + 'ms';
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.1 });
    items.forEach(function (el) { io.observe(el); });
  }

  // Quote rotator.
  var q = document.querySelector('[data-quotes]');
  if (q) {
    var quotes = q.querySelectorAll('[data-quote]');
    var qn = q.querySelector('[data-q-num]');
    var qi = 0;
    var showQ = function (n) {
      qi = (n + quotes.length) % quotes.length;
      quotes.forEach(function (el, k) { el.hidden = k !== qi; });
      if (qn) qn.textContent = '0' + (qi + 1) + ' / 0' + quotes.length;
    };
    q.querySelector('[data-q-prev]').addEventListener('click', function () { showQ(qi - 1); });
    q.querySelector('[data-q-next]').addEventListener('click', function () { showQ(qi + 1); });
  }
})();
