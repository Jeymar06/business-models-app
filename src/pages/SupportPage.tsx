import {
  CalendarDays,
  CircleHelp,
  Copy,
  KeyRound,
  LifeBuoy,
  Mail,
  MessageSquareText,
  Send,
  ShieldCheck,
  UserCircle2,
} from 'lucide-react';
import type { ReactNode, SelectHTMLAttributes } from 'react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Input } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/useAuth';

const issueOptions = [
  { value: 'account-access', label: 'Acceso a la cuenta' },
  { value: 'password-change', label: 'Cambio de contraseña' },
  { value: 'booking-help', label: 'Ayuda con reservas' },
  { value: 'business-setup', label: 'Configuracion de barberia' },
  { value: 'other', label: 'Otro tema' },
];

const priorityOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Urgente' },
];

export function SupportPage() {
  const { profile, role, user } = useAuth();
  const displayName = profile?.full_name?.trim() || user?.email || 'Usuario';
  const displayEmail = profile?.email || user?.email || '';
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL?.trim() ?? '';
  const dashboardPath =
    role === 'admin' ? '/admin-dashboard' : role === 'superadmin' ? '/superadmin-dashboard' : role === 'client' ? '/client-dashboard' : '/profile';

  const [subject, setSubject] = useState('Necesito ayuda con mi cuenta');
  const [category, setCategory] = useState(issueOptions[0].value);
  const [priority, setPriority] = useState(priorityOptions[0].value);
  const [details, setDetails] = useState('');
  const [copied, setCopied] = useState(false);

  const selectedCategory = issueOptions.find((option) => option.value === category)?.label ?? category;
  const selectedPriority = priorityOptions.find((option) => option.value === priority)?.label ?? priority;

  const requestSummary = useMemo(
    () =>
      [
        `Solicitud de soporte - BarberApp`,
        ``,
        `Nombre: ${displayName}`,
        `Correo: ${displayEmail || 'No disponible'}`,
        `Rol: ${role ?? 'Sin rol'}`,
        `Categoria: ${selectedCategory}`,
        `Prioridad: ${selectedPriority}`,
        `Asunto: ${subject}`,
        ``,
        `Detalle:`,
        details.trim() || 'Sin detalle adicional.',
      ].join('\n'),
    [details, displayEmail, displayName, role, selectedCategory, selectedPriority, subject],
  );

  async function handleCopySummary() {
    try {
      await navigator.clipboard.writeText(requestSummary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.alert('No pudimos copiar la solicitud. Intenta de nuevo.');
    }
  }

  function handleOpenDraft() {
    if (!supportEmail) {
      void handleCopySummary();
      return;
    }

    const mailto = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(requestSummary)}`;
    window.location.href = mailto;
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <section className="surface-panel-dark rounded-[32px] px-6 py-7 text-white sm:px-8 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold tracking-[0.18em] text-gold">AYUDA Y SOPORTE</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Prepara tu solicitud sin salir de tu cuenta.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
              Reune el contexto clave, copia tu mensaje en segundos y entra a las rutas mas utiles para resolver acceso, perfil o reservas.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/44">Cuenta activa</p>
            <p className="mt-2 text-sm font-semibold text-white">{displayName}</p>
            <p className="text-xs text-white/56">{displayEmail || 'Sin correo disponible'}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <QuickLinkCard
          description="Revisa tus datos de cuenta y confirma que tu perfil este correcto."
          icon={<UserCircle2 size={18} />}
          title="Mi perfil"
          to="/profile"
        />
        <QuickLinkCard
          description="Actualiza tu clave autenticada desde la ruta ya conectada con Supabase."
          icon={<KeyRound size={18} />}
          title="Cambiar contraseña"
          to="/change-password"
        />
        <QuickLinkCard
          description="Vuelve a tu panel principal para seguir con reservas, gestion o supervision."
          icon={<CalendarDays size={18} />}
          title="Ir a mi panel"
          to={dashboardPath}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="surface-panel rounded-[28px] p-6 sm:p-7">
          <div className="flex items-start gap-3">
            <span className="mt-1 text-steel">
              <LifeBuoy size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-steel">SOLICITUD GUIADA</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">Describe el problema una sola vez.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
                El formulario arma un resumen listo para copiar o abrir en tu correo si el canal de soporte ya esta configurado.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Input label="Asunto" name="subject" onChange={(event) => setSubject(event.target.value)} value={subject} />

            <SelectField
              label="Categoria"
              name="category"
              onChange={(event) => setCategory(event.target.value)}
              value={category}
            >
              {issueOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>

            <SelectField
              label="Prioridad"
              name="priority"
              onChange={(event) => setPriority(event.target.value)}
              value={priority}
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>

            <Input disabled label="Correo de contacto" name="email" value={displayEmail || 'Sin correo disponible'} />
          </div>

          <label className="mt-4 grid gap-2 text-sm font-medium text-slate-700" htmlFor="support-details">
            <span>Detalle del problema</span>
            <textarea
              className="min-h-40 rounded-2xl border border-black/8 bg-white/96 px-4 py-3 text-sm text-ink shadow-soft outline-none transition-all placeholder:text-slate-400 focus:border-mint/40 focus:ring-4 focus:ring-mint/10"
              id="support-details"
              onChange={(event) => setDetails(event.target.value)}
              placeholder="Describe que paso, desde que pantalla te ocurrio y que intentaste antes."
              value={details}
            />
          </label>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button className="w-full sm:w-auto" onClick={() => void handleCopySummary()} size="lg">
              <Copy size={16} />
              {copied ? 'Solicitud copiada' : 'Copiar solicitud'}
            </Button>
            <Button className="w-full sm:w-auto" onClick={handleOpenDraft} size="lg" variant="secondary">
              <Send size={16} />
              {supportEmail ? 'Abrir correo preparado' : 'Copiar y compartir'}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-panel-dark rounded-[28px] p-6 text-white">
            <p className="text-sm font-semibold tracking-[0.18em] text-gold">RESUMEN LISTO</p>
            <pre className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-white/72">{requestSummary}</pre>
          </div>

          <div className="rounded-[28px] border border-black/8 bg-white p-6">
            <div className="flex items-start gap-3">
              <span className="mt-1 text-steel">
                <ShieldCheck size={18} />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-ink">Que puedes resolver desde aqui</h2>
                <div className="mt-4 space-y-4">
                  <SupportHint
                    icon={<CircleHelp size={16} />}
                    title="Acceso y cuenta"
                    description="Usa el resumen para explicar bloqueos de login, correo o perfil."
                  />
                  <SupportHint
                    icon={<MessageSquareText size={16} />}
                    title="Reservas y operacion"
                    description="Describe la barberia, la cita o el flujo exacto donde aparecio el problema."
                  />
                  <SupportHint
                    icon={<Mail size={16} />}
                    title="Salida lista para compartir"
                    description="Copia todo el contexto en segundos sin volver a escribir datos basicos."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function QuickLinkCard({
  description,
  icon,
  title,
  to,
}: {
  description: string;
  icon: ReactNode;
  title: string;
  to: string;
}) {
  return (
    <Link className="rounded-[28px] border border-black/8 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-panel" to={to}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#111111] text-gold">{icon}</div>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-500">{description}</p>
    </Link>
  );
}

function SupportHint({
  description,
  icon,
  title,
}: {
  description: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <article className="flex items-start gap-3">
      <span className="mt-1 text-steel">{icon}</span>
      <div>
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </article>
  );
}

function SelectField({
  children,
  label,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode; label: string }) {
  const selectId = props.id ?? props.name;

  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700" htmlFor={selectId}>
      <span>{label}</span>
      <select
        className="h-11 rounded-xl border border-black/8 bg-white/96 px-3.5 text-sm text-ink shadow-soft outline-none transition-all focus:border-mint/40 focus:ring-4 focus:ring-mint/10"
        id={selectId}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
