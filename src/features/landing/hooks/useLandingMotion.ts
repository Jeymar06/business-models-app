import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, type RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function useLandingMotion(rootRef: RefObject<HTMLElement>, isReady: boolean) {
  useEffect(() => {
    if (!isReady || !rootRef.current) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const root = rootRef.current;
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      heroTl
        .fromTo(
          '.landing-hero-title-char',
          { opacity: 0, rotate: 7, yPercent: 130 },
          { opacity: 1, rotate: 0, yPercent: 0, duration: 0.9, stagger: 0.035 },
        )
        .fromTo(
          '.landing-hero-clip',
          { clipPath: 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)', y: 12 },
          { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', y: 0, duration: 0.85 },
          '-=0.45',
        )
        .fromTo(
          '.landing-hero-reveal',
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.72, stagger: 0.09 },
          '-=0.42',
        )
        .fromTo(
          '.landing-hero-orbit',
          { opacity: 0, scale: 0.9, y: 36, rotate: -4 },
          { opacity: 1, scale: 1, y: 0, rotate: 0, duration: 0.9, stagger: 0.08 },
          '-=0.55',
        );

      gsap
        .timeline({
          scrollTrigger: {
            trigger: '.landing-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.1,
          },
        })
        .to('.landing-hero-media', { scale: 1.12, rotate: 4, yPercent: 8, ease: 'none' })
        .to('.landing-hero-content', { yPercent: -12, ease: 'none' }, '<')
        .to('.landing-hero-shade', { opacity: 0.86, ease: 'none' }, '<');

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 64 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 82%',
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-clip-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
          {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            duration: 0.85,
            ease: 'circ.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 78%',
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-word-reveal]').forEach((element) => {
        const words = element.querySelectorAll('.landing-word');

        gsap.to(words, {
          color: 'rgba(245, 241, 232, 1)',
          stagger: 0.08,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: element,
            start: 'top 68%',
            end: 'bottom 42%',
            scrub: true,
          },
        });
      });

      if (window.innerWidth >= 768) {
        const horizontalSection = root.querySelector<HTMLElement>('.landing-horizontal-section');
        const horizontalTrack = root.querySelector<HTMLElement>('.landing-horizontal-track');

        if (horizontalSection && horizontalTrack) {
          const getDistance = () => Math.max(0, horizontalTrack.scrollWidth - horizontalSection.clientWidth + 48);

          gsap.to(horizontalTrack, {
            x: () => -getDistance(),
            ease: 'none',
            scrollTrigger: {
              trigger: horizontalSection,
              start: 'top top',
              end: () => `+=${getDistance() + window.innerHeight * 0.8}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        }

        gsap
          .timeline({
            scrollTrigger: {
              trigger: '.landing-video-reveal',
              start: 'top top',
              end: '+=130%',
              scrub: 1.25,
              pin: true,
              anticipatePin: 1,
            },
          })
          .fromTo(
            '.landing-video-reveal-media',
            { clipPath: 'circle(12% at 50% 50%)' },
            { clipPath: 'circle(100% at 50% 50%)', ease: 'power1.inOut' },
          )
          .fromTo(
            '.landing-video-reveal-copy',
            { opacity: 0, y: 46 },
            { opacity: 1, y: 0, ease: 'power2.out' },
            '<35%',
          );
      }

      gsap.utils.toArray<HTMLElement>('.landing-tilt-card').forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, rotate: index % 2 === 0 ? -4 : 4, y: 80 },
          {
            opacity: 1,
            rotate: Number(card.dataset.rotate ?? 0),
            y: 0,
            duration: 0.85,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: card,
              start: 'top 84%',
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('.landing-hover-lift').forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 42 },
          {
            opacity: 1,
            y: 0,
            duration: 0.72,
            delay: (index % 3) * 0.04,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
            },
          },
        );
      });

      gsap.to('.landing-marquee-track', {
        xPercent: -50,
        duration: 32,
        ease: 'none',
        repeat: -1,
      });
    }, root);

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 350);

    return () => {
      window.clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [isReady, rootRef]);
}
