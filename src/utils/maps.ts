type AddressParts = {
  direccion?: string | null;
  ciudad?: string | null;
  pais?: string | null;
};

function cleanPart(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function buildBarberiaAddress({ direccion, ciudad, pais }: AddressParts) {
  return [cleanPart(direccion), cleanPart(ciudad), cleanPart(pais)].filter(Boolean).join(', ');
}

export function hasBarberiaAddress(parts: AddressParts) {
  return Boolean(buildBarberiaAddress(parts));
}

export function buildGoogleMapsSearchUrl(parts: AddressParts) {
  const address = buildBarberiaAddress(parts);
  if (!address) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function buildGoogleMapsEmbedUrl(parts: AddressParts) {
  const address = buildBarberiaAddress(parts);
  if (!address) return null;
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}
