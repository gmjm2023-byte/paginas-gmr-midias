(() => {
  const year = document.querySelector('#year');
  const share = document.querySelector('.share');

  if (year) year.textContent = new Date().getFullYear();

  share?.addEventListener('click', async () => {
    if (navigator.share) {
      await navigator.share({ title: document.title, url: location.href });
      return;
    }

    await navigator.clipboard.writeText(location.href);
  });

  if (!window.gsap) return;

  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const rings = document.querySelector('.rings');
    const heroItems = [...document.querySelectorAll('.hero-info > *')];

    timeline
      .from('.profile-pill', { y: -12, opacity: 0, duration: 0.45 })
      .from('.hero', { y: 24, opacity: 0, duration: 0.65 }, '-=0.15');

    if (rings) {
      timeline.from(rings, { scale: 0.88, rotation: -8, opacity: 0, duration: 0.85 }, '-=0.5');
    }

    if (heroItems.length) {
      timeline.from(heroItems, { y: 14, opacity: 0, duration: 0.45, stagger: 0.06 }, '-=0.6');
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        gsap.from(entry.target, { y: 24, opacity: 0, duration: 0.6, ease: 'power3.out' });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.section, .cta').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  });
})();
