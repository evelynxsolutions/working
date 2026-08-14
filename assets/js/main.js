// EVELYNX SOLUTIONS — shared interactions
(function () {
  'use strict';

  // Scroll progress bar
  var prog = document.getElementById('prog');
  function updateProg() {
    var d = document.documentElement;
    var max = d.scrollHeight - d.clientHeight;
    if (prog && max > 0) prog.style.width = (d.scrollTop / max * 100) + '%';
  }
  window.addEventListener('scroll', updateProg, { passive: true });

  // Navbar blur state
  var navbar = document.getElementById('navbar');
  function updateNav() {
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Mobile menu
  var hamBtn = document.getElementById('hamBtn');
  var mobMenu = document.getElementById('mobMenu');
  var mobClose = document.getElementById('mobClose');
  if (hamBtn && mobMenu) {
    hamBtn.addEventListener('click', function () {
      mobMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Trigger staggered animation for links
      var links = mobMenu.querySelectorAll('.mob-link');
      links.forEach(function(link, index) {
        link.style.transitionDelay = (0.1 + (index * 0.07)) + 's';
      });
    });
    if (mobClose) {
      mobClose.addEventListener('click', function () {
        mobMenu.classList.remove('open');
        document.body.style.overflow = '';
        // Reset delays
        var links = mobMenu.querySelectorAll('.mob-link');
        links.forEach(function(link) { link.style.transitionDelay = '0s'; });
      });
    }
    var ml = document.querySelectorAll('.mob-link');
    for (var i = 0; i < ml.length; i++) {
      ml[i].addEventListener('click', function () {
        mobMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobMenu && mobMenu.classList.contains('open')) {
      mobMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Scroll reveal
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rvObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); rvObs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
  var rvs = document.querySelectorAll('.rv');
  for (var i = 0; i < rvs.length; i++) {
    if (reduceMotion) { rvs[i].classList.add('in'); continue; }
    var d = rvs[i].getAttribute('data-dly');
    if (d) rvs[i].style.transitionDelay = d + 'ms';
    rvObs.observe(rvs[i]);
  }

  // Animated counters
  var cObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target, t = parseFloat(el.getAttribute('data-t')), s = el.getAttribute('data-s') || '';
      if (isNaN(t)) return;
      if (reduceMotion) { el.textContent = t + s; cObs.unobserve(el); return; }
      var cur = 0, step = t / 50;
      (function go() {
        cur = Math.min(cur + step, t);
        el.textContent = (t % 1 === 0 ? Math.ceil(cur) : cur.toFixed(1)) + s;
        if (cur < t) requestAnimationFrame(go);
      })();
      cObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  var cts = document.querySelectorAll('.counter');
  for (var i = 0; i < cts.length; i++) cObs.observe(cts[i]);

  // Smooth anchor scrolling
  var anchors = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  for (var i = 0; i < anchors.length; i++) {
    anchors[i].addEventListener('click', function (e) {
      var t = document.querySelector(this.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  }

  // FAQ accordion
  var accTriggers = document.querySelectorAll('.acc-trigger');
  for (var i = 0; i < accTriggers.length; i++) {
    accTriggers[i].addEventListener('click', function () {
      var item = this.closest('.acc-item');
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item.open').forEach(function (o) { o.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  }

  // Contact form (static demo — no backend wired up)
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var required = form.querySelectorAll('[required]');
      var valid = true;
      required.forEach(function (f) {
        if (!f.value.trim()) { valid = false; f.style.borderColor = '#C33A22'; f.style.boxShadow = '0 0 0 4px rgba(195,58,34,0.08)'; }
        else { f.style.borderColor = ''; f.style.boxShadow = ''; }
      });
      if (!valid) return;
      var successEl = document.getElementById('formSuccess');
      form.classList.add('hidden');
      if (successEl) successEl.classList.remove('hidden');
    });
  }
})();

// Enhanced Card Spotlight Tracker
if (window.matchMedia('(hover: hover)').matches) {
  var cards = document.querySelectorAll('.card');
  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener('mousemove', function (e) {
      var r = this.getBoundingClientRect();
      this.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      this.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  }
}