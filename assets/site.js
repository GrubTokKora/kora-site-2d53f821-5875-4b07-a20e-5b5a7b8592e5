/* JayaKrishna Arts — Ivory Museum behaviour: mobile menu, hero slideshow, reveal, quote rotator. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Shell anchors point at homepage sections; off the homepage, send them home.
  if (document.body.getAttribute('data-page') !== 'home') {
    document.querySelectorAll('.hdr a[href^="#"], .mnav a[href^="#"], .ftr a[href^="#"]').forEach(function (a) {
      a.setAttribute('href', '/' + a.getAttribute('href'));
    });
  }

  // Sticky header: compact state with hysteresis (no flicker at the threshold) + reading progress.
  var hdr = document.querySelector('[data-header]');
  if (hdr) {
    var ticking = false;
    var onScroll = function () {
      ticking = false;
      var y = window.scrollY;
      if (y > 80) hdr.classList.add('is-scrolled');
      else if (y < 20) hdr.classList.remove('is-scrolled');
      var max = document.documentElement.scrollHeight - window.innerHeight;
      hdr.style.setProperty('--progress', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  // Mobile menu (below 1000px): full-screen panel, animated toggle, scroll lock, focus handling.
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-menu]');
  var header = document.querySelector('.hdr');
  if (toggle && menu) {
    var setHeaderHeight = function () {
      if (header) document.documentElement.style.setProperty('--hdr-h', header.getBoundingClientRect().height + 'px');
    };
    var isOpen = function () { return menu.classList.contains('is-open'); };
    var setOpen = function (open, restoreFocus) {
      setHeaderHeight();
      menu.classList.toggle('is-open', open);
      document.documentElement.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (open) {
        var first = menu.querySelector('a');
        if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 350);
      } else if (restoreFocus) {
        toggle.focus({ preventScroll: true });
      }
    };
    toggle.addEventListener('click', function () { setOpen(!isOpen(), true); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false, false); });
    document.addEventListener('keydown', function (e) {
      if (!isOpen()) return;
      if (e.key === 'Escape') { setOpen(false, true); return; }
      if (e.key === 'Tab') {   // keep focus inside menu + toggle while open
        var f = [toggle].concat(Array.prototype.slice.call(menu.querySelectorAll('a')));
        var i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    window.addEventListener('resize', function () {
      setHeaderHeight();
      if (window.innerWidth >= 1000 && isOpen()) setOpen(false, false);
    });
    setHeaderHeight();
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

/* Gallery filters, category links and the "Living with art" rail. */
(function () {
  var gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    var buttons = gallery.querySelectorAll('[data-filter]');
    var tiles = gallery.querySelectorAll('.tile');
    var status = gallery.querySelector('[data-gallery-status]');
    var names = { all: 'all', abstract: 'abstract', watercolor: 'watercolor', portraits: 'portrait', landscape: 'landscape' };
    var apply = function (cat) {
      var shown = 0;
      tiles.forEach(function (t) {
        var on = cat === 'all' || t.getAttribute('data-cat') === cat;
        t.hidden = !on;
        if (on) shown++;
      });
      buttons.forEach(function (b) {
        var on = b.getAttribute('data-filter') === cat;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      if (status) status.textContent = 'Showing ' + shown + ' ' + (cat === 'all' ? '' : names[cat] + ' ') + 'works';
    };
    buttons.forEach(function (b) { b.addEventListener('click', function () { apply(b.getAttribute('data-filter')); }); });
    // Category cards, "View all" and footer links open the gallery pre-filtered.
    document.querySelectorAll('[data-filter-link]').forEach(function (a) {
      a.addEventListener('click', function () { apply(a.getAttribute('data-filter-link')); });
    });
  }

  document.querySelectorAll('[data-rail]').forEach(function (root) {
    var track = root.querySelector('[data-rail-track]');
    var prev = root.querySelector('[data-rail-prev]');
    var next = root.querySelector('[data-rail-next]');
    if (!track || !prev || !next) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var step = function (dir) { track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' }); };
    var sync = function () {
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };
    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    window.addEventListener('load', sync);
    sync();
  });
})();
