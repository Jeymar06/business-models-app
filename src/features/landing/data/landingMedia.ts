import logo from '@/assets/landing/full/barber-flow-logo.webp';
import image00 from '@/assets/landing/full/image-00.webp';
import image01 from '@/assets/landing/full/image-01.webp';
import image04 from '@/assets/landing/full/image-04.webp';
import image06 from '@/assets/landing/full/image-06.webp';
import image09 from '@/assets/landing/full/image-09.webp';
import image10 from '@/assets/landing/full/image-10.webp';
import image11 from '@/assets/landing/full/image-11.webp';
import image12 from '@/assets/landing/full/image-12.webp';
import image17 from '@/assets/landing/full/image-17.webp';
import video00 from '@/assets/landing/full/video-00.mp4';
import video01 from '@/assets/landing/full/video-01.mp4';
import video02 from '@/assets/landing/full/video-02.mp4';
import video03 from '@/assets/landing/full/video-03.mp4';
import video05 from '@/assets/landing/full/video-05.mp4';

export const landingLogo = logo;

export const landingMediaGroups = {
  hero: {
    centerVideo: video00,
    centerPoster: image10,
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
};
