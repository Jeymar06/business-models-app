import { uploadPublicImage } from '@/utils/imageUpload';

export async function uploadBarberiaImage(file: File, userId: string, type: 'logos' | 'banners') {
  return uploadPublicImage({
    bucket: 'barberias',
    file,
    folder: `${type}/${userId}`,
    maxWidth: type === 'logos' ? 800 : 1800,
  });
}
