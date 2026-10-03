/* ============================================================
   Shehabul Alam — Portfolio behaviour
   Vanilla JS, no dependencies, no build step.
   Every feature degrades gracefully: with JS off the page is
   still fully readable and every link still works.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Theme toggle ───────────────────────────────────────── */
  // The stored theme is applied by the inline script in <head> to avoid a
  // flash; this only wires up the button and keeps the label in sync.
  var themeToggle = document.getElementById('themeToggle');

  function syncThemeLabel() {
    if (!themeToggle) return;
    var isDark = root.getAttribute('data-theme') === 'dark';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark ? '#1A2133' : '#E4E7EE');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
      syncThemeLabel();
    });
    syncThemeLabel();
  }

  /* ── Mobile nav ─────────────────────────────────────────── */
  var navToggle = document.getElementById('navToggle');
  var navDrawer = document.getElementById('navDrawer');

  function closeDrawer() {
    if (!navDrawer) return;
    navDrawer.classList.remove('is-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', function () {
      var open = navDrawer.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    // Tapping a link should navigate AND dismiss the drawer.
    navDrawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeDrawer();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  /* ── Nav elevation on scroll ────────────────────────────── */
  var siteNav = document.getElementById('siteNav');
  if (siteNav) {
    var onScroll = function () {
      siteNav.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Scroll reveal ──────────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    // No observer support, or the visitor asked for less motion — show
    // everything immediately rather than leaving the page blank.
    Array.prototype.forEach.call(revealEls, function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    Array.prototype.forEach.call(revealEls, function (el) {
      revealObserver.observe(el);
    });
  }

  /* ── Scroll spy ─────────────────────────────────────────── */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-current', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ── Marquee ────────────────────────────────────────────── */
  // The CSS animation translates the track by -50%, so the content has to be
  // duplicated exactly once for the loop to be seamless.
  var track = document.getElementById('marqueeTrack');
  if (track && !reduceMotion) {
    track.innerHTML += track.innerHTML;
    Array.prototype.forEach.call(track.children, function (child, i) {
      if (i >= track.children.length / 2) child.setAttribute('aria-hidden', 'true');
    });
  }

  /* ── Project filter ─────────────────────────────────────── */
  var filterBar = document.getElementById('projectFilters');
  var projectCards = document.querySelectorAll('#projectGrid [data-tech]');
  var emptyMsg = document.getElementById('noProjects');

  if (filterBar && projectCards.length) {
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;

      var filter = btn.getAttribute('data-filter');
      Array.prototype.forEach.call(filterBar.querySelectorAll('[data-filter]'), function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });

      var shown = 0;
      Array.prototype.forEach.call(projectCards, function (card) {
        var tech = (card.getAttribute('data-tech') || '').split(/\s+/);
        var match = filter === 'all' || tech.indexOf(filter) !== -1;
        // Inline style, not the `hidden` attribute: these cards carry Tailwind's
        // `.flex`, and an author-stylesheet class beats the UA `[hidden]` rule,
        // so setting .hidden would leave the card visible.
        card.style.display = match ? '' : 'none';
        if (match) shown++;
      });

      if (emptyMsg) emptyMsg.classList.toggle('hidden', shown > 0);
    });
  }

  /* ── Contact form ───────────────────────────────────────── */
  var form = document.getElementById('contactForm');

  if (form) {
    var submitBtn = document.getElementById('cfSubmit');
    var statusEl = document.getElementById('cfStatus');
    var accessKey = form.getAttribute('data-access-key');
    var FALLBACK = 'shatu.jitu@gmail.com';
    var configured = accessKey && accessKey !== 'YOUR_WEB3FORMS_ACCESS_KEY';

    var setStatus = function (msg, kind) {
      if (!statusEl) return;
      statusEl.innerHTML = msg;
      statusEl.className = 'form-status' + (kind ? ' is-' + kind : '');
    };

    // Without a key there is nothing to submit to. Say so plainly rather than
    // letting someone type a message that silently goes nowhere.
    if (!configured) {
      if (submitBtn) submitBtn.disabled = true;
      setStatus(
        'This form isn\'t connected yet — email me directly at ' +
        '<a class="accent-c underline" href="mailto:' + FALLBACK + '">' + FALLBACK + '</a>.',
        'err'
      );
    }

    var showError = function (input, show) {
      var msg = form.querySelector('[data-error-for="' + input.id + '"]');
      if (msg) msg.classList.toggle('is-shown', show);
      input.setAttribute('aria-invalid', String(show));
    };

    var validate = function () {
      var ok = true;
      ['cfName', 'cfEmail', 'cfMessage'].forEach(function (id) {
        var input = document.getElementById(id);
        if (!input) return;
        var valid = input.checkValidity() && input.value.trim() !== '';
        showError(input, !valid);
        if (!valid) ok = false;
      });
      return ok;
    };

    form.addEventListener('input', function (e) {
      if (e.target.matches('.field') && e.target.getAttribute('aria-invalid') === 'true') {
        showError(e.target, !(e.target.checkValidity() && e.target.value.trim() !== ''));
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!configured) return;
      if (!validate()) {
        setStatus('Please fix the highlighted fields.', 'err');
        return;
      }

      // NB: read inputs by id, not `form.name` — on a <form>, `.name` is the
      // element's own IDL attribute and shadows the child input of that name.
      var senderName = document.getElementById('cfName').value.trim();
      var data = {
        access_key: accessKey,
        name: senderName,
        email: document.getElementById('cfEmail').value.trim(),
        message: document.getElementById('cfMessage').value.trim(),
        botcheck: document.getElementById('cfBotcheck').value,
        subject: 'Portfolio enquiry from ' + senderName,
      };

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      setStatus('');

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (res) { return res.json().then(function (body) { return { ok: res.ok, body: body }; }); })
        .then(function (res) {
          // Only claim success when the API actually confirms it.
          if (!res.ok || !res.body.success) throw new Error(res.body.message || 'Request failed');
          form.reset();
          setStatus('Thanks — your message is on its way. I\'ll reply within 24 hours.', 'ok');
        })
        .catch(function () {
          setStatus(
            'Something went wrong sending that. Please email me at ' +
            '<a class="accent-c underline" href="mailto:' + FALLBACK + '">' + FALLBACK + '</a>.',
            'err'
          );
        })
        .then(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send message';
        });
    });
  }

  /* ── Footer year ────────────────────────────────────────── */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
