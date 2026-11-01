(() => {
  const S = window.SITE;
  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.title = S.title;
  $('#gateTitle').textContent = S.tagline;
  $('#tagline').textContent = S.tagline;
  $('#foot').textContent = S.footer;
  $('#framesTitle').textContent = S.frames.title;
  $('#framesLede').textContent = S.frames.lede;

  /* Tên: mỗi chữ một span để hiện dần từ mờ sang nét */
  const nameEl = $('#name');
  nameEl.setAttribute('aria-label', S.name);
  [...S.name].forEach((c, i) => {
    const s = el('span', 'ch', c === ' ' ? '\u00a0' : c);
    s.style.setProperty('--i', i); s.setAttribute('aria-hidden', 'true');
    nameEl.appendChild(s);
  });

  /* Gallery: các "phòng" triển lãm */
  const grid = $('#grid');
  const SPEED = [0.1, -0.07, 0.14];
  S.frames.rooms.forEach((r) => {
    const room = el('div', 'room room--' + r.layout);
    const word = el('p', 'room__word', r.title); word.setAttribute('aria-hidden', 'true');
    room.appendChild(word);
    r.items.forEach((idx, k) => {
      const f = S.frames.items[idx];
      const b = el('button', 'art art--' + (k + 1)); b.type = 'button'; b.dataset.i = idx; b.sp = SPEED[k % 3];
      const inner = el('span', 'art__in'); const fr = el('span', 'art__frame');
      const img = el('img'); img.src = f.src; img.alt = f.alt; img.loading = 'lazy';
      fr.appendChild(img); inner.append(fr, el('span', 'art__cap', f.caption)); b.appendChild(inner);
      room.appendChild(b);
    });
    grid.appendChild(room);
  });

  /* Màu trả lại dần khi khung ảnh tới giữa màn hình, kèm parallax nhẹ */
  const arts = [...grid.querySelectorAll('.art')], rooms = [...grid.querySelectorAll('.room')];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  let busy = false;
  function paint() {
    busy = false; const h = innerHeight;
    arts.forEach((a) => {
      const r = a.getBoundingClientRect(); if (r.bottom < -300 || r.top > h + 300) return;
      const c = (r.top + r.height / 2 - h / 2) / h;
      a.style.setProperty('--c', clamp(1 - Math.abs(c) * 2.4, 0, 1).toFixed(3));
      if (!reduce) a.style.setProperty('--y', (c * a.sp * 400).toFixed(1) + 'px');
    });
    if (!reduce) rooms.forEach((m) => {
      const r = m.getBoundingClientRect(); if (r.bottom < -300 || r.top > h + 300) return;
      m.style.setProperty('--wy', (((r.top + r.height / 2 - h / 2) / h) * -140).toFixed(1) + 'px');
    });
  }
  const queue = () => { if (!busy) { busy = true; requestAnimationFrame(paint); } };
  addEventListener('scroll', queue, { passive: true }); addEventListener('resize', queue); paint();

  /* Puzzle: hoán đổi mảnh bằng click hoặc kéo thả */
  const P = S.puzzle;
  $('#pzTitle').textContent = P.title; $('#pzLede').textContent = P.lede;
  $('#wishTitle').textContent = P.wish.title; $('#wishSign').textContent = '— ' + P.wish.sign; $('#wishLock').textContent = P.locked;
  P.wish.text.split('\n\n').forEach((t, i) => { const p = el('p', '', t); p.style.setProperty('--i', i); $('#wishBody').appendChild(p); });

  const board = $('#board'), ref = $('#ref'), wish = $('#wish'), movesEl = $('#moves'), timeEl = $('#time');
  let n = 4, imgIdx = 0, order = [], els = [], sel = null, moves = 0, secs = 0, tm = null, solved = false, drag = null, token = 0;
  const fmt = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');

  function build() {
    const t = ++token, f = S.frames.items[imgIdx], im = new Image();
    im.onload = () => {
      if (t !== token) return;
      board.style.aspectRatio = im.naturalWidth + '/' + im.naturalHeight;
      board.style.setProperty('--r', im.naturalWidth / im.naturalHeight);
      board.style.setProperty('--n', n); ref.src = f.src; ref.alt = f.alt;
      els = [...Array(n * n)].map((_, id) => {
        const b = el('button', 'pz__piece'); b.type = 'button'; b.dataset.id = id;
        b.style.backgroundImage = 'url(' + f.src + ')';
        b.style.backgroundSize = n * 100 + '% ' + n * 100 + '%';
        b.style.backgroundPosition = ((id % n) / (n - 1)) * 100 + '% ' + (Math.floor(id / n) / (n - 1)) * 100 + '%';
        b.setAttribute('aria-label', 'Piece ' + (id + 1)); return b;
      });
      reset();
    };
    im.src = f.src;
  }
  function render() { board.replaceChildren(ref, ...order.map((i) => els[i])); if (sel) sel.classList.add('sel'); }
  function reset() {
    clearInterval(tm); tm = null; secs = 0; moves = 0; solved = false; sel = null;
    movesEl.textContent = 0; timeEl.textContent = '0:00';
    board.classList.remove('done'); wish.classList.remove('open');
    order = els.map((_, i) => i);
    do { for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; } }
    while (order.every((v, i) => v === i));
    render();
  }
  function win() {
    solved = true; clearInterval(tm); board.classList.add('done'); wish.classList.add('open');
    setTimeout(() => wish.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }), 1800);
  }
  function swap(a, b) {
    const i = order.indexOf(+a.dataset.id), j = order.indexOf(+b.dataset.id);
    [order[i], order[j]] = [order[j], order[i]];
    movesEl.textContent = ++moves;
    if (!tm) tm = setInterval(() => { timeEl.textContent = fmt(++secs); }, 1000);
    sel = null; a.classList.remove('sel'); render();
    [a, b].forEach((x) => { x.classList.add('pop'); setTimeout(() => x.classList.remove('pop'), 400); });
    b.focus({ preventScroll: true });
    if (order.every((v, k) => v === k)) win();
  }
  function choose(p) {
    if (solved) return;
    if (!sel) { sel = p; p.classList.add('sel'); }
    else if (sel === p) { p.classList.remove('sel'); sel = null; }
    else swap(sel, p);
  }

  board.addEventListener('pointerdown', (e) => {
    const p = e.target.closest('.pz__piece'); if (!p || solved) return;
    drag = { p, x: e.clientX, y: e.clientY, on: false, touch: e.pointerType === 'touch' };
    if (!drag.touch) p.setPointerCapture(e.pointerId);
  });
  board.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y, d = Math.hypot(dx, dy);
    if (drag.touch) { if (d > 10) drag = null; return; }
    if (!drag.on && d > 6) { drag.on = true; drag.p.classList.add('lift'); }
    if (drag.on) drag.p.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(1.04)';
  });
  board.addEventListener('pointerup', (e) => {
    if (!drag) return;
    const { p, on } = drag; drag = null;
    p.style.transform = ''; p.classList.remove('lift');
    if (!on) return choose(p);
    const t = document.elementsFromPoint(e.clientX, e.clientY).find((x) => x !== p && x.classList.contains('pz__piece'));
    if (t) { if (sel) { sel.classList.remove('sel'); sel = null; } swap(p, t); }
  });
  board.addEventListener('pointercancel', () => { if (drag) { drag.p.style.transform = ''; drag.p.classList.remove('lift'); drag = null; } });
  board.addEventListener('click', (e) => { if (e.detail === 0) { const p = e.target.closest('.pz__piece'); if (p) choose(p); } });

  const pickEl = $('#pick'), lvlEl = $('#lvl');
  S.frames.items.forEach((f, i) => {
    const b = el('button', 'pz__thumb'); b.type = 'button'; b.setAttribute('aria-label', f.caption); b.setAttribute('aria-pressed', i === imgIdx);
    const im = el('img'); im.src = f.src; im.alt = ''; b.appendChild(im);
    b.onclick = () => { imgIdx = i; [...pickEl.children].forEach((x, k) => x.setAttribute('aria-pressed', k === i)); build(); };
    pickEl.appendChild(b);
  });
  [[3, 'Easy'], [4, 'Medium'], [5, 'Hard']].forEach(([v, label]) => {
    const b = el('button', 'pill', label + ' ' + v + '×' + v); b.type = 'button'; b.setAttribute('aria-pressed', v === n);
    b.onclick = () => { n = v; [...lvlEl.children].forEach((x) => x.setAttribute('aria-pressed', x === b)); build(); };
    lvlEl.appendChild(b);
  });
  $('#shuffle').onclick = () => { if (els.length) reset(); };
  const peek = $('#peek');
  ['pointerdown'].forEach((t) => peek.addEventListener(t, () => board.classList.add('peek')));
  ['pointerup', 'pointerleave', 'pointercancel', 'blur'].forEach((t) => peek.addEventListener(t, () => board.classList.remove('peek')));
  build();

  /* Cuộn: video mờ dần */
  addEventListener('scroll', () => {
    document.body.style.setProperty('--p', Math.min(1, scrollY / innerHeight).toFixed(3));
  }, { passive: true });

  /* Nhạc, video, quote, nhịp */
  const audio = $('#bgm'), video = $('#bgv'), vblur = $('#bgvBlur'), quote = $('#quote'), hero = $('#hero');
  const gate = $('#gate'), soundBtn = $('#sound');
  let ctx, analyser, bins, level = 0, cur = null, timer, dbg;

  function setupAnalyser() {
    /* Web Audio bị chặn với file://, chỉ bật khi chạy qua http(s) */
    if (reduce || !/^https?:/.test(location.protocol)) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      const src = ctx.createMediaElementSource(audio);
      analyser = ctx.createAnalyser(); analyser.fftSize = 256;
      src.connect(analyser); analyser.connect(ctx.destination);
      bins = new Uint8Array(analyser.frequencyBinCount);
    } catch (e) { analyser = null; }
  }

  function showQuote(q) {
    if (q === cur) return;
    cur = q; clearTimeout(timer); quote.classList.remove('on');
    if (q) timer = setTimeout(() => { quote.textContent = q.text; quote.classList.add('on'); }, 450);
  }

  function tick() {
    const t = audio.currentTime;
    if (analyser) {
      analyser.getByteFrequencyData(bins);
      let s = 0; for (let i = 0; i < 5; i++) s += bins[i];
      level += (s / 5 / 255 - level) * 0.25;
      hero.style.setProperty('--pulse', Math.min(1, Math.max(0, level - 0.4) * 2.2).toFixed(3));
    }
    showQuote(S.quotes.find((q) => t >= q.t && t < q.t + q.d) || null);
    if (dbg) dbg.textContent = t.toFixed(2) + 's';
    requestAnimationFrame(tick);
  }

  $('#enter').addEventListener('click', async () => {
    gate.classList.add('open'); document.body.classList.add('entered');
    setupAnalyser();
    if (ctx && ctx.state === 'suspended') ctx.resume();
    try { await audio.play(); } catch (e) {}
    video.play().catch(() => {});
    if (getComputedStyle(vblur).display !== 'none') vblur.play().catch(() => {});
    if (location.search.includes('debug')) { dbg = el('div', 'dbg'); document.body.appendChild(dbg); }
    requestAnimationFrame(tick);
    setTimeout(() => { gate.hidden = true; }, 1400);
  });

  soundBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    soundBtn.setAttribute('aria-pressed', audio.muted);
    soundBtn.setAttribute('aria-label', audio.muted ? 'Unmute sound' : 'Mute sound');
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.body.classList.contains('entered')) return;
    if (document.hidden) { audio.pause(); video.pause(); vblur.pause(); }
    else { audio.play().catch(() => {}); video.play().catch(() => {}); if (getComputedStyle(vblur).display !== 'none') vblur.play().catch(() => {}); }
  });

  /* Giữ bản mờ đồng bộ với video chính */
  video.addEventListener('timeupdate', () => { if (!vblur.paused && Math.abs(vblur.currentTime - video.currentTime) > 0.4) vblur.currentTime = video.currentTime; });

  /* Lightbox */
  const lb = $('#lb'); let idx = 0;
  const open = (i) => {
    idx = (i + S.frames.items.length) % S.frames.items.length;
    const f = S.frames.items[idx];
    $('#lbImg').src = f.src; $('#lbImg').alt = f.alt; $('#lbCap').textContent = f.caption;
    if (!lb.open) lb.showModal();
  };
  grid.addEventListener('click', (e) => { const b = e.target.closest('.art'); if (b) open(+b.dataset.i); });
  $('#lbX').onclick = () => lb.close();
  $('#lbP').onclick = () => open(idx - 1);
  $('#lbN').onclick = () => open(idx + 1);
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') open(idx - 1); if (e.key === 'ArrowRight') open(idx + 1); });
})();
