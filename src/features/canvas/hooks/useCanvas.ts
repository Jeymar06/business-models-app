import { useCallback, useState } from 'react';

import { createEmptyCanvas, type Canvas, type CanvasSectionId } from '@/features/models/types';

export function useCanvas(initialCanvas: Canvas = createEmptyCanvas()) {
  const [canvas, setCanvas] = useState<Canvas>(initialCanvas);

  const addItem = useCallback((sectionId: CanvasSectionId, item: string) => {
    setCanvas((currentCanvas) => ({
      ...currentCanvas,
      [sectionId]: [...currentCanvas[sectionId], item],
    }));
  }, []);

  const removeItem = useCallback((sectionId: CanvasSectionId, index: number) => {
    setCanvas((currentCanvas) => ({
      ...currentCanvas,
      [sectionId]: currentCanvas[sectionId].filter((_, itemIndex) => itemIndex !== index),
    }));
  }, []);

  const reset = useCallback(() => {
    setCanvas(createEmptyCanvas());
  }, []);

  return {
    addItem,
    canvas,
    removeItem,
    reset,
    setCanvas,
  };
}
