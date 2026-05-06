import { CircleHelp, Mail, MessageSquareText } from 'lucide-react';

export function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-steel">Cuenta</p>
        <h1 className="text-3xl font-bold text-ink">Ayuda y soporte</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">Punto de entrada simple para dudas de acceso, cambios de cuenta y acompanamiento operativo.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <SupportCard description="Revisa perfil, rutas privadas y estado general de tu cuenta autenticada." icon={<CircleHelp size={18} />} title="Centro de ayuda" />
        <SupportCard description="Si no recuerdas tu clave o necesitas cambiarla, esta ruta ya esta conectada desde tu menu." icon={<MessageSquareText size={18} />} title="Credenciales" />
        <SupportCard description="Deja aqui el punto listo para conectar email, WhatsApp o ticketing cuando se defina el canal final." icon={<Mail size={18} />} title="Canal de soporte" />
      </section>
    </div>
  );
}

function SupportCard({
  description,
  icon,
  title,
}: {
  description: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-panel">
      <div className="mb-3 text-steel">{icon}</div>
      <h2 className="font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}
