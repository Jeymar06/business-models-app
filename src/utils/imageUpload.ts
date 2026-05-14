import { supabase } from '@/lib/supabase';

export async function compressImage(file: File, maxWidth = 1600, quality = 0.82) {
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen.');
  }

  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * ratio);
  const height = Math.round(bitmap.height * ratio);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('No fue posible procesar la imagen.');
  }

  context.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((nextBlob) => {
      if (nextBlob) resolve(nextBlob);
      else reject(new Error('No fue posible comprimir la imagen.'));
    }, 'image/jpeg', quality);
  });

  const safeName = file.name
    .replace(/\.[^.]+$/, '.jpg')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-');

  return new File([blob], safeName, { type: 'image/jpeg' });
}

export async function uploadPublicImage({
  bucket,
  file,
  folder,
  maxWidth = 1600,
}: {
  bucket: 'barberias' | 'profiles';
  file: File;
  folder: string;
  maxWidth?: number;
}) {
  const compressed = await compressImage(file, maxWidth);
  const path = `${folder.replace(/^\/+|\/+$/g, '')}/${crypto.randomUUID()}-${compressed.name}`;
  const { error } = await supabase.storage.from(bucket).upload(path, compressed, {
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
