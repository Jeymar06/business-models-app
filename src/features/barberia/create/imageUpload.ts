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

  return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
}

export async function uploadBarberiaImage(file: File, userId: string, type: 'logos' | 'banners') {
  const compressed = await compressImage(file, type === 'logos' ? 800 : 1800);
  const path = `${type}/${userId}/${crypto.randomUUID()}-${compressed.name}`;
  const { error } = await supabase.storage.from('barberias').upload(path, compressed, {
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from('barberias').getPublicUrl(path);
  return data.publicUrl;
}
