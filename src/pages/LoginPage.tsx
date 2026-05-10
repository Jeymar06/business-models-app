import { Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button, Input, Pill } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { barberHeroImage } from '@/features/home/heroImage';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn({ email, password });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setIsLoading(true);

    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión con Google');
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
      <section className="surface-panel-dark relative isolate overflow-hidden rounded-[36px] px-6 py-10 text-cream sm:px-10 lg:min-h-[720px] lg:px-12 lg:py-12">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${barberHeroImage})` }} />
        <div className="hero-fade absolute inset-0" />
        <div className="hero-mesh absolute inset-0 opacity-25" />
        <div className="relative flex h-full flex-col justify-between gap-10">
          <div className="space-y-6">
            <Pill tone="gold">Barber Flow · Editorial</Pill>
            <h1 className="font-display max-w-xl text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl">
              Accede a una experiencia{' '}
              <span className="font-display-italic text-gold-200">más elegante y clara.</span>
            </h1>
            <p className="max-w-lg text-base leading-8 text-cream/72">
              Gestiona tu agenda, revisa tus citas o entra al panel de tu barbería con una interfaz pensada para moverse rápido.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <ValueCard label="Acceso" value="Seguro" />
            <ValueCard label="Flujo" value="Simple" />
            <ValueCard label="Panel" value="Responsive" />
          </div>
        </div>
      </section>

      <section className="surface-panel rounded-[36px] p-6 sm:p-10 lg:p-12">
        <div className="space-y-3">
          <p className="eyebrow text-ink/45">Iniciar sesión</p>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-ink">Bienvenido de vuelta</h2>
          <p className="text-sm leading-7 text-ink/55">Entra con tu cuenta para continuar en Barber Flow.</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="eyebrow mb-2 block text-ink/55" htmlFor="email">
              Email
            </label>
            <Input id="email" onChange={(event) => setEmail(event.target.value)} placeholder="tu@email.com" required type="email" value={email} />
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

          {error ? <div className="rounded-2xl border border-danger/22 bg-danger/8 p-3 text-sm text-danger">{error}</div> : null}

          <Button className="w-full" disabled={isLoading} size="lg" type="submit" variant="gold">
            {isLoading ? 'Entrando...' : 'Iniciar sesión'}
            {!isLoading ? <LogIn size={18} /> : null}
          </Button>
        </form>

        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-ink/8" />
          <span className="eyebrow text-ink/40">o</span>
          <div className="h-px flex-1 bg-ink/8" />
        </div>

        <Button className="w-full" disabled={isLoading} onClick={handleGoogleSignIn} size="lg" variant="outline-ink">
          Continuar con Google
        </Button>

        <div className="mt-6 flex items-start gap-3 rounded-[24px] bg-ink/4 p-4 text-sm text-ink/60">
          <ShieldCheck className="mt-0.5 shrink-0 text-gold-700" size={18} />
          <span>Tu sesión y tus flujos de cuenta usan la misma capa de autenticación integrada con Supabase.</span>
        </div>

        <p className="mt-6 text-center text-sm text-ink/60">
          ¿No tienes cuenta?{' '}
          <Link className="font-display font-semibold text-ink underline decoration-gold-500 decoration-2 underline-offset-4 transition-colors hover:text-gold-700" to="/register">
            Crear cuenta
          </Link>
        </p>
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
