import businessModelCanvas from '@/assets/landing/full/Modelo De Negocios.jpeg';

export function CanvasPage() {
  return (
    <div className="min-h-screen bg-ink p-4 text-cream">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1400px] items-center justify-center">
        <img
          src={businessModelCanvas}
          alt="Canvas del modelo de negocio"
          className="h-full w-full max-h-[calc(100vh-4rem)] max-w-full rounded-3xl border border-white/10 bg-black/20 object-contain shadow-2xl shadow-black/40"
        />
      </div>
    </div>
  );
}
