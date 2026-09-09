(() => {
  document.querySelector('#year').textContent = new Date().getFullYear();
  const videos = document.querySelectorAll('video');
  // Playback always starts with the visitor; stop other videos to avoid overlapping audio.
  videos.forEach(video => video.addEventListener('play', () => {
    videos.forEach(other => { if (other !== video) other.pause(); });
  }));
  document.querySelector('.media').addEventListener('toggle', event => {
    if (!event.currentTarget.open) videos.forEach(video => video.pause());
  });
  if (!window.gsap) return;
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', context => {
    gsap.timeline({ defaults: { duration: 0.55, ease: 'power3.out' } })
      .from('.profile', { y: 15, opacity: 0, clearProps: 'all' })
      .from('.group', { y: 14, opacity: 0, clearProps: 'all' }, '-=0.25')
      .from('.prize-image', { scale: 1.035, duration: 0.85, clearProps: 'all' }, 0.15)
      .from('.profile-gem', { rotation: -22, opacity: 0, duration: 0.7, clearProps: 'all' }, 0.2);
    context.add('reveal', target => gsap.from(target, { y: 12, opacity: 0, duration: 0.45, ease: 'power3.out', clearProps: 'all' }));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      context.reveal(entry.target);
      observer.unobserve(entry.target);
    }), { threshold: 0.1 });
    document.querySelectorAll('.numbers, .how, .contact, .social, .media, .rules').forEach(tile => observer.observe(tile));
    return () => observer.disconnect();
  });
  media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', context => {
    const cleanup = [];
    document.querySelectorAll('.action').forEach((link, index) => {
      const arrow = link.querySelector('.link-arrow');
      context.add('enter' + index, () => gsap.to(arrow, { x: 3, y: -3, duration: 0.2, ease: 'power2.out', overwrite: 'auto' }));
      context.add('leave' + index, () => gsap.to(arrow, { x: 0, y: 0, duration: 0.3, ease: 'power3.out', overwrite: 'auto' }));
      const enter = context['enter' + index], leave = context['leave' + index];
      link.addEventListener('pointerenter', enter);
      link.addEventListener('pointerleave', leave);
      link.addEventListener('focus', enter);
      link.addEventListener('blur', leave);
      cleanup.push(() => {
        link.removeEventListener('pointerenter', enter);
        link.removeEventListener('pointerleave', leave);
        link.removeEventListener('focus', enter);
        link.removeEventListener('blur', leave);
      });
    });
    return () => cleanup.forEach(remove => remove());
  });
})();
