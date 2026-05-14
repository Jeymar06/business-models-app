export function isRenderableMediaUrl(value?: string | null) {
  const candidate = value?.trim();
  if (!candidate) return false;

  if (candidate.startsWith('blob:') || candidate.startsWith('data:') || candidate.startsWith('/')) {
    return true;
  }

  try {
    const url = new URL(candidate);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
