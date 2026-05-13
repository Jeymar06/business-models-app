import logo from '@/assets/landing/full/barber-flow-logo.webp';
import client from '@/assets/landing/full/client.png';
import detail from '@/assets/landing/full/detail.png';
import cleanHero from '@/assets/landing/lounge-portrait.webp';
import image00 from '@/assets/landing/full/image-00.webp';
import image01 from '@/assets/landing/full/image-01.webp';
import image02 from '@/assets/landing/full/image-02.webp';
import image03 from '@/assets/landing/full/image-03.webp';
import image04 from '@/assets/landing/full/image-04.webp';
import image05 from '@/assets/landing/full/image-05.webp';
import image06 from '@/assets/landing/full/image-06.webp';
import image07 from '@/assets/landing/full/image-07.webp';
import image08 from '@/assets/landing/full/image-08.webp';
import image09 from '@/assets/landing/full/image-09.webp';
import image10 from '@/assets/landing/full/image-10.webp';
import image11 from '@/assets/landing/full/image-11.webp';
import image12 from '@/assets/landing/full/image-12.webp';
import image13 from '@/assets/landing/full/image-13.webp';
import image14 from '@/assets/landing/full/image-14.webp';
import image15 from '@/assets/landing/full/image-15.webp';
import image16 from '@/assets/landing/full/image-16.webp';
import image17 from '@/assets/landing/full/image-17.webp';
import intro from '@/assets/landing/full/intro.png';
import posterA from '@/assets/landing/full/poster-a.png';
import posterB from '@/assets/landing/full/poster-b.png';
import posterC from '@/assets/landing/full/poster-c.png';
import posterD from '@/assets/landing/full/poster-d.png';
import posterE from '@/assets/landing/full/poster-e.png';
import posterF from '@/assets/landing/full/poster-f.png';
import posterG from '@/assets/landing/full/poster-g.png';
import posterH from '@/assets/landing/full/poster-h.png';
import product from '@/assets/landing/full/product.png';
import video00 from '@/assets/landing/full/video-00.mp4';
import video01 from '@/assets/landing/full/video-01.mp4';
import video02 from '@/assets/landing/full/video-02.mp4';
import video03 from '@/assets/landing/full/video-03.mp4';
import video04 from '@/assets/landing/full/video-04.mp4';
import video05 from '@/assets/landing/full/video-05.mp4';

export const landingLogo = logo;

export const landingMediaGroups = {
  hero: {
    centerVideo: video00,
    centerPoster: image10,
    cleanImage: cleanHero,
  },
  introGallery: [video03, video05, image09],
  features: {
    video: video01,
    poster: image04,
    sideTop: image00,
  },
  problem: [image11],
  clients: {
    video: video02,
    poster: image01,
    images: [image12],
  },
  howItWorks: [
    { video: video03, poster: image17 },
    { video: video00, poster: image10 },
    { video: video05, poster: image06 },
  ],
  productShots: {
    intro,
    product,
    client,
    detail,
  },
  posters: [posterA, posterB, posterC, posterD, posterE, posterF, posterG, posterH],
  editorialImages: [
    image00,
    image01,
    image02,
    image03,
    image04,
    image05,
    image06,
    image07,
    image08,
    image09,
    image10,
    image11,
    image12,
    image13,
    image14,
    image15,
    image16,
    image17,
  ],
  reels: [
    { video: video00, poster: image10, label: 'Reservas' },
    { video: video01, poster: image04, label: 'Agenda' },
    { video: video02, poster: image01, label: 'Clientes' },
    { video: video03, poster: image17, label: 'Equipo' },
    { video: video04, poster: image05, label: 'Metricas' },
    { video: video05, poster: image06, label: 'Crecimiento' },
  ],
};
