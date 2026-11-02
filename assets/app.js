(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- i18n ---------------- */
  var EN = {
    'skip': 'Skip to the menu',
    'nav.menu': 'Menu', 'nav.beans': 'Coffee beans', 'nav.stories': 'Stories', 'nav.visit': 'Visit',
    'hero.eyebrow': 'Specialty coffee · Yavorov, Sofia',
    'hero.sub': 'Where every cup tells a story. 20 Tsar Ivan Asen II St, a few minutes from Orlov Most.',
    'cta.menu': 'See the menu', 'cta.directions': 'Directions',
    'hero.rating': 'on Google · 279 reviews',
    'story.5a': 'Coffee', 'story.5b': 'is a constant.',
    'counter.title': 'Where every cup <span class="script">tells a story.</span>',
    'perk.1t': 'Specialty coffee', 'perk.1': 'Specialty coffee with attention to sustainability.',
    'perk.2t': 'Italian blends', 'perk.2': 'Exclusive blends from a family-run Italian coffee company with over 100 years of history.',
    'perk.3': 'Come with your dog.',
    'perk.4k': 'Sun', 'perk.4t': 'Sundays too', 'perk.4': 'Since 1 November, Story Cups is open on Sundays too.',
    'menu.kicker': 'From the board behind the bar',
    'menu.lead': 'Pick a drink and see your cup: size, price and extras.',
    'menu.drink': 'Drink',
    'menu.note1': '* With a specialty variety', 'menu.note2': '** With alternative milk',
    'menu.spec': 'Specialty variety', 'menu.milk': 'Alternative milk',
    'season.kicker': 'Seasonal · ask at the bar',
    'season.text': 'Homemade pumpkin syrup, warm spices and velvety coffee. Tell us if it’s love at first sip.',
    'beans.kicker': 'Coffee beans · 100% Arabica',
    'beans.title': 'Take the story <span class="script">home.</span>',
    'bag.house': 'The Story Cups house blend', 'bag.best': 'Bestseller', 'bag.mexico': 'Our bestseller',
    'bag.origin': 'Specialty coffee', 'bag.origin2': 'Specialty coffee', 'bag.origin3': 'Specialty coffee',
    'beans.note': 'Ask at the bar or order online from <a href="https://coffeebox.bg/collections/story-cups-specialty-coffee" target="_blank" rel="noopener">Coffeebox.bg</a>.',
    'pull.kicker': 'At our stand, everyone draws their own story',
    'pull.title': 'Pull a <span class="script">story.</span>',
    'pull.lead': 'Little stories from the bar, just the way we tell them on Instagram.',
    'pull.btn': 'Pull the next one',
    'mom.kicker': 'Beyond the cup',
    'mom.title': 'Good coffee, good people, <span class="script">good stories.</span>',
    'mom.next': 'Coming up',
    'mom.e1': 'Story Cups × Cooltura. Saturday, 10:00 – 17:00, Sofia, Vasil Levski 59. Pop-up exclusives: Mont Blanc and Pumpkin Spice Matcha, a coffee quiz with prizes and a free tasting of our bestseller, Mexico SHG Prime.',
    'mom.t2': 'Our first Sunday', 'mom.may': 'May',
    'mom.e2': 'Since 1 November we’re open on Sundays too. For the Day of the People’s Enlighteners we gave guests 20 books signed by writer Georgi Gospodinov, who joined us for the day.',
    'mom.e3': 'Three days in front of NDK at the first specialty coffee festival in Bulgaria. Lots of coffee, tastings and stories.',
    'mom.e4': 'We’ll take care of the coffee. Fueling your Sunday, Italian style.',
    'mom.t5': 'Specialty coffee &amp; latte art workshop',
    'mom.e5': 'A talk on where coffee comes from and how to steam milk, then hands-on: espresso, cappuccino and homemade almond milk.',
    'mom.award': 'Story Cups at the European Coffee Trip Awards 2026',
    'visit.kicker': 'Come for coffee',
    'visit.title': 'You might leave <span class="script">with a story.</span>',
    'visit.addr': '20 Tsar Ivan Asen II St<br>Yavorov, 1124 Sofia',
    'visit.sunday': 'Now open on Sundays too',
    'foot.city': 'Sofia'
  };
  var BG = {};
  document.querySelectorAll('[data-i18n]').forEach(function (el) { BG[el.getAttribute('data-i18n')] = el.innerHTML; });
  var TITLE = { bg: document.title, en: 'Story Cups Specialty Coffee · Sofia' };

  function setLang(l) {
    var d = l === 'en' ? EN : BG;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (d[k] != null) el.innerHTML = d[k];
    });
    root.lang = l; document.title = TITLE[l];
    document.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === l)); });
    lang = l;
    renderMenu(); renderDeck(false);
    try { localStorage.setItem('sc-lang', l); } catch (e) {}
  }
  var lang = 'bg';
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });

  /* ---------------- header ---------------- */
  var top = document.getElementById('top');
  function onScroll() { top.classList.toggle('is-solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  /* ---------------- reveal ---------------- */
  var revs = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    revs.forEach(function (el) { io.observe(el); });
  } else { revs.forEach(function (el) { el.classList.add('is-in'); }); }

  /* ---------------- story player ---------------- */
  (function () {
    var story = document.getElementById('story'); if (!story) return;
    var slides = story.querySelectorAll('.slide');
    var bars = story.querySelector('.story-bars');
    var toggle = story.querySelector('.story-toggle');
    var DUR = 3200, i = 0, t = 0, last = 0, paused = false, held = false, visible = true;
    var fills = [];
    slides.forEach(function () { var s = document.createElement('span'); var f = document.createElement('i'); s.appendChild(f); bars.appendChild(s); fills.push(f); });
    function show(n) {
      i = (n + slides.length) % slides.length; t = 0;
      slides.forEach(function (s, k) {
        s.classList.toggle('is-active', k === i);
        // restart Ken Burns
        if (k === i) { var img = s.querySelector('img'); img.style.animation = 'none'; void img.offsetWidth; img.style.animation = ''; }
      });
      fills.forEach(function (f, k) { f.style.transform = 'scaleX(' + (k < i ? 1 : 0) + ')'; });
      // preload next
      var nx = slides[(i + 1) % slides.length].querySelector('img'); if (nx.loading === 'lazy') nx.loading = 'eager';
    }
    function running() { return !paused && !held && visible && !document.hidden; }
    function frame(now) {
      var dt = last ? now - last : 0; last = now;
      if (running() && !reduce) {
        t += dt;
        fills[i].style.transform = 'scaleX(' + Math.min(t / DUR, 1) + ')';
        if (t >= DUR) show(i + 1);
      }
      requestAnimationFrame(frame);
    }
    function setPaused(p) {
      paused = p; story.classList.toggle('is-paused', p);
      toggle.setAttribute('aria-label', p ? 'Play' : 'Pause');
    }
    if (reduce) { setPaused(true); fills[0].style.transform = 'scaleX(1)'; }
    toggle.addEventListener('click', function (e) { e.stopPropagation(); setPaused(!paused); });

    // tap zones: short tap = navigate, press & hold = pause (like Instagram)
    var downAt = 0, holdTimer = null;
    story.querySelectorAll('.story-tap').forEach(function (btn) {
      var dir = btn.classList.contains('prev') ? -1 : 1;
      btn.addEventListener('pointerdown', function () {
        downAt = Date.now();
        holdTimer = setTimeout(function () { held = true; story.classList.add('is-held'); }, 220);
      });
      function release() { clearTimeout(holdTimer); if (held) { held = false; story.classList.remove('is-held'); } }
      btn.addEventListener('pointerup', release);
      btn.addEventListener('pointercancel', release);
      btn.addEventListener('pointerleave', release);
      btn.addEventListener('click', function () {
        if (downAt && Date.now() - downAt > 220) { downAt = 0; return; } // was a hold
        downAt = 0; show(i + dir);
        if (reduce) fills[i].style.transform = 'scaleX(1)';
      });
    });
    // swipe
    var sx = null;
    story.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    story.addEventListener('touchend', function (e) {
      if (sx == null) return; var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 50) { clearTimeout(holdTimer); held = false; story.classList.remove('is-held'); downAt = 0; show(i + (dx < 0 ? 1 : -1)); }
    }, { passive: true });
    story.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { show(i + 1); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { show(i - 1); e.preventDefault(); }
      else if (e.key === ' ' && e.target === story) { setPaused(!paused); e.preventDefault(); }
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: .25 }).observe(story);
    }
    show(0); requestAnimationFrame(frame);
  })();

  /* ---------------- menu + cup builder ---------------- */
  // Prices exactly as on the menu board in the café (EUR).
  // type: cup | small | glass | tall ; milk: has milk ; coffee: coffee-based
  var DRINKS = [
    { n: 'Single Espresso', ml: 30, eur: 1.50, bgn: 2.93, cup: 'small', milk: 0, coffee: 1 },
    { n: 'Double Espresso', ml: 60, eur: 1.80, bgn: 3.52, cup: 'small', milk: 0, coffee: 1 },
    { n: 'Cappuccino', ml: 240, eur: 2.60, bgn: 5.09, cup: 'cup', milk: 1, coffee: 1 },
    { n: 'Flat White', ml: 240, eur: 3.10, bgn: 6.06, cup: 'cup', milk: 1, coffee: 1 },
    { n: 'Cortado', ml: 130, eur: 2.90, bgn: 5.67, cup: 'small', milk: 1, coffee: 1 },
    { n: 'Latte', ml: 360, eur: 3.10, bgn: 6.06, cup: 'tall', milk: 1, coffee: 1 },
    { n: 'Matcha Latte', ml: 240, eur: 3.20, bgn: 6.26, cup: 'cup', milk: 1, coffee: 0, matcha: 1 },
    { n: 'V60', ml: 250, eur: 4.00, bgn: 7.82, cup: 'cup', milk: 0, coffee: 1, black: 1 },
    { n: 'Cold Brew', ml: 200, eur: 4.50, bgn: 8.80, cup: 'glass', milk: 0, coffee: 1, black: 1 },
    { n: 'Iced Latte', ml: 360, eur: 3.40, bgn: 6.65, cup: 'glass', milk: 1, coffee: 1 },
    { n: 'Iced Matcha Latte', ml: 360, eur: 3.50, bgn: 6.85, cup: 'glass', milk: 1, coffee: 0, matcha: 1 },
    { n: 'Caffè Leccese', ml: 40, eur: 2.30, bgn: 4.50, cup: 'glass', milk: 0, coffee: 1, black: 1 }
  ];
  var EXTRA = { eur: 0.70, bgn: 1.37 };
  var cur = 'eur', sel = 2;
  var list = document.getElementById('drinks');
  var optSpec = document.getElementById('optSpec'), optMilk = document.getElementById('optMilk');
  function money(v) { return cur === 'eur' ? '€' + v.toFixed(2) : v.toFixed(2) + ' лв.'; }
  function renderMenu() {
    if (!list) return;
    list.innerHTML = '';
    DRINKS.forEach(function (d, k) {
      var li = document.createElement('li');
      var b = document.createElement('button'); b.type = 'button';
      b.setAttribute('aria-pressed', String(k === sel));
      b.innerHTML = '<span class="dn"></span><span class="dm">' + d.ml + ' ml</span><span class="dp">' + money(d[cur]) + '</span>';
      b.querySelector('.dn').textContent = d.n;
      b.addEventListener('click', function () { pick(k); });
      li.appendChild(b); list.appendChild(li);
    });
    document.querySelectorAll('.js-extra').forEach(function (el) { el.textContent = (el.tagName === 'EM' ? '+' : '') + money(EXTRA[cur]); });
    updateCup(false);
  }
  function pick(k) {
    sel = k;
    list.querySelectorAll('button').forEach(function (b, j) { b.setAttribute('aria-pressed', String(j === k)); });
    var d = DRINKS[k];
    if (!d.milk) optMilk.checked = false;
    if (!d.coffee) optSpec.checked = false;
    updateCup(true);
  }
  // cup geometry per type (outline path, fill top/bottom)
  var SHAPES = {
    small: { o: 'M60 104h80l-7 72a16 16 0 0 1-16 14H83a16 16 0 0 1-16-14z', h: 'M137 120h9a14 14 0 0 1 0 28h-11', top: 104, bot: 190 },
    cup: { o: 'M40 64h120l-10 116a20 20 0 0 1-20 18H70a20 20 0 0 1-20-18z', h: 'M157 92h10a20 20 0 0 1 0 40h-13', top: 64, bot: 198 },
    tall: { o: 'M48 30h104l-8 150a20 20 0 0 1-20 18H76a20 20 0 0 1-20-18z', h: 'M150 64h12a20 20 0 0 1 0 40h-14', top: 30, bot: 198 },
    glass: { o: 'M52 40h96l-10 148a12 12 0 0 1-12 10H74a12 12 0 0 1-12-10z', h: 'M150 64h0', top: 40, bot: 198 }
  };
  var svg = document.getElementById('cupsvg');
  function updateCup(anim) {
    if (!svg) return;
    var d = DRINKS[sel], s = SHAPES[d.cup];
    document.getElementById('cupOutline').setAttribute('d', s.o);
    document.getElementById('cupclipPath').setAttribute('d', s.o);
    document.getElementById('cupHandle').setAttribute('d', s.h);
    svg.classList.toggle('is-glass', d.cup === 'glass');
    svg.classList.toggle('is-matcha', !!d.matcha);
    svg.classList.toggle('no-foam', !d.milk);
    var maxMl = d.cup === 'small' ? 130 : d.cup === 'glass' ? 380 : 380;
    var frac = Math.max(.18, Math.min(.92, d.ml / maxMl));
    if (d.cup === 'cup' || d.cup === 'tall') frac = .86;
    var level = s.bot - (s.bot - s.top) * frac;
    var liq = document.getElementById('cupLiquid'), foam = document.getElementById('cupFoam');
    if (!anim) { liq.style.transition = 'none'; foam.style.transition = 'none'; liq.setAttribute('y', s.bot); foam.setAttribute('y', s.bot); void liq.getBoundingClientRect(); liq.style.transition = ''; foam.style.transition = ''; }
    else { liq.setAttribute('y', s.bot); foam.setAttribute('y', s.bot); void liq.getBoundingClientRect(); }
    requestAnimationFrame(function () {
      liq.setAttribute('y', level); foam.setAttribute('y', level - 2);
      foam.setAttribute('height', d.milk ? (d.cup === 'glass' ? 6 : 12) : 0);
    });
    document.getElementById('cupMl').textContent = d.ml + ' ml';
    document.getElementById('cupName').textContent = d.n;
    var p = d[cur] + (optSpec.checked ? EXTRA[cur] : 0) + (optMilk.checked ? EXTRA[cur] : 0);
    document.getElementById('cupPrice').textContent = money(Math.round(p * 100) / 100);
    optMilk.disabled = !d.milk; optSpec.disabled = !d.coffee;
    optMilk.closest('.switch').classList.toggle('is-off', !d.milk);
    optSpec.closest('.switch').classList.toggle('is-off', !d.coffee);
  }
  if (optSpec) { optSpec.addEventListener('change', function () { updateCup(false); }); optMilk.addEventListener('change', function () { updateCup(false); }); }
  document.querySelectorAll('[data-cur]').forEach(function (b) {
    b.addEventListener('click', function () {
      cur = b.getAttribute('data-cur');
      document.querySelectorAll('[data-cur]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      renderMenu();
    });
  });

  /* ---------------- beans shelf: drag + dots ---------------- */
  (function () {
    var shelf = document.getElementById('shelf'), dots = document.getElementById('shelfDots');
    if (!shelf) return;
    var bags = shelf.querySelectorAll('.bag');
    bags.forEach(function () { dots.appendChild(document.createElement('span')); });
    function upd() {
      var c = shelf.scrollLeft + shelf.clientWidth / 2, best = 0, bd = 1e9;
      bags.forEach(function (b, k) { var m = b.offsetLeft + b.offsetWidth / 2; var dd = Math.abs(m - c); if (dd < bd) { bd = dd; best = k; } });
      dots.querySelectorAll('span').forEach(function (s, k) { s.classList.toggle('on', k === best); });
    }
    shelf.addEventListener('scroll', function () { requestAnimationFrame(upd); }, { passive: true });
    upd();
    // mouse drag (touch scrolls natively)
    var down = false, sx = 0, sl = 0, moved = 0;
    shelf.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || shelf.scrollWidth <= shelf.clientWidth) return;
      down = true; moved = 0; sx = e.clientX; sl = shelf.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return; var dx = e.clientX - sx; moved = Math.abs(dx);
      if (moved > 4) shelf.classList.add('is-drag');
      shelf.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () { if (!down) return; down = false; shelf.classList.remove('is-drag'); });
    shelf.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { shelf.scrollBy({ left: 260, behavior: 'smooth' }); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { shelf.scrollBy({ left: -260, behavior: 'smooth' }); e.preventDefault(); }
    });
  })();

  /* ---------------- pull a story deck ---------------- */
  // Lines are taken from Story Cups' own Instagram posts.
  var STORIES = [
    { img: 'sip', en: 'Coffee snob spotted in the wild.', bg: 'Coffee snob spotted in the wild.' },
    { img: 'portafilter', en: 'Not all superheroes wear capes. Some carry a portafilter.', bg: 'Not all superheroes wear capes. Some carry a portafilter.' },
    { img: 'grinder', en: 'Everything starts with precision. Then comes the aroma.', bg: 'Всичко започва с прецизност. После идва ароматът.' },
    { img: 'heart', en: 'We don’t break hearts. Unless they’re chocolate and pistachio.', bg: 'Не разбиваме сърца. Освен ако не са от шоколад и шамфъстък.' },
    { img: 'marzocco', en: 'The perfect shot. Literally.', bg: 'The perfect shot. Literally.' },
    { img: 'snowflake', en: 'Snowflakes falling, coffee brewing, Christmas magic is here.', bg: 'Снежинките падат, кафето ухае и магията на Коледа е тук.' },
    { img: 'coldbrew-bottle', en: 'Cold. Brew. Repeat.', bg: 'Cold. Brew. Repeat.' },
    { img: 'honduras', en: 'Press play and dive into the aroma.', bg: 'Натисни play и се потопи в аромата.' }
  ];
  var deck = document.getElementById('deck'), countEl = document.getElementById('pullCount');
  var order = STORIES.map(function (_, k) { return k; }), pos = 0, busy = false;
  function cardHTML(s, k) {
    return '<div class="stamp"><div class="card-img"><img src="assets/img/' + s.img + '.webp" alt="" width="800" height="1000" loading="lazy"></div>' +
      '<p class="card-txt"></p></div><span class="card-no">no. ' + String(k + 1).padStart(2, '0') + '</span>';
  }
  function renderDeck() {
    if (!deck) return;
    deck.innerHTML = '';
    var n = Math.min(4, order.length);
    for (var j = n - 1; j >= 0; j--) {
      var k = order[(pos + j) % order.length];
      var c = document.createElement('div'); c.className = 'card';
      c.innerHTML = cardHTML(STORIES[k], k);
      c.querySelector('.card-txt').textContent = STORIES[k][lang];
      c.style.setProperty('--i', j);
      c.style.zIndex = String(10 - j);
      if (j > 0) c.setAttribute('aria-hidden', 'true');
      deck.appendChild(c);
    }
    if (countEl) countEl.textContent = String((pos % order.length) + 1).padStart(2, '0') + ' / ' + String(order.length).padStart(2, '0');
  }
  function pull() {
    if (busy || !deck) return; busy = true;
    var topCard = deck.lastElementChild;
    topCard.classList.add('is-out');
    // shift the rest up
    Array.prototype.forEach.call(deck.children, function (c) {
      if (c === topCard) return; var v = +c.style.getPropertyValue('--i'); c.style.setProperty('--i', v - 1);
    });
    setTimeout(function () { pos = (pos + 1) % order.length; renderDeck(); busy = false; }, reduce ? 150 : 520);
  }
  if (deck) {
    deck.addEventListener('click', pull);
    deck.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pull(); } });
    var dsx = null;
    deck.addEventListener('touchstart', function (e) { dsx = e.touches[0].clientX; }, { passive: true });
    deck.addEventListener('touchend', function (e) { if (dsx == null) return; var dx = e.changedTouches[0].clientX - dsx; dsx = null; if (Math.abs(dx) > 40) pull(); }, { passive: true });
    document.getElementById('pullBtn').addEventListener('click', pull);
  }

  /* ---------------- init ---------------- */
  var saved = null;
  try { saved = localStorage.getItem('sc-lang'); } catch (e) {}
  setLang(saved === 'en' ? 'en' : 'bg');
})();
