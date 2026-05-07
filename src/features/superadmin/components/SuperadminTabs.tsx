import { Building2, CalendarDays, LayoutList, Users } from 'lucide-react';

import type { SuperadminTab } from '@/features/superadmin/superadminService';

const tabs: Array<{ icon: typeof LayoutList; id: SuperadminTab; label: string }> = [
  { id: 'resumen', label: 'Resumen', icon: LayoutList },
  { id: 'barberias', label: 'Barberías', icon: Building2 },
  { id: 'usuarios', label: 'Usuarios', icon: Users },
  { id: 'citas', label: 'Citas', icon: CalendarDays },
];

export function SuperadminTabs({ activeTab, onChange }: { activeTab: SuperadminTab; onChange: (tab: SuperadminTab) => void }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-[24px] border border-black/8 bg-white/60 p-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === activeTab;

        return (
          <button
            className={[
              'inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition',
              isActive ? 'bg-[#171717] text-[#F8F4EB]' : 'text-[#5C5348] hover:bg-white hover:text-[#171717]',
            ].join(' ')}
            key={tab.id}
            onClick={() => onChange(tab.id)}
            type="button"
          >
            <Icon size={16} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
