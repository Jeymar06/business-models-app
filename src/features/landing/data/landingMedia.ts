const landingLogoDataUri =
  'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80';

const videos = {
  primary: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  secondary: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  tertiary: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
};

const images = {
  intro: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1200&q=80',
  posterA: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
  posterB: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80',
  posterC: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80',
  detail: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=80',
  product: 'https://images.unsplash.com/photo-1512690459411-b0fd1b68f3e6?auto=format&fit=crop&w=1200&q=80',
  client: 'https://images.unsplash.com/photo-1516880711640-ef7db81be3e1?auto=format&fit=crop&w=1200&q=80',
};

export const landingLogo = landingLogoDataUri;

export const landingMediaGroups = {
  hero: {
    centerVideo: videos.primary,
    centerPoster: images.posterA,
  },
  introGallery: [videos.tertiary, videos.secondary, images.intro],
  features: {
    video: videos.secondary,
    poster: images.posterB,
    sideTop: images.detail,
  },
  problem: [images.product],
  clients: {
    video: videos.tertiary,
    poster: images.posterC,
    images: [images.client],
  },
  howItWorks: [
    { video: videos.primary, poster: images.posterA },
    { video: videos.secondary, poster: images.posterB },
    { video: videos.tertiary, poster: images.posterC },
  ],
};
