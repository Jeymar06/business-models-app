import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Json } from '@/types/supabase.types';

import { canvasSections, createEmptyCanvas, type Canvas, type CanvasSectionId } from '../models/types';

function toStringArray(value: Json): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function isCanvasSectionId(value: string): value is CanvasSectionId {
  return canvasSections.some((section) => section.id === value);
}

export async function getCanvas(modelId: string) {
  if (!isSupabaseConfigured || modelId === 'local-draft') {
    return createEmptyCanvas();
  }

  const { data, error } = await supabase
    .from('canvas_blocks')
    .select('*')
    .eq('model_id', modelId);

  if (error) {
    throw error;
  }

  const canvas = createEmptyCanvas();

  (data ?? []).forEach((block) => {
    if (isCanvasSectionId(block.block_type)) {
      canvas[block.block_type] = toStringArray(block.content);
    }
  });

  return canvas;
}

export async function saveCanvas(modelId: string, canvas: Canvas) {
  if (!isSupabaseConfigured || modelId === 'local-draft') {
    return canvas;
  }

  const rows = canvasSections.map((section) => ({
    model_id: modelId,
    block_type: section.id,
    content: canvas[section.id],
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('canvas_blocks')
    .upsert(rows, { onConflict: 'model_id,block_type' });

  if (error) {
    throw error;
  }

  return canvas;
}
