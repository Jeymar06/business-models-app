import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isBefore, isSameDay, isSameMonth, startOfDay, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui';

interface CalendarioMesProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  availableDays?: number[];
  disabledPastDates?: boolean;
}

export function CalendarioMes({ availableDays, disabledPastDates = true, onSelectDate, selectedDate }: CalendarioMesProps) {
  const [month, setMonth] = useState(startOfMonth(selectedDate ?? new Date()));
  const today = startOfDay(new Date());
  const days = useMemo(() => eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  }), [month]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <Button onClick={() => setMonth((value) => subMonths(value, 1))} size="sm" variant="ghost">
          <ChevronLeft size={18} />
        </Button>
        <p className="font-semibold capitalize text-ink">{format(month, 'MMMM yyyy', { locale: es })}</p>
        <Button onClick={() => setMonth((value) => addMonths(value, 1))} size="sm" variant="ghost">
          <ChevronRight size={18} />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase text-slate-400">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day) => <span key={day}>{day}</span>)}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const isPast = disabledPastDates && isBefore(day, today);
          const noAvailability = availableDays?.length ? !availableDays.includes(day.getDay()) : false;
          const disabled = isPast || noAvailability;
          const selected = selectedDate ? isSameDay(day, selectedDate) : false;

          return (
            <button
              className={[
                'aspect-square rounded-md text-sm transition',
                !isSameMonth(day, month) ? 'text-slate-300' : 'text-slate-700',
                selected ? 'bg-ink text-white' : '',
                disabled ? 'cursor-not-allowed opacity-35' : 'hover:bg-slate-100',
              ].join(' ')}
              disabled={disabled}
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              type="button"
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
