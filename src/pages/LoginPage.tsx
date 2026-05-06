import { Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button, Input } from '@/components/ui';
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
      <section className="surface-panel-dark relative isolate overflow-hidden rounded-[32px] px-6 py-8 text-white sm:px-8 lg:min-h-[720px] lg:px-10 lg:py-10">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${barberHeroImage})` }} />
        <div className="hero-fade absolute inset-0" />
        <div className="hero-mesh absolute inset-0 opacity-20" />
        <div className="relative flex h-full flex-col justify-between gap-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold tracking-[0.18em] text-gold">BARBERAPP</p>
            <h1 className="max-w-xl text-4xl font-bold leading-tight">Accede a una experiencia de reservas más elegante y más clara.</h1>
            <p className="max-w-lg text-sm leading-7 text-white/68">
              Gestiona tu agenda, revisa tus citas o entra al panel de tu barbería con una interfaz premium pensada para moverse rápido.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <ValueCard label="Acceso" value="Seguro" />
            <ValueCard label="Flujo" value="Simple" />
            <ValueCard label="Panel" value="Responsive" />
          </div>
        </div>
      </section>

      <section className="surface-panel rounded-[32px] p-6 sm:p-8 lg:p-10">
        <div className="space-y-2">
          <p className="text-sm font-semibold tracking-[0.18em] text-steel">INICIAR SESIÓN</p>
          <h2 className="text-3xl font-bold text-ink">Bienvenido de vuelta</h2>
          <p className="text-sm leading-7 text-slate-500">Entra con tu cuenta para continuar en BarberApp.</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-ink" htmlFor="email">
              Email
            </label>
            <Input id="email" onChange={(event) => setEmail(event.target.value)} placeholder="tu@email.com" required type="email" value={email} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink" htmlFor="password">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword((current) => !current)}
                type="button"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error ? <div className="rounded-2xl border border-danger/20 bg-danger/10 p-3 text-sm text-danger">{error}</div> : null}

          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? 'Entrando...' : 'Iniciar sesión'}
            {!isLoading ? <LogIn size={18} /> : null}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-black/8" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">o</span>
          <div className="h-px flex-1 bg-black/8" />
        </div>

        <Button className="w-full" disabled={isLoading} onClick={handleGoogleSignIn} variant="secondary">
          Continuar con Google
        </Button>

        <div className="mt-6 flex items-start gap-3 rounded-[24px] bg-black/4 p-4 text-sm text-slate-600">
          <ShieldCheck className="mt-0.5 shrink-0 text-mint-dark" size={18} />
          <span>Tu sesión y tus flujos de cuenta usan la misma capa de autenticación integrada con Supabase.</span>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          ¿No tienes cuenta?{' '}
          <Link className="font-medium text-ink hover:text-mint-dark" to="/register">
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
      <p className="text-xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/44">{label}</p>
    </div>
  );
}
