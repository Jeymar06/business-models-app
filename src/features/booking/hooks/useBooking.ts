import { useMemo, useState } from 'react';

import type { BookingSlot } from '@/features/booking/bookingService';
import type { Barbero, Servicio } from '@/types/supabase.types';

export function useBooking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [barbero, setBarbero] = useState<Barbero | null>(null);
  const [anyBarbero, setAnyBarbero] = useState(false);
  const [fecha, setFecha] = useState<Date | null>(null);
  const [slot, setSlot] = useState<BookingSlot | null>(null);
  const [notas, setNotas] = useState('');

  const canGoNext = useMemo(() => {
    if (currentStep === 1) return Boolean(servicio);
    if (currentStep === 2) return Boolean(barbero || anyBarbero);
    if (currentStep === 3) return Boolean(fecha && slot);
    return true;
  }, [anyBarbero, barbero, currentStep, fecha, servicio, slot]);

  function selectServicio(nextServicio: Servicio) {
    setServicio(nextServicio);
    setBarbero(null);
    setAnyBarbero(false);
    setFecha(null);
    setSlot(null);
  }

  function selectBarbero(nextBarbero: Barbero) {
    setBarbero(nextBarbero);
    setAnyBarbero(false);
    setFecha(null);
    setSlot(null);
  }

  function selectAnyBarbero() {
    setBarbero(null);
    setAnyBarbero(true);
    setFecha(null);
    setSlot(null);
  }

  function selectFecha(nextFecha: Date) {
    setFecha(nextFecha);
    setSlot(null);
  }

  function selectSlot(nextSlot: BookingSlot) {
    setSlot(nextSlot);
  }

  function nextStep() {
    if (!canGoNext) return;
    setCurrentStep((step) => Math.min(step + 1, 4));
  }

  function prevStep() {
    setCurrentStep((step) => Math.max(step - 1, 1));
  }

  function resetBooking() {
    setCurrentStep(1);
    setServicio(null);
    setBarbero(null);
    setAnyBarbero(false);
    setFecha(null);
    setSlot(null);
    setNotas('');
  }

  return {
    anyBarbero,
    barbero,
    canGoNext,
    currentStep,
    fecha,
    nextStep,
    notas,
    prevStep,
    resetBooking,
    selectAnyBarbero,
    selectBarbero,
    selectFecha,
    selectServicio,
    selectSlot,
    servicio,
    setNotas,
    slot,
  };
}
