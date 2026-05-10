import { Eye, EyeOff, ShieldCheck, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button, Input, Pill, useToast } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { barberHeroImage } from '@/features/home/heroImage';

export function RegisterPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!fullName.trim()) {
      toast.error('El nombre es requerido', 'Datos incompletos');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden', 'Validación');
      return;
    }
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres', 'Validación');
      return;
    }

    setIsLoading(true);
    try {
      await signUp({ fullName, email, password });
      toast.success('Por favor inicia sesión.', 'Cuenta creada');
      navigate('/login', { state: { message: 'Cuenta creada. Por favor inicia sesión.' } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al crear la cuenta', 'Error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
      <section className="surface-panel rounded-[36px] p-6 sm:p-10 lg:p-12">
        <div className="space-y-3">
          <p className="eyebrow text-ink/45">Crear cuenta</p>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-ink">
            Únete a <span className="font-display-italic text-gold-700">Barber Flow.</span>
          </h2>
          <p className="text-sm leading-7 text-ink/55">
            Crea tu acceso y empieza a reservar o a gestionar tu barbería desde una misma plataforma.
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="eyebrow mb-2 block text-ink/55" htmlFor="fullName">
              Nombre completo
            </label>
            <Input
              id="fullName"
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Juan Pérez"
              required
              type="text"
              value={fullName}
            />
          </div>

          <div>
            <label className="eyebrow mb-2 block text-ink/55" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@email.com"
              required
              type="email"
              value={email}
            />
          </div>

          <div>
            <label className="eyebrow mb-2 block text-ink/55" htmlFor="password">
              Contraseña
            </label>
            <div className="relative">
              <Input
                id="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
              />
              <button
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 transition-colors hover:text-ink"
                onClick={() => setShowPassword((current) => !current)}
                type="button"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="eyebrow mb-2 block text-ink/55" htmlFor="confirmPassword">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                required
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
              />
              <button
                aria-label={showConfirmPassword ? 'Ocultar confirmación' : 'Mostrar confirmación'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 transition-colors hover:text-ink"
                onClick={() => setShowConfirmPassword((current) => !current)}
                type="button"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button className="w-full" disabled={isLoading} size="lg" type="submit" variant="gold">
            {isLoading ? 'Creando…' : 'Crear cuenta'}
            {!isLoading ? <UserPlus size={18} /> : null}
          </Button>
        </form>

        <div className="mt-6 flex items-start gap-3 rounded-[24px] bg-ink/4 p-4 text-sm text-ink/60">
          <ShieldCheck className="mt-0.5 shrink-0 text-gold-700" size={18} />
          <span>
            Tu cuenta queda lista para cliente y también puede crecer a barbería administrada desde el mismo login.
          </span>
        </div>

        <p className="mt-6 text-center text-sm text-ink/60">
          ¿Ya tienes cuenta?{' '}
          <Link
            className="font-display font-semibold text-ink underline decoration-gold-500 decoration-2 underline-offset-4 transition-colors hover:text-gold-700"
            to="/login"
          >
            Inicia sesión
          </Link>
        </p>
      </section>

      <section className="surface-panel-dark relative isolate overflow-hidden rounded-[36px] px-6 py-10 text-cream sm:px-10 lg:min-h-[720px] lg:px-12 lg:py-12">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${barberHeroImage})` }} />
        <div className="hero-fade absolute inset-0" />
        <div className="hero-mesh absolute inset-0 opacity-25" />
        <div className="relative flex h-full flex-col justify-between gap-10">
          <div className="space-y-6">
            <Pill tone="gold">Nueva etapa</Pill>
            <h1 className="font-display max-w-xl text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl">
              Empieza simple,{' '}
              <span className="font-display-italic text-gold-200">escala editorial.</span>
            </h1>
            <p className="max-w-lg text-base leading-8 text-cream/72">
              Barber Flow une reservas, operación y visibilidad en una experiencia oscura, moderna y preparada para mobile.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <ValueCard label="Reserva" value="Rápida" />
            <ValueCard label="Gestión" value="Central" />
            <ValueCard label="Marca" value="Premium" />
          </div>
        </div>
      </section>
    </div>
  );
}

function ValueCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 backdrop-blur-sm">
      <p className="font-display text-2xl font-semibold tracking-tight text-cream">{value}</p>
      <p className="eyebrow mt-1 text-cream/45">{label}</p>
    </div>
  );
}
