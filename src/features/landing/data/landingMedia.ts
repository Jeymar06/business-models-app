import landingLogoFile from "../../../assets/landing/full/logo.png";
import videoPrimary from "../../../assets/landing/full/video-primary.mp4";
import videoSecondary from "../../../assets/landing/full/video-secondary.mp4";
import videoTertiary from "../../../assets/landing/full/video-tertiary.mp4";

import introImage from "../../../assets/landing/full/intro.png";
import posterAImage from "../../../assets/landing/full/poster-a.png";
import posterBImage from "../../../assets/landing/full/poster-b.png";
import posterCImage from "../../../assets/landing/full/poster-c.png";
import detailImage from "../../../assets/landing/full/detail.png";
import productImage from "../../../assets/landing/full/product.png";
import clientImage from "../../../assets/landing/full/client.png";

const landingLogoDataUri = landingLogoFile;
const videos = {
  primary: videoPrimary,
  secondary: videoSecondary,
  tertiary: videoTertiary,
};

const images = {
  intro: introImage,
  posterA: posterAImage,
  posterB: posterBImage,
  posterC: posterCImage,
  detail: detailImage,
  product: productImage,
  client: clientImage,
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
