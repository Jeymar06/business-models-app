import type { EntityStatus } from '@/types/global.types';

export const canvasSections = [
  { id: 'keyPartners', title: 'Socios clave' },
  { id: 'keyActivities', title: 'Actividades clave' },
  { id: 'keyResources', title: 'Recursos clave' },
  { id: 'valuePropositions', title: 'Propuesta de valor' },
  { id: 'customerRelationships', title: 'Relacion con clientes' },
  { id: 'channels', title: 'Canales' },
  { id: 'customerSegments', title: 'Segmentos de cliente' },
  { id: 'costStructure', title: 'Estructura de costos' },
  { id: 'revenueStreams', title: 'Fuentes de ingreso' },
] as const;

export type CanvasSectionId = (typeof canvasSections)[number]['id'];

export type Canvas = Record<CanvasSectionId, string[]>;

export type BusinessModel = {
  id: string;
  name: string;
  description?: string;
  modelType: string;
  status: EntityStatus;
  revenueStreams: string[];
  costStructure: string[];
  canvas: Canvas;
  createdAt: string;
  updatedAt?: string;
};

export type BusinessModelInput = {
  name: string;
  description?: string;
  modelType: string;
  status?: EntityStatus;
  revenueStreams: string[];
  costStructure: string[];
  canvas: Canvas;
};

export function createEmptyCanvas(): Canvas {
  return canvasSections.reduce((canvas, section) => {
    canvas[section.id] = [];
    return canvas;
  }, {} as Canvas);
}

export const emptyCanvas = createEmptyCanvas();
