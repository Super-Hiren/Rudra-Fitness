(function () {
  'use strict';

  var head = document.getElementById('head');
  var dock = document.querySelector('.dock');
  var hero = document.getElementById('top');
  var fill = document.getElementById('railFill');
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-rail]'));
  var sections = links
    .map(function (a) { return document.getElementById(a.getAttribute('data-rail')); })
    .filter(Boolean);

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());

  var ticking = false;

  function paint() {
    ticking = false;

    if (head) head.classList.toggle('is-stuck', window.scrollY > 8);

    // the action bar rises once the hero's own buttons have scrolled away
    if (dock) {
      var mark = hero ? hero.offsetTop + hero.offsetHeight - 140 : 400;
      dock.classList.toggle('is-up', window.scrollY > mark);
    }

    if (fill) {
      var doc = document.documentElement;
      var span = doc.scrollHeight - window.innerHeight;
      var pct = span > 0 ? (window.scrollY / span) * 100 : 0;
      fill.style.height = Math.max(0, Math.min(100, pct)).toFixed(2) + '%';
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(paint);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  paint();

  // highlight the section currently crossing the upper third of the viewport
  if ('IntersectionObserver' in window && sections.length) {
    var seen = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { seen[e.target.id] = e.intersectionRatio; });

      var best = null, bestRatio = 0;
      sections.forEach(function (s) {
        var r = seen[s.id] || 0;
        if (r > bestRatio) { bestRatio = r; best = s.id; }
      });

      links.forEach(function (a) {
        var on = a.getAttribute('data-rail') === best && bestRatio > 0.05;
        a.classList.toggle('is-on', on);
        if (on) { a.setAttribute('aria-current', 'true'); }
        else { a.removeAttribute('aria-current'); }
      });
    }, { threshold: [0, 0.05, 0.25, 0.5, 0.75, 1] });

    sections.forEach(function (s) { io.observe(s); });
  }
})();
