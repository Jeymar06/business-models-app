with inserted_model as (
  insert into public.business_models (
    name,
    description,
    type,
    status
  ) values (
    'Marketplace B2B',
    'Plataforma para conectar proveedores especializados con empresas medianas.',
    'marketplace',
    'active'
  )
  returning id
)
insert into public.canvas_blocks (
  model_id,
  block_type,
  content
)
select
  inserted_model.id,
  blocks.block_type,
  blocks.content::jsonb
from inserted_model
cross join (
  values
    ('keyPartners', '["Proveedores certificados", "Pasarelas de pago"]'),
    ('keyActivities', '["Curacion de oferta", "Matchmaking", "Soporte"]'),
    ('keyResources', '["Red de proveedores", "Datos de demanda"]'),
    ('valuePropositions', '["Reducir tiempos de compra", "Comparar proveedores confiables"]'),
    ('customerRelationships', '["Onboarding guiado", "Soporte consultivo"]'),
    ('channels', '["Ventas outbound", "Contenido especializado"]'),
    ('customerSegments', '["Empresas medianas", "Equipos de compras"]'),
    ('costStructure', '["Equipo comercial", "Cloud", "Atencion al cliente"]'),
    ('revenueStreams', '["Comisiones", "Planes premium"]')
) as blocks(block_type, content);
