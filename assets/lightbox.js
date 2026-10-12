/* JayaKrishna Arts — lightbox (plain JavaScript, no library).
   Any <a data-lb> inside a [data-lb-group] opens full screen. Navigation stays inside that group and
   skips works hidden by the gallery filter. Each link carries its full image in href and
   data-width / data-height / data-title / data-cat-label / data-note / data-inquire.
   Without JavaScript the link simply opens the image. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root, stage, img, counter, title, meta, inquire, btnPrev, btnNext, btnZoom, btnClose;
  var items = [], index = 0, opener = null, loadToken = 0;
  var zoom = 1, tx = 0, ty = 0, fitW = 0, fitH = 0;
  var MAX_ZOOM = 4;

  function el(tag, cls, attrs) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    for (var k in attrs || {}) n.setAttribute(k, attrs[k]);
    return n;
  }

  function icon(path) {
    return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + path + '"/></svg>';
  }

  function build() {
    root = el('div', 'lb', { role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Artwork viewer', tabindex: '-1' });
    var bar = el('div', 'lb__bar');
    counter = el('span', 'lb__count', { 'aria-live': 'polite' });
    var tools = el('div', 'lb__tools');
    btnZoom = el('button', 'lb__btn', { type: 'button', 'aria-label': 'Zoom in' });
    btnZoom.innerHTML = icon('M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4M11 8v6M8 11h6');
    btnClose = el('button', 'lb__btn', { type: 'button', 'aria-label': 'Close' });
    btnClose.innerHTML = icon('M6 6l12 12M18 6L6 18');
    tools.append(btnZoom, btnClose);
    bar.append(counter, tools);

    stage = el('div', 'lb__stage');
    img = el('img', 'lb__img', { alt: '', draggable: 'false' });
    var spinner = el('span', 'lb__spin', { 'aria-hidden': 'true' });
    stage.append(img, spinner);

    btnPrev = el('button', 'lb__nav lb__nav--prev', { type: 'button', 'aria-label': 'Previous work' });
    btnPrev.innerHTML = icon('M15 5l-7 7 7 7');
    btnNext = el('button', 'lb__nav lb__nav--next', { type: 'button', 'aria-label': 'Next work' });
    btnNext.innerHTML = icon('M9 5l7 7-7 7');

    var cap = el('div', 'lb__cap');
    var text = el('div');
    title = el('div', 'lb__t');
    meta = el('div', 'lb__m');
    text.append(title, meta);
    inquire = el('a', 'lb__a', { target: '_blank', rel: 'noopener' });
    inquire.textContent = 'Enquire about this work';
    cap.append(text, inquire);

    root.append(stage, bar, btnPrev, btnNext, cap);
    document.body.appendChild(root);

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', function () { go(-1); });
    btnNext.addEventListener('click', function () { go(1); });
    btnZoom.addEventListener('click', function () { setZoom(zoom > 1 ? 1 : zoomTarget()); });
    root.addEventListener('keydown', onKey);
    window.addEventListener('resize', function () { if (isOpen()) layout(); });
    bindPointer();
  }

  function isOpen() { return root && root.classList.contains('is-open'); }

  /* ── open / close ───────────────────────────────────────────── */
  function open(group, link) {
    if (!root) build();
    items = Array.prototype.slice.call(group.querySelectorAll('a[data-lb]')).filter(function (a) {
      return !a.closest('[hidden]');
    });
    index = Math.max(0, items.indexOf(link));
    opener = link;
    document.documentElement.classList.add('lb-lock');
    root.classList.add('is-open');
    root.classList.toggle('is-single', items.length < 2);
    requestAnimationFrame(function () { root.classList.add('is-visible'); });
    show(index);
    root.focus({ preventScroll: true });
  }

  function close() {
    if (!isOpen()) return;
    root.classList.remove('is-visible');
    document.documentElement.classList.remove('lb-lock');
    var done = function () { root.classList.remove('is-open'); img.removeAttribute('src'); };
    reduce ? done() : setTimeout(done, 250);
    if (opener) opener.focus({ preventScroll: true });
  }

  /* ── slides ─────────────────────────────────────────────────── */
  function data(a) {
    var thumb = a.querySelector('img');
    return {
      full: a.getAttribute('href'),
      thumb: thumb ? (thumb.currentSrc || thumb.src) : '',
      alt: thumb ? thumb.alt : '',
      w: Number(a.getAttribute('data-width')) || 1600,
      h: Number(a.getAttribute('data-height')) || 1200,
      title: a.getAttribute('data-title') || '',
      cat: a.getAttribute('data-cat-label') || '',
      note: a.getAttribute('data-note') || '',
      inquire: a.getAttribute('data-inquire') || ''
    };
  }

  function show(i) {
    index = (i + items.length) % items.length;
    var d = data(items[index]);
    var token = ++loadToken;
    resetZoom(true);
    root.classList.add('is-loading');
    img.alt = d.alt;
    img.src = d.thumb || d.full;            // instant: the grid already loaded the thumbnail
    img.dataset.w = d.w;
    img.dataset.h = d.h;
    layout();
    var full = new Image();
    full.onload = function () {
      if (token !== loadToken) return;      // user already moved on
      img.src = d.full;
      root.classList.remove('is-loading');
    };
    full.onerror = function () { if (token === loadToken) root.classList.remove('is-loading'); };
    full.src = d.full;

    counter.textContent = (index + 1) + ' / ' + items.length;
    title.textContent = d.title;
    meta.textContent = [d.cat, d.note].filter(Boolean).join(' · ');
    inquire.hidden = !d.inquire;
    if (d.inquire) inquire.href = d.inquire;

    // Warm the neighbours so next / previous feel instant.
    [index + 1, index - 1].forEach(function (n) {
      var a = items[(n + items.length) % items.length];
      if (a) new Image().src = a.getAttribute('href');
    });
  }

  function go(step) {
    if (items.length < 2) return;
    show(index + step);
  }

  /* ── sizing & zoom ──────────────────────────────────────────── */
  function layout() {
    var sw = stage.clientWidth, sh = stage.clientHeight;
    var w = Number(img.dataset.w), h = Number(img.dataset.h);
    var s = Math.min(sw / w, sh / h, 1);    // fit inside the stage, never upscale past full size
    fitW = Math.round(w * s);
    fitH = Math.round(h * s);
    img.style.width = fitW + 'px';
    img.style.height = fitH + 'px';
    clampPan();
    apply();
  }

  function zoomTarget() {
    var natural = Number(img.dataset.w) / fitW;      // 1:1 pixels
    return Math.min(MAX_ZOOM, Math.max(2, natural));
  }

  function setZoom(z, cx, cy) {
    var prev = zoom;
    zoom = z;
    if (z === 1) { tx = 0; ty = 0; }
    else if (cx !== undefined) {
      // keep the point under the cursor / finger in place
      var r = stage.getBoundingClientRect();
      var px = cx - (r.left + r.width / 2), py = cy - (r.top + r.height / 2);
      tx = px - (px - tx) * (z / prev);
      ty = py - (py - ty) * (z / prev);
    }
    clampPan();
    apply();
    root.classList.toggle('is-zoomed', zoom > 1);
    btnZoom.setAttribute('aria-label', zoom > 1 ? 'Zoom out' : 'Zoom in');
  }

  function resetZoom(silent) {
    zoom = 1; tx = 0; ty = 0;
    root.classList.remove('is-zoomed');
    if (btnZoom) btnZoom.setAttribute('aria-label', 'Zoom in');
    if (!silent) apply();
  }

  function clampPan() {
    var mx = Math.max(0, (fitW * zoom - stage.clientWidth) / 2);
    var my = Math.max(0, (fitH * zoom - stage.clientHeight) / 2);
    tx = Math.max(-mx, Math.min(mx, tx));
    ty = Math.max(-my, Math.min(my, ty));
  }

  function apply(dragX) {
    img.style.transform = 'translate(' + (tx + (dragX || 0)) + 'px,' + ty + 'px) scale(' + zoom + ')';
  }

  /* ── pointer: tap to zoom, drag to pan, swipe to navigate / close ── */
  function bindPointer() {
    var down = null, moved = false;
    stage.addEventListener('pointerdown', function (e) {
      if (e.button > 0) return;
      down = { x: e.clientX, y: e.clientY, tx: tx, ty: ty, onImage: e.target === img };  // capture retargets pointerup, so decide now
      moved = false;
      try { stage.setPointerCapture(e.pointerId); } catch (err) { /* pointer already gone */ }
      root.classList.add('is-dragging');
    });
    stage.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - down.x, dy = e.clientY - down.y;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
      if (zoom > 1) { tx = down.tx + dx; ty = down.ty + dy; clampPan(); apply(); }
      else if (Math.abs(dx) > Math.abs(dy)) apply(dx * 0.6);
      else img.style.transform = 'translate(0,' + Math.max(0, dy) * 0.6 + 'px)';
    });
    var end = function (e) {
      if (!down) return;
      var dx = e.clientX - down.x, dy = e.clientY - down.y;
      var onImage = down.onImage;
      down = null;
      root.classList.remove('is-dragging');
      if (zoom > 1) { if (!moved) setZoom(1); return; }
      if (moved && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) { go(dx < 0 ? 1 : -1); return; }
      if (moved && dy > 110 && dy > Math.abs(dx)) { close(); return; }
      apply();
      if (!moved) { onImage ? setZoom(zoomTarget(), e.clientX, e.clientY) : close(); }
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', function () { down = null; root.classList.remove('is-dragging'); apply(); });
    stage.addEventListener('wheel', function (e) {
      e.preventDefault();
      if (e.deltaY < 0 && zoom === 1) setZoom(zoomTarget(), e.clientX, e.clientY);
      else if (e.deltaY > 0 && zoom > 1) setZoom(1);
    }, { passive: false });
  }

  /* ── keyboard ───────────────────────────────────────────────── */
  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    else if (e.key === 'Tab') {
      var f = Array.prototype.slice.call(root.querySelectorAll('button, a[href]')).filter(function (n) {
        return !n.hidden && n.offsetParent !== null;
      });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === root)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  /* ── open on click ──────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[data-lb]');
    if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    var group = link.closest('[data-lb-group]');
    if (!group) return;
    e.preventDefault();
    open(group, link);
  });
})();
