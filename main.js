/* =========================================================
   SORRENTO · interacciones
   GSAP + ScrollTrigger + Lenis (con fallback si no cargan)
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;

  if (!hasGsap || reduced) {
    root.classList.remove('js');
    root.classList.add('no-anim');
  }
  $('#year').textContent = new Date().getFullYear();

  /* ---------------- Carta (datos de la carta real) ---------------- */
  const MENU = {
    'Entradas': [
      ['Jamón ibérico cortado a cuchillo', 'Con tomates a la española.'],
      ['Ostras frescas', 'Por unidad.'],
      ['Ostras gratinadas', 'Por unidad.'],
      ['Gambas al ajillo', 'Clásico de la casa.'],
      ['Langostinos con maracuyá y miel', '', ['Sugerencia']],
      ['Centolla Sorrento', 'Centolla, verdeo, crema y champiñones gratinados.', ['Sugerencia']],
      ['Pulpo a la feira', 'Con pimentón español, oliva italiano y papas al natural.'],
      ['Zamburiñas a la gallega', 'Cebolla, ajo, oliva y pimentón español.'],
      ['Fritata de mar', 'Rabas, calamarettis españoles y langostinos.'],
      ['Mejillones a la provenzal', ''],
      ['Rabas a la romana', ''],
      ['Tartar de salmón', ''],
    ],
    'Pescados & Mariscos': [
      ['Parrillada de mariscos y pescados', 'Calamarettis, pulpo, gambas, langostinos, mejillones, zamburiñas, salmón y merluza, con verduras grilladas.', ['Para compartir']],
      ['½ Cola de langosta Termidor', 'Crema, gambas, estragón, champignones y vino blanco.'],
      ['Salmón crocante', 'En costra de almendras, semillas y miel, con palta, cherry y huevo poché.'],
      ['Salmón rosado soja, miel y limón', 'Sobre arroz saborizado con espinacas y champignones.', ['Sugerencia']],
      ['Chernia', 'Con espinacas gratinadas y escamas de papas.'],
      ['Lenguado', 'Con aceite de ajo negro y salteado de tomates.'],
      ['Abadejo al pil pil', 'Oliva, ajo, gambas y tomate cherry.'],
      ['Merluza negra en salsa verde', ''],
      ['Bacalao noruego a la gallega', ''],
      ['Trucha patagónica a las finas hierbas', ''],
    ],
    'Arroces': [
      ['Paella de mariscos', 'Pulpo, langostinos, calamarettis, mejillones y pomodoro.'],
      ['Paella valenciana', 'Cerdo, conejo y pollo.'],
      ['Risotto cremoso de gambas', ''],
      ['Arroz negro con salmón y calamarettis', ''],
      ['Risotto de quinoa y salmón', '', ['Sin T.A.C.C.']],
      ['Risotto de quinoa y vegetales', '', ['Sin T.A.C.C.', 'Veggie']],
    ],
    'Pastas': [
      ['Sorrentinos negros', 'Rellenos de salmón y mascarpone, en salsa de crema de gambas y caviar.', ['De la casa']],
      ['Lasaña de salmón y langostinos', 'Crema, espinacas, salmón, langostinos y queso brie.'],
      ['Penne neri di sepia', 'Pomodoro y gambas.'],
      ['Linguini en salsa de langostinos', 'Con hierbas frescas.'],
      ['Ravioles de cabutia a los tres hongos', 'Champignones, gírgolas y portobellos.', ['Veggie']],
      ['Sorrentinos de mozzarella y jamón', 'En salsa mediterránea: tomate cherry, rúcula, ajo y aceitunas negras.'],
      ['Crepe de langostinos en salsa rosa', ''],
      ['Penne rigate a la putanesca', 'Pomodoro, anchoas, olivas negras y alcaparras.'],
      ['Spaghetti de arroz', 'Concasse de tomates, rúcula y alcaparras.', ['Sin T.A.C.C.']],
    ],
    'Carnes': [
      ['Lomo con puré trufado', 'Puerros braseados e hinojos.', ['Sugerencia']],
      ['Lomo al coñac', 'Con chips de papas.'],
      ['Ojo de bife', 'A la parrilla.'],
      ['Bife de chorizo', 'Entero o ½.'],
      ['Picaña', 'A la parrilla.'],
      ['Milanesa del puerto', 'De peceto, con espinacas, mozzarella, champignones, huevo frito y papas fritas.'],
      ['Pollo a la soja y miel', 'Con puré de batatas.'],
    ],
    'Postres': [
      ['Tiramisú de la nona', '', ['De la casa']],
      ['Petit gâteau de dulce de leche', ''],
      ['Volcán de chocolate', ''],
      ['Tarta de frutillas y pistachos', ''],
      ['Tentación de manzanas', ''],
      ['Mousse de chocolate con crocante', ''],
      ['Panqueque de dulce de leche', ''],
      ['Flan mixto', 'Con crema y/o dulce de leche.'],
    ],
  };

  const tabsEl = $('#menuTabs');
  const ink = $('#tabsInk');
  const list = $('#menuList');

  function renderDishes(cat) {
    list.innerHTML = MENU[cat].map(([name, desc, tags = []], i) => `
      <article class="dish">
        <span class="dish__n">${String(i + 1).padStart(2, '0')}</span>
        <div class="dish__name">${name}${desc ? `<span class="dish__desc">${desc}</span>` : ''}</div>
        <div class="dish__tags">${tags.map(t => `<span class="tag ${t === 'Sugerencia' || t === 'De la casa' ? 'tag--red' : ''}">${t}</span>`).join('')}</div>
      </article>`).join('');
    if (hasGsap && !reduced) {
      gsap.fromTo($$('.dish', list), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: 'power3.out', stagger: .045 });
    }
  }
  function moveInk(btn) {
    ink.style.width = btn.offsetWidth + 'px';
    ink.style.transform = `translateX(${btn.offsetLeft}px)`;
  }
  Object.keys(MENU).forEach((cat, i) => {
    const b = document.createElement('button');
    b.className = 'tab' + (i === 0 ? ' is-active' : '');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.innerHTML = `${cat}<sup>${MENU[cat].length}</sup>`;
    b.addEventListener('click', () => {
      $$('.tab', tabsEl).forEach(t => t.classList.remove('is-active'));
      b.classList.add('is-active');
      moveInk(b);
      b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      renderDishes(cat);
    });
    tabsEl.appendChild(b);
  });
  renderDishes(Object.keys(MENU)[0]);
  const syncInk = () => moveInk($('.tab.is-active', tabsEl));
  window.addEventListener('resize', syncInk);
  document.fonts?.ready.then(syncInk);
  syncInk();

  /* ---------------- Reservas ---------------- */
  const state = { guests: 2, date: null, time: null, area: 'Salón', shift: 'lunch' };
  const SHIFTS = {
    lunch: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'],
    dinner: ['19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'],
  };
  const form = $('#bookingForm');
  const steps = $$('.step', form);
  const dots = $$('.widget__steps span', form);
  let current = 1;

  const fmtDate = d => d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' });
  function setSummary(key, val) {
    const el = $(`[data-sum="${key}"]`);
    if (!el || el.textContent === val) return;
    el.textContent = val;
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 500);
  }

  // Personas
  const chips = $('#guestChips');
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'].forEach(n => {
    const c = document.createElement('button');
    c.type = 'button'; c.className = 'chip' + (n === '2' ? ' is-active' : ''); c.textContent = n;
    c.addEventListener('click', () => {
      $$('.chip', chips).forEach(x => x.classList.remove('is-active'));
      c.classList.add('is-active');
      state.guests = n;
      setSummary('guests', n);
    });
    chips.appendChild(c);
  });

  // Ambiente
  $$('input[name="area"]', form).forEach(r => r.addEventListener('change', () => { state.area = r.value; setSummary('area', r.value); }));

  // Calendario
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today); maxDate.setDate(maxDate.getDate() + 90);
  let view = new Date(today.getFullYear(), today.getMonth(), 1);

  function renderCalendar() {
    $('#calTitle').textContent = view.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
    const days = $('#calDays');
    days.innerHTML = '';
    const offset = (view.getDay() + 6) % 7; // lunes primero
    for (let i = 0; i < offset; i++) days.appendChild(document.createElement('span'));
    const total = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= total; d++) {
      const date = new Date(view.getFullYear(), view.getMonth(), d);
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'cal__day'; b.textContent = d;
      b.disabled = date < today || date > maxDate;
      if (+date === +today) b.classList.add('is-today');
      if (state.date && +date === +state.date) b.classList.add('is-active');
      b.addEventListener('click', () => {
        state.date = date; state.time = null;
        setSummary('date', fmtDate(date)); setSummary('time', '—');
        renderCalendar(); renderSlots();
      });
      days.appendChild(b);
    }
    $('[data-cal="-1"]').disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
    $('[data-cal="1"]').disabled = new Date(view.getFullYear(), view.getMonth() + 1, 1) > maxDate;
  }
  $$('[data-cal]').forEach(b => b.addEventListener('click', () => {
    view = new Date(view.getFullYear(), view.getMonth() + Number(b.dataset.cal), 1);
    renderCalendar();
  }));

  // Horarios: disponibilidad simulada (determinística según la fecha) para la demo
  function renderSlots() {
    const wrap = $('#slots');
    wrap.innerHTML = '';
    const seed = state.date ? state.date.getDate() * 7 + state.date.getMonth() : 0;
    const now = new Date();
    SHIFTS[state.shift].forEach((t, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'slot'; b.textContent = t;
      const [h, m] = t.split(':').map(Number);
      const isPast = state.date && +state.date === +today && (h * 60 + m) <= (now.getHours() * 60 + now.getMinutes() + 30);
      b.disabled = !state.date || isPast || ((seed + i * 3) % 7 === 0);
      if (state.time === t) b.classList.add('is-active');
      b.addEventListener('click', () => {
        state.time = t;
        $$('.slot', wrap).forEach(x => x.classList.remove('is-active'));
        b.classList.add('is-active');
        setSummary('time', t + ' hs');
      });
      wrap.appendChild(b);
    });
  }
  $$('[data-shift]').forEach(b => b.addEventListener('click', () => {
    $$('[data-shift]').forEach(x => x.classList.remove('is-active'));
    b.classList.add('is-active');
    state.shift = b.dataset.shift;
    renderSlots();
  }));

  function goTo(n) {
    current = n;
    steps.forEach(s => s.classList.toggle('is-active', Number(s.dataset.step) === n));
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i + 1 === n);
      d.classList.toggle('is-done', i + 1 < n);
    });
    $('#formError').textContent = '';
  }
  function shake(el) {
    if (hasGsap) gsap.fromTo(el, { x: -8 }, { x: 0, duration: .5, ease: 'elastic.out(1, .3)' });
  }
  $$('[data-next]', form).forEach(b => b.addEventListener('click', () => {
    if (current === 2 && (!state.date || !state.time)) {
      shake(!state.date ? $('#calendar') : $('#slots'));
      return;
    }
    goTo(current + 1);
  }));
  $$('[data-prev]', form).forEach(b => b.addEventListener('click', () => goTo(current - 1)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#fName'), phone = $('#fPhone');
    let ok = true;
    [name, phone].forEach(f => {
      const bad = f.value.trim().length < (f === phone ? 6 : 2);
      f.parentElement.classList.toggle('is-invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) { $('#formError').textContent = 'Completá tu nombre y un teléfono de contacto.'; shake(form); return; }

    const occasion = $('#fOccasion').value;
    const notes = $('#fNotes').value.trim();
    const lines = [
      '¡Hola Sorrento! Quiero reservar una mesa:',
      `• Personas: ${state.guests}`,
      `• Fecha: ${state.date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}`,
      `• Horario: ${state.time} hs`,
      `• Ambiente: ${state.area}`,
      `• Nombre: ${name.value.trim()}`,
      `• Teléfono: ${phone.value.trim()}`,
      occasion && `• Ocasión: ${occasion}`,
      notes && `• Comentarios: ${notes}`,
    ].filter(Boolean).join('\n');
    window.open('https://wa.me/5491121713357?text=' + encodeURIComponent(lines), '_blank', 'noopener');
    goTo(4);
  });
  $('#restart').addEventListener('click', () => { form.reset(); state.date = state.time = null; setSummary('date', '—'); setSummary('time', '—'); renderCalendar(); renderSlots(); goTo(1); });
  renderCalendar();
  renderSlots();

  /* ---------------- Header + menú mobile ---------------- */
  const header = $('#header');
  const burger = $('#burger');
  const toggleMenu = open => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open);
    $('#mobileMenu').setAttribute('aria-hidden', !open);
    if (lenis) open ? lenis.stop() : lenis.start();
  };
  burger.addEventListener('click', () => toggleMenu(!document.body.classList.contains('menu-open')));
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  let lastY = 0;
  const wa = $('.wa-float');
  function onScroll(y) {
    header.classList.toggle('is-scrolled', y > 40);
    header.classList.toggle('is-hidden', y > lastY && y > 400 && !document.body.classList.contains('menu-open'));
    wa.classList.toggle('is-visible', y > window.innerHeight * .6);
    lastY = y;
  }

  /* ---------------- Smooth scroll ---------------- */
  let lenis = null;
  if (hasGsap && !reduced && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: .09, wheelMultiplier: 1 });
    lenis.on('scroll', ({ scroll }) => { ScrollTrigger.update(); onScroll(scroll); });
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });
  }
  onScroll(window.scrollY);
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { duration: 1.6, easing: t => 1 - Math.pow(1 - t, 4) });
    else if (target === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    else target.scrollIntoView({ behavior: 'smooth' });
  }));

  /* ---------------- Cursor + magnético ---------------- */
  if (finePointer && hasGsap) {
    const cursor = $('#cursor'), label = $('#cursorLabel');
    const xTo = gsap.quickTo(cursor, 'x', { duration: .35, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: .35, ease: 'power3' });
    window.addEventListener('mousemove', e => { xTo(e.clientX); yTo(e.clientY); });
    document.addEventListener('mouseover', e => {
      const lab = e.target.closest('[data-cursor]');
      const hov = e.target.closest('a, button, label, input, select, textarea');
      cursor.classList.toggle('is-label', !!lab);
      cursor.classList.toggle('is-hover', !lab && !!hov);
      label.textContent = lab ? lab.dataset.cursor : '';
    });
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .5, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1, .4)' }));
    });
  } else {
    $('#cursor').remove();
  }

  /* ---------------- Partículas sobre el hero (luz en el agua) ---------------- */
  const canvas = $('#heroWater');
  if (canvas && !reduced) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, parts = [], mouse = { x: -999, y: -999 }, running = true;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, w / 16));
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.8 + .4, s: Math.random() * .35 + .08,
        a: Math.random() * .6 + .2, p: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener('resize', resize);
    $('#hero').addEventListener('mousemove', e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    new IntersectionObserver(([en]) => { running = en.isIntersecting; if (running) requestAnimationFrame(draw); }).observe(canvas);
    function draw(t) {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.s; p.x += Math.sin(t / 1800 + p.p) * .25;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 120) { p.x += dx / d * 1.2; p.y += dy / d * 1.2; }
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        const tw = .5 + .5 * Math.sin(t / 600 + p.p);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(170, 220, 255, ${p.a * tw})`;
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* ---------------- Marquee ---------------- */
  const mq = $('#marquee');
  mq.innerHTML += mq.innerHTML; // duplicar para loop infinito

  /* ---------------- Preloader + animaciones ---------------- */
  const loader = $('#loader');
  const imgs = ['img/cover.jpg', 'img/about_one.jpg', 'img/about_two.jpg', 'img/slider-contacto-2.jpg'];
  let loaded = 0;
  const progress = { v: 0 };
  const setProgress = v => {
    $('#loaderBar').style.width = v + '%';
    $('#loaderCount').textContent = String(Math.round(v)).padStart(2, '0');
  };
  const loadAll = Promise.all(imgs.map(src => new Promise(res => {
    const i = new Image(); i.onload = i.onerror = () => { loaded++; res(); }; i.src = src;
  })));
  const minTime = new Promise(r => setTimeout(r, reduced ? 0 : 1400));

  if (hasGsap && !reduced) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(progress, { v: 85, duration: 1.3, ease: 'power2.out', onUpdate: () => setProgress(Math.max(progress.v, 0)) });
  }

  Promise.all([loadAll, minTime]).then(() => {
    if (!hasGsap || reduced) {
      loader.remove();
      document.body.classList.remove('is-loading');
      return;
    }
    gsap.timeline()
      .to(progress, { v: 100, duration: .4, ease: 'power2.inOut', onUpdate: () => setProgress(progress.v) })
      .to('.loader__inner', { opacity: 0, y: -20, duration: .4 })
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, '-=.1')
      .add(() => { loader.remove(); document.body.classList.remove('is-loading'); lenis?.start(); }, '-=.3')
      .add(heroIntro(), '-=.65');
    lenis?.stop();
  });

  function heroIntro() {
    const tl = gsap.timeline();
    tl.fromTo('#heroImg', { scale: 1.35 }, { scale: 1.15, duration: 2.2, ease: 'expo.out' }, 0)
      .fromTo('.hero__title .word, .hero__title-accent', { yPercent: 110, opacity: 1 }, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: .12 }, .1)
      .fromTo('.hero__eyebrow, .hero__lead, .hero__ctas, .hero__side', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: .1 }, .5);
    return tl;
  }

  if (!hasGsap || reduced) return;

  // Texto dividido por palabras (respeta <em>)
  function splitWords(el) {
    const frag = document.createDocumentFragment();
    const walk = (node, em) => {
      node.childNodes.forEach(n => {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const mask = document.createElement('span'); mask.className = 'sw';
            const inner = document.createElement(em ? 'em' : 'span'); inner.textContent = part;
            mask.appendChild(inner); frag.appendChild(mask);
          });
        } else if (n.nodeType === 1) walk(n, em || n.tagName === 'EM');
      });
    };
    walk(el, false);
    el.innerHTML = ''; el.appendChild(frag);
    return $$('.sw > *', el);
  }
  $$('[data-split]').forEach(el => {
    const words = splitWords(el);
    gsap.fromTo(words, { yPercent: 115 }, {
      yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: .05,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  // Reveals genéricos
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: .08 }),
  });

  // Contadores
  $$('[data-count]').forEach(el => {
    const o = { n: 0 };
    gsap.to(o, { n: +el.dataset.count, duration: 2, ease: 'power2.out',
      onUpdate: () => (el.textContent = Math.round(o.n)),
      scrollTrigger: { trigger: el, start: 'top 90%' } });
  });

  // Revelado de imágenes
  $$('.img-reveal').forEach(w => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: w, start: 'top 85%' } });
    tl.to(w, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.inOut' })
      .to($('img', w), { scale: 1, duration: 1.8, ease: 'expo.out' }, '-=1.1');
  });

  // Parallax
  gsap.to('#heroImg', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__content', { y: -80, opacity: .2, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
  $$('[data-parallax]').forEach(el => {
    gsap.to(el, { yPercent: el.dataset.parallax * 100, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  $$('[data-parallax-img]').forEach(img => {
    gsap.fromTo(img, { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.closest('.events__media'), start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.fromTo('.booking__bg img', { scale: 1.2 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '#reservas', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.footer__giant', { yPercent: 40 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  // Marquee: velocidad reactiva al scroll
  const mqTween = gsap.to(mq, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
  ScrollTrigger.create({
    onUpdate: self => {
      const dir = self.direction === -1 ? -1 : 1;
      const v = Math.min(Math.abs(self.getVelocity()) / 400, 5);
      gsap.to(mqTween, { timeScale: dir * (1 + v), duration: .2, overwrite: true,
        onComplete: () => gsap.to(mqTween, { timeScale: dir, duration: 1.2 }) });
    },
  });

  // Galería horizontal (solo desktop)
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const track = $('#galleryTrack');
    const dist = () => Math.max(0, track.scrollWidth - (window.innerWidth - track.offsetLeft));
    gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: '#galleryPin', start: 'top top', pin: true, scrub: 1,
        end: () => '+=' + Math.max(0, dist()),
        invalidateOnRefresh: true,
        onUpdate: s => ($('#galleryProgress').style.width = s.progress * 100 + '%'),
      },
    });
    $$('.g-card img').forEach(img => gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: '#galleryPin', start: 'top top', end: () => '+=' + Math.max(0, dist()), scrub: true } }));
  });

  // Nav activo
  $$('main section[id]').forEach(sec => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 50%', end: 'bottom 50%',
      onToggle: s => s.isActive && $$('.nav__link').forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + sec.id)),
    });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
