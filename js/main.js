/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'bonta-senza-glutine-barona',
    /* WhatsApp per gli ordini: lo pubblicano loro (bio Instagram e post del 22/6/2026) */
    whatsapp: {
      number: '393515223305',
      message: 'Buongiorno, vorrei fare un ordine: ',
      ids: ['waApertura', 'waFatto', 'waOrari', 'waBarra'],
    },
    /* Google (29/9/2026): lunedì 7:30–13, martedì–venerdì 7:30–14 e 16–18, sabato e domenica 8–12 */
    hours: {
      0: [['08:00', '12:00']],
      1: [['07:30', '13:00']],
      2: [['07:30', '14:00'], ['16:00', '18:00']],
      3: [['07:30', '14:00'], ['16:00', '18:00']],
      4: [['07:30', '14:00'], ['16:00', '18:00']],
      5: [['07:30', '14:00'], ['16:00', '18:00']],
      6: [['08:00', '12:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1040,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Bontà senza Glutine: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.banco": "The counter",
      "n.fatto": "Made here",
      "n.giornata": "The day",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "n.domande": "Questions",
      "t.chiama": "Call",
      "t.whatsapp": "Orders on WhatsApp",
      "t.indicazioni": "Directions",
      "h.sopra": "Café · pastry shop · bakery · Via Ettore Ponti 53, Milan",
      "h.titolo": "All gluten-free, from sweet to savoury.",
      "h.testo": "Breakfast, lunch and afternoon snacks in the Barona: brioches and cakes, filled focaccine, pizzette and lunch dishes, all made by them. The whole counter is gluten-free: you choose without having to ask.",
      "h.chi": "from a review on Google (in Italian: «Quasi non ti accorgi della differenza», you can hardly tell the difference)",
      "h.google": "on Google, 101 reviews",
      "p.titolo": "Focaccine baciate",
      "p.desc": "Inside the burgundy circle, a gluten-free focaccina on the aluminium tray: the filling falls in layer by layer, then the top half comes down and «kisses» the bottom one. Vegetables, beef strips or bresaola.",
      "p.d0": "Grilled vegetables and the dark glaze, like in their photo.",
      "p.d1": "Beef strips, lettuce and tomato.",
      "p.d2": "Bresaola, aubergine and cream cheese.",
      "p.modi": "Which filling",
      "p.b0": "Vegetables",
      "p.b1": "Beef strips",
      "p.b2": "Bresaola",
      "b.etichetta": "The counter",
      "b.titolo": "From sweet to savoury",
      "b.sotto": "«Here you will find only gluten-free products, from sweet to savoury»: they write it themselves, and it is the counter as it is every morning.",
      "b.dolce": "Sweet",
      "b.dolcev": "Brioches and fagottini with custard, chocolate or jam; puff pastries and croissants, cream puffs, tartlets and fruit pastries, Sicilian cannoli, biscuits, cakes. Colomba at Easter, chiacchiere at Carnival.",
      "b.salato": "Savoury",
      "b.salatov": "Focaccia and focaccine baciate, pizzette, olive sticks, savoury pies, bread, fresh ravioli; at lunch, hot and cold dishes.",
      "a.cuore": "A heart-shaped cake glazed with chocolate, with strawberries, raspberries, blackberries and blueberries, the red frill and the gold board.",
      "c.cuore": "The chocolate heart cake.",
      "a.focaccine": "Two filled focaccine baciate on the aluminium tray: one with grilled vegetables and a dark glaze, one with beef strips, lettuce and tomato.",
      "c.focaccine": "The focaccine baciate.",
      "a.sfoglie": "Filled puff pastries with chocolate threads, in a tray in the counter.",
      "c.sfoglie": "Puff pastries with chocolate threads.",
      "a.bastoncini": "Long golden olive bread sticks on the tray.",
      "c.bastoncini": "The olive sticks.",
      "a.salata": "A golden savoury pie on a gold doily.",
      "c.salata": "A savoury pie.",
      "a.biscotti": "Iced Halloween biscuits: ghosts, pumpkins and black cats.",
      "c.biscotti": "The Halloween biscuits.",
      "a.focaccia": "A whole focaccia in an aluminium tray.",
      "c.focaccia": "The focaccia.",
      "a.banco": "The pastry counter: small pastries, cream puffs, fruit tartlets and chocolates on two shelves.",
      "c.banco": "The pastry counter.",
      "f.etichetta": "Made here",
      "f.titolo": "They make it themselves",
      "f.sotto": "The colomba in their oven at Easter, ravioli rolled out on the worktop, birthday cakes: number cakes, heart cakes, cream cakes. Order them by phone or on WhatsApp.",
      "f.ordina": "Order a cake on WhatsApp",
      "a.colombe": "Golden Easter colomba cakes in the fan oven.",
      "c.colombe": "The colomba, in their oven.",
      "a.ravioli": "Fresh ravioli laid out on the floured worktop.",
      "c.ravioli": "Fresh ravioli.",
      "a.numero": "A number cake «11», glazed with chocolate threads, on gold boards.",
      "c.numero": "The number cake.",
      "a.panna": "A cream cake with piped rosettes, a strawberry, raspberries and blueberries, the red frill.",
      "c.panna": "The cream cake.",
      "g2.etichetta": "The day",
      "g2.titolo": "Breakfast, lunch, afternoon snack",
      "g2.o1": "from 7:30",
      "g2.t1": "Breakfast",
      "g2.v1": "Brioches, fagottini, puff pastries; cappuccino, also with lactose-free milk. On Saturdays and Sundays from 8.",
      "g2.o2": "until 2 pm",
      "g2.t2": "Lunch",
      "g2.v2": "Filled focaccine, savoury pies, the hot and cold dishes of the day; to eat there or take away. On Mondays until 1 pm.",
      "g2.o3": "4–6 pm",
      "g2.t3": "Afternoon snack",
      "g2.v3": "Tuesday to Friday: small pastries, tartlets, a slice of cake.",
      "g2.o4": "Saturday from 11",
      "g2.t4": "Brunch",
      "g2.v4": "The Saturday brunch, by booking.",
      "a.dehor": "The outdoor area: the wooden deck, the red openwork chairs, the round tables, the umbrellas.",
      "c.dehor": "Outside, with the red chairs.",
      "a.colazione": "Breakfast on a wooden table: two custard croissants and two puff pastries on black plates.",
      "c.colazione": "Breakfast outside.",
      "a.buffet": "A buffet on the counter: filled focaccine, sandwiches, crisps, olives, savoury cannoncini.",
      "c.buffet": "A buffet for a party.",
      "a.pranzo": "The lunch counter with grilled vegetables, cured meats and savoury pies.",
      "c.pranzo": "The lunch counter.",
      "a.interno": "Inside: the counter with an orange cloth and a red openwork chair.",
      "c.interno": "Inside.",
      "d.etichetta": "Reviews",
      "d.titolo": "For non-coeliacs too",
      "d.google": "on Google, 101 reviews",
      "d.g7m": "Google, 7 months ago",
      "d.g3a": "Google, 3 years ago",
      "d.g2m": "Google, 2 months ago",
      "d.g4a": "Google, 4 years ago",
      "d.nota": "From the reviews on Google, as they were written (in Italian). The line at the top also comes from a review on Google.",
      "d.tutte": "All the reviews on Google",
      "o.etichetta": "Hours and where",
      "o.titolo": "Mornings every day, afternoons on weekdays",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "o.nota": "On Saturdays from 11 there is brunch, by booking. In summer the hours may change: they post it on their Facebook page.",
      "o.mappa": "Map: Bontà senza Glutine, Via Ettore Ponti 53, Milan",
      "o.dove": "Where",
      "o.dovev": "Via Ettore Ponti 53, 20143 Milan, in the Barona",
      "o.bus": "By bus",
      "o.busv": "The 47, 95 and 98 in Via Santa Rita, corner of Via Bari, about 150 metres away; the 74 about 250",
      "o.metro": "By metro",
      "o.metrov": "M2 Romolo or Famagosta, about a kilometre and a half away",
      "o.tel": "Phone",
      "q.etichetta": "Questions",
      "q.titolo": "Before you drop by",
      "q.1": "Is everything gluten-free?",
      "q.1r": "Yes: from sweet to savoury, the counter is exclusively gluten-free. They write it themselves: «Here you will find only gluten-free products, from sweet to savoury».",
      "q.2": "Is anything lactose-free too?",
      "q.2r": "Some cakes, and cappuccino with lactose-free milk, according to the reviews: ask at the counter.",
      "q.3": "Can I order cakes?",
      "q.3r": "Yes, for birthdays and parties, and sweet and savoury buffets too: by phone (+39 02 8703 4259) or on WhatsApp (+39 351 522 3305).",
      "q.4": "When is the brunch?",
      "q.4r": "On Saturdays from 11 am, by booking.",
      "q.5": "Can I eat outside?",
      "q.5r": "Yes, in the outdoor area with the tables and the red chairs.",
      "q.6": "How do I get there?",
      "q.6r": "Via Ettore Ponti 53: buses 47, 95 and 98 stop in Via Santa Rita, corner of Via Bari, about 150 metres away; the 74 about 250. M2 Romolo and Famagosta are about a kilometre and a half away.",
      "f2.orario": "Monday 7:30 am–1 pm · Tuesday to Friday 7:30 am–2 pm and 4–6 pm · Saturday and Sunday 8 am–12 pm",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the photos are theirs, from their Facebook page and Google listing (three by customers); hours and reviews from Google (September 2026). We drew the focaccina ourselves.",
      "f2.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ BONTÀ SENZA GLUTINE — «Tutto senza glutine, dal dolce al salato.» ══════════
     La pagina è il loro logo e il loro banco: il tondo bordeaux col corsivo, le sedie rosse, il vassoio d'alluminio, la gala rossa.
     la FIRMA — «le focaccine baciate»: di profilo, dentro il tondo bordeaux, la metà di sotto di una focaccina sul vassoio; il ripieno
     cade strato per strato e si posa, poi la metà di sopra scende e bacia quella di sotto (un piccolo schiacciamento). Tre ripieni:
     Verdure, Straccetti, Bresaola. Lo stato è M (il ripieno), R (il ripieno 0…1: gli strati cadono uno dopo l'altro), C (la chiusura
     0…1: fino a 0,85 la discesa, poi lo schiacciamento) e V (la focaccina: 0 al suo posto, fino a 1 servita — scivola via a destra —,
     da −1 a 0 ne arriva una da sinistra). Senza JS e alla fine: Verdure, R = C = 1, V = 0 (l'HTML). L'attesa (classe nell'head): aperta e
     vuota nello stesso posto. Scegliere un ripieno: quella pronta si serve e ne arriva un'altra aperta (se è ancora vuota, niente da
     servire). Reduced-motion: tutto subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante
     l'animazione la ferma dov'è. */
  var DATI = {"vb":[520,440],"cx":260,"taglio":254,"aperta":{"y":104,"rot":-7},"tempi":{"inizio":300,"riempi":1500,"pausa":150,"chiudi":900,"servi":380,"arriva":380,"riempiV":1100,"chiudiV":700,"caduta":-86,"compare":0.15,"rimbalzo":0.04,"discesa":0.85,"schiaccia":0.05,"via":230,"entra":200},"ripieni":[{"nome":"Verdure","strati":4,"soglie":[{"t":0,"d":0.4},{"t":0.2,"d":0.4},{"t":0.4,"d":0.4},{"t":0.6,"d":0.4}],"chiusa":{"y":205,"rot":0}},{"nome":"Straccetti","strati":3,"soglie":[{"t":0,"d":0.4},{"t":0.3,"d":0.4},{"t":0.6,"d":0.4}],"chiusa":{"y":205,"rot":0}},{"nome":"Bresaola","strati":3,"soglie":[{"t":0,"d":0.4},{"t":0.3,"d":0.4},{"t":0.6,"d":0.4}],"chiusa":{"y":207,"rot":0}}]};
  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('focaccina'), svgF = prendi('focaccinaSvg'), tuttoF = prendi('focaccinaTutto'), sopraF = prendi('focaccinaSopra'), leggiF = prendi('focaccinaLeggi');
  var BOTTONI = [].slice.call(document.querySelectorAll('.tavolo__modi button[data-modo]'));
  var TF = DATI.tempi, RIP = DATI.ripieni, AP = DATI.aperta, CXF = DATI.cx;
  var perIndice = function (a, b) { return +a.getAttribute('data-i') - +b.getAttribute('data-i'); };
  var STRATI = RIP.map(function (R, k) {
    var g = prendi('focaccinaRipieno' + k);
    return g ? [].slice.call(g.querySelectorAll('.strato')).sort(perIndice) : null;
  });
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, RF = 1, CF = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var r3 = function (n) { return Math.round(n * 1000) / 1000; };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  /* la caduta di uno strato: accelera fin sulla metà di sotto, poi un piccolo rimbalzo */
  function caduta(p) { return p < 0.75 ? (p / 0.75) * (p / 0.75) : 1 - TF.rimbalzo * Math.sin(Math.PI * (p - 0.75) / 0.25); }
  function stratoF(el, p) {
    if (p >= 1) { el.removeAttribute('opacity'); el.removeAttribute('transform'); return; }
    if (p <= 0) { el.setAttribute('opacity', '0'); el.setAttribute('transform', 'translate(0 ' + TF.caduta + ')'); return; }
    if (p < TF.compare) el.setAttribute('opacity', String(r3(p / TF.compare))); else el.removeAttribute('opacity');
    el.setAttribute('transform', 'translate(0 ' + r3(TF.caduta * (1 - caduta(p))) + ')');
  }
  /* la metà di sopra: aperta e inclinata, scende (dolce) fino al ripieno, poi lo schiacciamento; chiusa, gli stessi numeri dell'HTML */
  function sopra(m, c) {
    var yc = RIP[m].chiusa.y;
    if (c >= 1) return 'translate(' + CXF + ' ' + yc + ')';
    if (c <= 0) return 'translate(' + CXF + ' ' + AP.y + ') rotate(' + AP.rot + ')';
    if (c < TF.discesa) {
      var e = CURVE.dolce(c / TF.discesa);
      return 'translate(' + CXF + ' ' + r3(AP.y + (yc - AP.y) * e) + ') rotate(' + (r3(AP.rot * (1 - e)) || 0) + ')';
    }
    var sq = Math.sin(Math.PI * (c - TF.discesa) / (1 - TF.discesa)) * TF.schiaccia;
    return 'translate(' + CXF + ' ' + yc + ') scale(' + r3(1 + sq / 2) + ' ' + r3(1 - sq) + ')';
  }
  function annunciaF(m) {
    var el = document.querySelector('.tavolo__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  /* il disegno dello stato: allo stato finale nessun attributo in più di quelli dell'HTML */
  function disegnaF(m, r, c, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    RF = r; CF = c; VF = v;
    STRATI.forEach(function (S, k) {
      var Q = RIP[k].soglie;
      S.forEach(function (el, i) { stratoF(el, k === m ? c01((r - Q[i].t) / Q[i].d) : 1); });
    });
    sopraF.setAttribute('transform', sopra(m, c));
    if (v === 0) { tuttoF.removeAttribute('transform'); tuttoF.removeAttribute('opacity'); }
    else if (v > 0) { tuttoF.setAttribute('transform', 'translate(' + r3(TF.via * v) + ' 0)'); tuttoF.setAttribute('opacity', String(r3(1 - v))); }
    else { tuttoF.setAttribute('transform', 'translate(' + r3(TF.entra * v) + ' 0)'); tuttoF.setAttribute('opacity', String(r3(1 + v))); }
  }
  /* un piano: tratti { da, a, m, x0: {r, c, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.r + (B.r - A.r) * e, A.c + (B.c - A.c) * e, A.v + (B.v - A.v) * e);
  }
  var st3 = function (r, c, v) { return { r: r, c: c, v: v }; };
  /* riempire e chiudere la focaccina m, da aperta e vuota */
  function pianoPrepara(t, m, veloce) {
    var P = [], riempi = veloce ? TF.riempiV : TF.riempi, chiudi = veloce ? TF.chiudiV : TF.chiudi;
    P.push({ da: t, a: t + riempi, m: m, x0: st3(0, 0, 0), x1: st3(1, 0, 0), curva: 'lineare' }); t += riempi;
    P.push({ da: t, a: t + TF.pausa, m: m, x0: st3(1, 0, 0), x1: st3(1, 0, 0), curva: 'lineare' }); t += TF.pausa;
    P.push({ da: t, a: t + chiudi, m: m, x0: st3(1, 0, 0), x1: st3(1, 1, 0), curva: 'lineare' }); t += chiudi;
    return { piano: P, fine: t };
  }
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): la focaccina si ferma dov'è (#244); dall'attesa lo stato è aperta e vuota */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, RF, CF, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: aperta e vuota */
    disegnaF(0, 0, 0, 0);
    destinazioneF = { m: 0 };
    var resto = pianoPrepara(TF.inizio, 0, false);
    avviaF('intro', { piano: [{ da: 0, a: TF.inizio, m: 0, x0: st3(0, 0, 0), x1: st3(0, 0, 0), curva: 'lineare' }].concat(resto.piano), fine: resto.fine });
  }
  /* il gesto: scegliere un ripieno. Se è quello che si sta già preparando, niente; altrimenti la focaccina si ferma dov'è, se c'è
     dentro qualcosa si serve (scivola via) e ne arriva un'altra aperta; poi il ripieno e il bacio. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st3(RF, CF, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v > 0 || (a.v === 0 && (a.r > 0 || a.c > 0))) {
      passo(TF.servi, mm, st3(a.r, a.c, 1), 'dolce');
      a = st3(0, 0, -1);
    }
    if (a.v < 0) passo(TF.arriva, m, st3(0, 0, 0), 'dolce');
    var resto = pianoPrepara(t, m, true);
    avviaF('prepara', { piano: P.concat(resto.piano), fine: resto.fine });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra le fasce della settimana */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la focaccina è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è
     quella del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && tuttoF && sopraF && BOTTONI.length === RIP.length && STRATI.every(Boolean)) {
    try { clearTimeout(window.__attesaFocaccina); } catch (e) {}
    window.__focaccina = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, r: RF, c: CF, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__focaccina.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la focaccina sotto la piega (telefoni): parte quando se ne vede abbastanza; fino ad allora resta aperta e vuota */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__focaccina.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
