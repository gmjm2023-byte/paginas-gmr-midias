document.getElementById("year").textContent = new Date().getFullYear();

const marquee = document.querySelector(".marquee-track");

if (window.gsap) {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTimeline
      .from(".site-header", { y: -20, autoAlpha: 0, duration: .65 })
      .from("[data-hero]", { y: 34, autoAlpha: 0, duration: .85, stagger: .1 }, "-=.3");

    if (marquee) {
      gsap.to(marquee, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        gsap.fromTo(entry.target,
          { y: 28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: .8, ease: "power3.out", clearProps: "transform,opacity,visibility" }
        );
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: "0px 0px -6%" });

    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  });

  mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
    const visual = document.querySelector(".product-stage");
    if (!visual) return;
    const onMove = (event) => {
      const x = (event.clientX / window.innerWidth - .5) * 8;
      const y = (event.clientY / window.innerHeight - .5) * 8;
      gsap.to(visual, { x, y, scale: 1.025, duration: 1.1, ease: "power2.out", overwrite: "auto" });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  });
}
