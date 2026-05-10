type MediaCard =
  | {
      type: 'image';
      src: string;
      alt: string;
    }
  | {
      type: 'video';
      src: string;
      poster?: string;
      alt: string;
    };

export function MediaGallerySection({
  cards,
  className = '',
  columnsClassName = 'lg:grid-cols-3',
  dark = false,
}: {
  cards: MediaCard[];
  className?: string;
  columnsClassName?: string;
  dark?: boolean;
}) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className={['grid gap-4', columnsClassName].join(' ')}>
          {cards.map((card) => (
            <article
              className={[
                'overflow-hidden rounded-[30px] border',
                dark ? 'border-white/10 bg-[#111111]' : 'border-black/8 bg-white',
              ].join(' ')}
              key={`${card.type}-${card.src}`}
            >
              {card.type === 'image' ? (
                <img alt={card.alt} className="h-full min-h-[18rem] w-full object-cover object-center" src={card.src} />
              ) : (
                <video
                  autoPlay
                  className="h-full min-h-[18rem] w-full object-cover object-center"
                  loop
                  muted
                  playsInline
                  poster={card.poster}
                  aria-label={card.alt}
                >
                  <source src={card.src} type="video/mp4" />
                </video>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
