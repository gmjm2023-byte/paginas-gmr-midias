(() => {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const cards = [...track.querySelectorAll('.media-card')];
  const previous = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  const toggle = carousel.querySelector('[data-carousel-toggle]');
  const progress = carousel.querySelector('.carousel-progress i');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const imageDuration = 4200;
  let current = 0;
  let timer;
  let paused = reducedMotion.matches;
  let scrollFrame;

  const step = () => {
    const card = cards[0];
    if (!card) return track.clientWidth;
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const keepMuted = video => {
    video.defaultMuted = true;
    video.muted = true;
    video.volume = 0;
  };

  const stopMedia = except => {
    cards.forEach(card => {
      card.classList.remove('is-active');
      const video = card.querySelector('video');
      if (!video || video === except) return;
      video.pause();
      video.currentTime = 0;
      keepMuted(video);
    });
  };

  const clearCycle = () => {
    window.clearTimeout(timer);
    cards.forEach(card => card.querySelector('video')?.removeAttribute('data-active'));
  };

  const update = () => {
    progress.style.transform = `scaleX(${(current + 1) / cards.length})`;
    cards.forEach((card, index) => card.classList.toggle('is-active', index === current));
  };

  const schedule = () => {
    clearCycle();
    if (paused || document.hidden) return;

    const video = cards[current]?.querySelector('video');
    stopMedia(video);
    update();

    if (video) {
      keepMuted(video);
      video.currentTime = 0;
      video.setAttribute('data-active', '');
      video.play().catch(() => {
        timer = window.setTimeout(() => goTo(current + 1), imageDuration);
      });
      return;
    }

    timer = window.setTimeout(() => goTo(current + 1), imageDuration);
  };

  const finishMove = () => {
    update();
    schedule();
  };

  const goTo = requested => {
    clearCycle();
    const targetIndex = (requested + cards.length) % cards.length;
    const wrapsForward = current === cards.length - 1 && targetIndex === 0;
    current = targetIndex;

    if (wrapsForward && window.gsap && !reducedMotion.matches) {
      gsap.to(track, {
        opacity: 0.18,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          track.scrollLeft = 0;
          gsap.to(track, { opacity: 1, duration: 0.38, ease: 'power2.out', onComplete: finishMove });
        }
      });
      return;
    }

    const destination = Math.min(current * step(), track.scrollWidth - track.clientWidth);
    if (window.gsap && !reducedMotion.matches) {
      gsap.to(track, { scrollLeft: destination, duration: 0.82, ease: 'power3.inOut', overwrite: true, onComplete: finishMove });
      return;
    }

    track.scrollTo({ left: destination, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    finishMove();
  };

  previous.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.textContent = paused ? '▶' : 'Ⅱ';
    toggle.setAttribute('aria-label', paused ? 'Iniciar carrossel automático' : 'Pausar carrossel automático');
    if (paused) {
      clearCycle();
      stopMedia();
      update();
    } else {
      schedule();
    }
  });

  track.addEventListener('scroll', () => {
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = window.requestAnimationFrame(() => {
      current = Math.min(cards.length - 1, Math.max(0, Math.round(track.scrollLeft / step())));
      update();
    });
  }, { passive: true });

  cards.forEach((card, index) => {
    const video = card.querySelector('video');
    if (!video) return;
    keepMuted(video);
    video.addEventListener('volumechange', () => keepMuted(video));
    video.addEventListener('ended', () => {
      if (index === current && !paused && !document.hidden) goTo(current + 1);
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearCycle();
      stopMedia();
    } else {
      schedule();
    }
  });

  reducedMotion.addEventListener('change', event => {
    paused = event.matches;
    toggle.textContent = paused ? '▶' : 'Ⅱ';
    toggle.setAttribute('aria-label', paused ? 'Iniciar carrossel automático' : 'Pausar carrossel automático');
    schedule();
  });

  update();
  schedule();
})();
