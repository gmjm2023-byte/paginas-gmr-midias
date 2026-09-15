(function () {
  'use strict';

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  var share = document.querySelector('.share-button');
  if (share) {
    share.addEventListener('click', function () {
      if (navigator.share) {
        navigator.share({ title: document.title, url: window.location.href }).catch(function () {});
        return;
      }
      navigator.clipboard.writeText(window.location.href).then(function () {
        var original = share.textContent;
        share.textContent = 'Link copiado';
        window.setTimeout(function () { share.textContent = original; }, 1800);
      }).catch(function () {});
    });
  }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (reduced || !window.gsap) {
    items.forEach(function (item) { item.style.visibility = 'visible'; });
    return;
  }

  window.gsap.set(items, { autoAlpha: 0, y: 34 });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      window.gsap.to(entry.target, { autoAlpha: 1, y: 0, duration: .85, ease: 'power3.out' });
    });
  }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });

  items.forEach(function (item) { observer.observe(item); });
})();

