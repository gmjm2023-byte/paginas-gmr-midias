(() => {
  document.querySelector('#year').textContent = new Date().getFullYear();
  // Content and links remain usable if the animation library is unavailable.
  if (!window.gsap) return;

  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', context => {
    const intro = gsap.timeline({ defaults: { duration: 0.55, ease: 'power3.out' } });
    intro
      .from('.profile', { y: 16, opacity: 0, clearProps: 'all' })
      .from('.whatsapp', { y: 14, opacity: 0, clearProps: 'all' }, '-=0.26')
      .from('.hero-clover', { rotation: -28, scale: 0.9, duration: 0.7, clearProps: 'all' }, 0.2);

    // Animate each remaining card only when it reaches the viewport.
    context.add('reveal', target => gsap.from(target, { y: 14, opacity: 0, duration: 0.45, ease: 'power3.out', clearProps: 'all' }));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        context.reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.instagram, .safety, .rules, .signature').forEach(card => observer.observe(card));
    return () => observer.disconnect();
  });

  media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', context => {
    const cleanup = [];
    document.querySelectorAll('.action').forEach(card => {
      const arrow = card.querySelector('.link-arrow');
      context.add('enter', () => gsap.to(arrow, { x: 3, y: -3, duration: 0.2, ease: 'power2.out', overwrite: 'auto' }));
      const enter = context.enter;
      context.add('leave', () => gsap.to(arrow, { x: 0, y: 0, duration: 0.3, ease: 'power3.out', overwrite: 'auto' }));
      const leave = context.leave;
      card.addEventListener('pointerenter', enter);
      card.addEventListener('pointerleave', leave);
      card.addEventListener('focus', enter);
      card.addEventListener('blur', leave);
      cleanup.push(() => {
        card.removeEventListener('pointerenter', enter);
        card.removeEventListener('pointerleave', leave);
        card.removeEventListener('focus', enter);
        card.removeEventListener('blur', leave);
      });
    });
    return () => cleanup.forEach(remove => remove());
  });
})();
