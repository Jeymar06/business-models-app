import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

import { landingLogo } from '@/features/landing/data/landingMedia';

type LandingPreloaderProps = {
  onFinish: () => void;
};

export function LandingPreloader({ onFinish }: LandingPreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const markLoaded = () => setLoaded(true);
    const safetyTimer = window.setTimeout(markLoaded, 2400);

    if (document.readyState === 'complete') {
      window.setTimeout(markLoaded, 320);
    } else {
      window.addEventListener('load', markLoaded, { once: true });
    }

    return () => {
      window.clearTimeout(safetyTimer);
      window.removeEventListener('load', markLoaded);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((current) => {
        const target = loaded ? 100 : 92;
        const step = loaded ? 12 : 5 + Math.random() * 9;
        return Math.min(target, current + step);
      });
    }, 120);

    return () => window.clearInterval(timer);
  }, [loaded]);

  useEffect(() => {
    if (progress < 100 || finishedRef.current || !containerRef.current) {
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      document.body.style.overflow = '';
      onFinish();
    };

    if (reduceMotion) {
      finish();
      return;
    }

    const tl = gsap.timeline({
      delay: 0.18,
      onComplete: finish,
    });

    tl.to(logoRef.current, {
      y: -22,
      opacity: 0,
      duration: 0.55,
      ease: 'power2.inOut',
    }).to(
      containerRef.current,
      {
        yPercent: -105,
        duration: 1.05,
        ease: 'power4.inOut',
      },
      '-=0.12',
    );

    return () => {
      tl.kill();
    };
  }, [onFinish, progress]);

  useEffect(() => {
    if (!barRef.current) return;

    gsap.to(barRef.current, {
      width: `${Math.round(progress)}%`,
      duration: 0.28,
      ease: 'power2.out',
    });
  }, [progress]);

  return (
    <div
      aria-live="polite"
      className="landing-preloader fixed inset-0 z-[120] flex flex-col items-center justify-center overflow-hidden bg-ink text-cream"
      ref={containerRef}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(212,175,55,0.2),transparent_30%),linear-gradient(180deg,#0A0908,#141210)]" />
      <div className="grain-overlay absolute inset-0 opacity-80" />

      <div className="relative flex w-full max-w-[28rem] flex-col items-center px-8 text-center" ref={logoRef}>
        <div className="mb-7 h-28 w-28 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:h-32 sm:w-32">
          <img alt="Barber Flow" className="h-full w-full object-cover object-left" src={landingLogo} />
        </div>
        <p className="eyebrow text-gold-300">Preparando Barber Flow</p>
        <p className="font-display mt-4 text-3xl font-semibold text-cream sm:text-4xl">
          La agenda esta entrando en escena
        </p>

        <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-0 rounded-full bg-[linear-gradient(90deg,#B89020,#E8C766,#D4AF37)]" ref={barRef} />
        </div>
        <p className="numeric mt-4 text-sm font-semibold text-cream/55">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}
