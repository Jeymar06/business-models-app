import {
  ArrowRight,
  CalendarDays,
  Check,
  Crown,
  Menu,
  Play,
  Scissors,
  Sparkles,
  Store,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import logoImage from '@/assets/landing/barber-flow-logo.webp';
import dashboardPortrait from '@/assets/landing/dashboard-portrait.webp';
import devicePortrait from '@/assets/landing/device-portrait.webp';
import heroPortrait from '@/assets/landing/hero-portrait.webp';
import loungePortrait from '@/assets/landing/lounge-portrait.webp';
import showcasePoster from '@/assets/landing/showcase-poster.jpg';
import showcaseVideo from '@/assets/landing/barber-flow-showcase.mp4';
import { Button } from '@/components/ui';

const navItems = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#experiencia', label: 'Experiencia' },
  { href: '#sistema', label: 'Sistema' },
  { href: '#empezar', label: 'Empezar' },
];

const heroSignals = [
  { value: '24/7', label: 'Reservas activas desde cualquier horario y cualquier pantalla.' },
  { value: '3 roles', label: 'Cliente, admin y supervision global dentro del mismo lenguaje.' },
  { value: '1 sistema', label: 'Imagen, operacion y agenda conectadas en un solo producto.' },
];

const systemPoints = [
  'Agenda por barberia con servicios, horarios y disponibilidad visibles.',
  'Paneles separados para cliente, administracion y supervision.',
  'Una experiencia premium que no se siente como plantilla generica.',
];

const detailNotes = [
  'La primera impresion se construye con imagen real, no con cajas vacias.',
  'El flujo publico prepara la confianza antes del login y antes de la primera reserva.',
  'Cada pantalla mantiene la misma direccion visual para que la marca se sienta consistente.',
];

export function PublicHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-[#080808] text-white">
      <section className="relative min-h-screen overflow-hidden" id="inicio">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.07),transparent_18%)]" />
        <div className="absolute inset-y-0 right-0 hidden w-[54%] lg:block">
          <div className="grid h-full grid-cols-[0.78fr_1fr_0.78fr] gap-4 px-5 py-5">
            <img
              alt="Barber Flow en uso desde un telefono"
              className="landing-media-drift mt-auto h-[56vh] w-full rounded-[30px] object-cover object-center xl:h-[62vh]"
              src={devicePortrait}
            />
            <video
              autoPlay
              className="landing-video-glow h-[84vh] w-full self-center rounded-[36px] object-cover object-center xl:h-[90vh]"
              loop
              muted
              playsInline
              poster={showcasePoster}
            >
              <source src={showcaseVideo} type="video/mp4" />
            </video>
            <img
              alt="Interior premium de barberia"
              className="landing-media-drift-delayed h-[60vh] w-full rounded-[30px] object-cover object-center xl:h-[66vh]"
              src={loungePortrait}
            />
          </div>
        </div>
        <div className="absolute inset-y-0 right-[48%] hidden w-40 bg-gradient-to-r from-[#080808] via-[#080808]/96 to-transparent lg:block" />

        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080808]/72 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <a className="flex items-center gap-3" href="#inicio">
              <img alt="Barber Flow" className="h-9 w-auto" src={logoImage} />
              <div className="hidden sm:block">
                <p className="text-xs font-semibold tracking-[0.22em] text-white/46">BARBER FLOW</p>
                <p className="text-sm font-medium text-white/78">Reserva y gestion premium</p>
              </div>
            </a>

            <nav className="hidden items-center gap-6 lg:flex">
              {navItems.map((item) => (
                <a className="text-sm font-medium text-white/70 transition hover:text-white" href={item.href} key={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <Link to="/login">
                <Button size="sm" variant="ghost">
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Crear cuenta
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>

            <button
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Cerrar menu' : 'Abrir menu'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/6 text-white transition hover:bg-white/10 lg:hidden"
              onClick={() => setIsMenuOpen((value) => !value)}
              type="button"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {isMenuOpen ? (
            <div className="border-t border-white/10 bg-[#080808] px-4 py-4 lg:hidden">
              <div className="mx-auto grid max-w-[1280px] gap-2">
                {navItems.map((item) => (
                  <a
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/78 transition hover:bg-white/8 hover:text-white"
                    href={item.href}
                    key={item.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}

                <div className="mt-2 grid gap-2">
                  <Link onClick={() => setIsMenuOpen(false)} to="/login">
                    <Button className="w-full" size="md" variant="outline">
                      Entrar
                    </Button>
                  </Link>
                  <Link onClick={() => setIsMenuOpen(false)} to="/register">
                    <Button className="w-full" size="md">
                      Crear cuenta
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </header>

        <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-[1280px] flex-col justify-end px-4 pb-8 pt-14 sm:px-6 sm:pb-10 lg:px-8 lg:pb-12 lg:pt-20">
          <div className="max-w-[44rem] space-y-6 animate-fade-up">
            <p className="text-sm font-semibold tracking-[0.24em] text-gold">BARBER FLOW</p>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/7 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/72 backdrop-blur-md">
              <Crown size={14} />
              Sistema visual y operativo para barberias que quieren verse grandes
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.96] text-white sm:text-6xl lg:text-7xl">
              La landing ya puede vender la atmosfera antes de pedir el registro.
            </h1>
            <p className="max-w-xl text-base leading-7 text-white/68 sm:text-lg">
              Barber Flow conecta reservas, operacion y presencia de marca en una experiencia sobria, cinematica y lista para convertir mejor desde el primer vistazo.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/register">
                <Button className="w-full sm:w-auto" size="lg">
                  Empezar ahora
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <a href="#sistema">
                <Button className="w-full sm:w-auto" size="lg" variant="outline">
                  Ver el sistema
                </Button>
              </a>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-[0.8fr_1fr_0.8fr] gap-3 lg:hidden">
            <img
              alt="Vista de barberia con atmosfera premium"
              className="landing-media-drift mt-8 aspect-[3/5] w-full rounded-[24px] object-cover object-center"
              src={heroPortrait}
            />
            <video
              autoPlay
              className="landing-video-glow aspect-[9/16] w-full rounded-[28px] object-cover object-center"
              loop
              muted
              playsInline
              poster={showcasePoster}
            >
              <source src={showcaseVideo} type="video/mp4" />
            </video>
            <img
              alt="Telefono mostrando la experiencia Barber Flow"
              className="landing-media-drift-delayed aspect-[3/5] w-full rounded-[24px] object-cover object-center"
              src={dashboardPortrait}
            />
          </div>

          <div className="mt-10 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-3">
            {heroSignals.map((signal) => (
              <div key={signal.label}>
                <p className="text-2xl font-semibold text-white sm:text-3xl">{signal.value}</p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-white/54">{signal.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f3eee6] px-4 py-16 text-ink sm:px-6 lg:px-8 lg:py-20" id="experiencia">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="space-y-5">
            <p className="text-sm font-semibold tracking-[0.2em] text-steel">EXPERIENCIA PUBLICA</p>
            <h2 className="max-w-lg text-4xl font-semibold leading-tight">
              Tu marca deja de parecer una app vacia y empieza a sentirse como una barberia seria.
            </h2>
            <p className="max-w-lg text-base leading-8 text-slate-600">
              La combinacion de retratos, interiores y producto real empuja la confianza visual antes de hablar de funciones. Eso cambia por completo la primera impresion.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
            <img
              alt="Barbero frente al espejo en una barberia elegante"
              className="landing-media-drift h-full min-h-[26rem] w-full rounded-[32px] object-cover object-center"
              src={heroPortrait}
            />
            <div className="grid gap-4">
              <img
                alt="Vista editorial del interior de la barberia"
                className="landing-media-drift-delayed h-56 w-full rounded-[30px] object-cover object-center md:h-[15rem]"
                src={loungePortrait}
              />
              <div className="flex h-full flex-col justify-between rounded-[30px] bg-[#111111] px-6 py-6 text-white">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-gold">
                  <Sparkles size={18} />
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/44">Direccion visual</p>
                  <p className="text-2xl font-semibold leading-tight">Menos plantilla. Mas identidad.</p>
                  <p className="text-sm leading-7 text-white/66">
                    La landing no necesita gritar. Necesita verse precisa, premium y coherente con el negocio que representa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20" id="sistema">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div className="space-y-5">
            <p className="text-sm font-semibold tracking-[0.2em] text-gold">SISTEMA CONECTADO</p>
            <h2 className="max-w-lg text-4xl font-semibold leading-tight text-white">
              El producto se muestra como operacion real, no como promesa abstracta.
            </h2>
            <p className="max-w-lg text-base leading-8 text-white/64">
              Agenda, clientes, paneles y crecimiento aparecen como una sola conversacion visual. Eso hace que la landing ayude al negocio en lugar de quedarse como portada vacia.
            </p>

            <div className="space-y-4 pt-3">
              {systemPoints.map((point) => (
                <div className="flex items-start gap-3" key={point}>
                  <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gold">
                    <Check size={14} />
                  </span>
                  <p className="max-w-md text-sm leading-7 text-white/66">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.06fr_0.94fr]">
            <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#101010]">
              <video
                autoPlay
                className="h-full min-h-[34rem] w-full object-cover object-center"
                loop
                muted
                playsInline
                poster={showcasePoster}
              >
                <source src={showcaseVideo} type="video/mp4" />
              </video>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/72 to-transparent px-5 pb-5 pt-16">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/78">
                  <Play size={12} />
                  Experiencia viva
                </div>
                <p className="mt-3 max-w-sm text-lg font-semibold text-white">
                  El producto ya no aparece aislado: entra en escena dentro de una atmosfera reconocible.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[30px] border border-white/10 bg-white/[0.04] px-5 py-5">
                <div className="flex items-center gap-3 text-gold">
                  <CalendarDays size={18} />
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/48">Reservas visibles</p>
                </div>
                <p className="mt-4 text-3xl font-semibold text-white">Agenda clara</p>
                <p className="mt-3 text-sm leading-7 text-white/62">
                  Disponibilidad, servicios y accion inmediata sin ruido visual innecesario.
                </p>
              </div>

              <img
                alt="Telefono con interfaz de Barber Flow"
                className="landing-media-drift h-[18rem] w-full rounded-[30px] object-cover object-center"
                src={devicePortrait}
              />

              <div className="rounded-[30px] border border-gold/20 bg-[linear-gradient(180deg,rgba(22,22,22,0.98),rgba(12,12,12,0.98))] px-5 py-5">
                <div className="flex items-center gap-3 text-gold">
                  <Store size={18} />
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]">Barberia preparada</p>
                </div>
                <p className="mt-4 text-3xl font-semibold text-white">Imagen + operacion</p>
                <p className="mt-3 text-sm leading-7 text-white/62">
                  La marca y el flujo de trabajo dejan de competir entre si. Todo empuja en la misma direccion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0f0f0f] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-gold">DETALLE</p>
            <h2 className="mt-3 max-w-lg text-4xl font-semibold leading-tight text-white">
              La narrativa visual ya puede sostener el posicionamiento del producto.
            </h2>
          </div>

          <div className="space-y-5">
            {detailNotes.map((note) => (
              <div className="flex items-start gap-3" key={note}>
                <span className="mt-1 text-gold">
                  <Scissors size={16} />
                </span>
                <p className="text-sm leading-7 text-white/64">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20" id="empezar">
        <div className="mx-auto grid max-w-[1280px] gap-8 rounded-[36px] border border-white/10 bg-white/[0.04] px-6 py-8 sm:px-8 lg:grid-cols-[0.98fr_1.02fr] lg:items-end lg:px-10 lg:py-10">
          <div className="space-y-4">
            <img alt="Barber Flow" className="h-10 w-auto" src={logoImage} />
            <h2 className="max-w-xl text-4xl font-semibold leading-tight text-white">
              Convierte la primera pantalla en una razon para entrar, explorar y reservar.
            </h2>
            <p className="max-w-xl text-base leading-8 text-white/66">
              La base ya queda lista para seguir afinando producto, secciones y conversion sin volver a una landing plana.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/register">
                <Button size="lg">
                  Crear mi cuenta
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Entrar
                </Button>
              </Link>
            </div>
            <p className="max-w-md text-sm leading-7 text-white/52 lg:text-right">
              Barber Flow ahora se presenta con imagen real, ritmo visual y una promesa mucho mas clara desde el inicio.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/8 bg-[#080808]">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr_0.9fr] lg:px-8">
          <div className="space-y-4">
            <img alt="Barber Flow" className="h-9 w-auto" src={logoImage} />
            <p className="max-w-sm text-sm leading-7 text-white/52">
              Reservas, operacion y presencia digital para barberias que quieren verse tan bien como trabajan.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-gold">Producto</p>
            <div className="mt-4 space-y-3 text-sm text-white/58">
              <p>Reservas online</p>
              <p>Agenda por barbero</p>
              <p>Paneles por rol</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-gold">Contacto</p>
            <div className="mt-4 space-y-3 text-sm text-white/58">
              <p>hola@barberflow.co</p>
              <p>Soporte para barberias modernas</p>
              <p>Colombia</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
