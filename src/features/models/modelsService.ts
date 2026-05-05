import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Database, Json } from '@/types/supabase.types';

import {
  canvasSections,
  createEmptyCanvas,
  type BusinessModel,
  type BusinessModelInput,
  type Canvas,
  type CanvasSectionId,
} from './types';

type BusinessModelRow = Database['public']['Tables']['business_models']['Row'];
type CanvasBlockRow = Database['public']['Tables']['canvas_blocks']['Row'];

let demoModels: BusinessModel[] = [
  {
    id: 'demo-marketplace',
    name: 'Marketplace B2B',
    description: 'Conecta proveedores especializados con equipos de compras empresariales.',
    modelType: 'marketplace',
    status: 'active',
    revenueStreams: ['Comision por transaccion', 'Plan premium para proveedores'],
    costStructure: ['Soporte', 'Infraestructura', 'Adquisicion de proveedores'],
    canvas: {
      keyPartners: ['Proveedores certificados', 'Pasarelas de pago'],
      keyActivities: ['Curacion de oferta', 'Matchmaking'],
      keyResources: ['Base de proveedores', 'Datos de demanda'],
      valuePropositions: ['Compra mas rapida', 'Comparacion confiable'],
      customerRelationships: ['Onboarding guiado'],
      channels: ['Outbound', 'Contenido especializado'],
      customerSegments: ['Empresas medianas', 'Equipos de compras'],
      costStructure: ['Equipo comercial', 'Cloud'],
      revenueStreams: ['Comisiones', 'Suscripciones'],
    },
    createdAt: new Date().toISOString(),
  },
];

function toStringArray(value: Json): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function isCanvasSectionId(value: string): value is CanvasSectionId {
  return canvasSections.some((section) => section.id === value);
}

function blocksToCanvas(blocks: CanvasBlockRow[] = []): Canvas {
  const canvas = createEmptyCanvas();

  blocks.forEach((block) => {
    if (isCanvasSectionId(block.block_type)) {
      canvas[block.block_type] = toStringArray(block.content);
    }
  });

  return canvas;
}

function mapBusinessModel(row: BusinessModelRow, blocks: CanvasBlockRow[] = []): BusinessModel {
  const canvas = blocksToCanvas(blocks);

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    modelType: row.type,
    status: row.status,
    revenueStreams: canvas.revenueStreams,
    costStructure: canvas.costStructure,
    canvas,
    createdAt: row.created_at,
  };
}

async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user?.id ?? null;
}

async function getBlocksByModelIds(modelIds: string[]) {
  if (modelIds.length === 0) {
    return new Map<string, CanvasBlockRow[]>();
  }

  const { data, error } = await supabase
    .from('canvas_blocks')
    .select('*')
    .in('model_id', modelIds);

  if (error) {
    throw error;
  }

  return (data ?? []).reduce((blocksByModelId, block) => {
    const blocks = blocksByModelId.get(block.model_id) ?? [];
    blocks.push(block);
    blocksByModelId.set(block.model_id, blocks);
    return blocksByModelId;
  }, new Map<string, CanvasBlockRow[]>());
}

async function upsertCanvasBlocks(modelId: string, canvas: Canvas) {
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
}

export async function getModels() {
  if (!isSupabaseConfigured) {
    return demoModels;
  }

  const { data, error } = await supabase
    .from('business_models')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  const rows = data ?? [];
  const blocksByModelId = await getBlocksByModelIds(rows.map((row) => row.id));

  return rows.map((row) => mapBusinessModel(row, blocksByModelId.get(row.id)));
}

export async function getModelById(id: string) {
  if (!isSupabaseConfigured) {
    return demoModels.find((model) => model.id === id) ?? null;
  }

  const { data, error } = await supabase.from('business_models').select('*').eq('id', id).maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const blocksByModelId = await getBlocksByModelIds([data.id]);
  return mapBusinessModel(data, blocksByModelId.get(data.id));
}

export async function createModel(input: BusinessModelInput) {
  const now = new Date().toISOString();

  if (!isSupabaseConfigured) {
    const model: BusinessModel = {
      ...input,
      id: crypto.randomUUID(),
      status: input.status ?? 'draft',
      createdAt: now,
      updatedAt: now,
    };

    demoModels = [model, ...demoModels];
    return model;
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error('Debes iniciar sesion para crear modelos en Supabase.');
  }

  const { data, error } = await supabase
    .from('business_models')
    .insert({
      user_id: userId,
      name: input.name,
      description: input.description,
      type: input.modelType,
      status: input.status ?? 'draft',
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  await upsertCanvasBlocks(data.id, input.canvas);
  return mapBusinessModel(data, canvasSections.map((section) => ({
    id: `${data.id}-${section.id}`,
    model_id: data.id,
    block_type: section.id,
    content: input.canvas[section.id],
    updated_at: now,
  })));
}

export async function updateModel(id: string, input: Partial<BusinessModelInput>) {
  if (!isSupabaseConfigured) {
    demoModels = demoModels.map((model) => (model.id === id ? { ...model, ...input } : model));
    return demoModels.find((model) => model.id === id) ?? null;
  }

  const updatePayload: Database['public']['Tables']['business_models']['Update'] = {};

  if (input.description !== undefined) {
    updatePayload.description = input.description;
  }

  if (input.modelType !== undefined) {
    updatePayload.type = input.modelType;
  }

  if (input.name !== undefined) {
    updatePayload.name = input.name;
  }

  if (input.status !== undefined) {
    updatePayload.status = input.status;
  }

  const { data, error } = await supabase
    .from('business_models')
    .update(updatePayload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  if (input.canvas) {
    await upsertCanvasBlocks(id, input.canvas);
  }

  const blocksByModelId = await getBlocksByModelIds([id]);
  return mapBusinessModel(data, blocksByModelId.get(id));
}
