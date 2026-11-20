import { createContext, useContext, useState, type ReactNode } from 'react';

import { upcomingDays, type UpcomingDay } from '@/constants/sample-data';

type DaysContextValue = {
  days: UpcomingDay[];
  removeDay: (id: string) => void;
  pinDay: (id: string) => void;
  unpinDay: (id: string) => void;
  updateDay: (id: string, patch: Partial<UpcomingDay>) => void;
};

const DaysContext = createContext<DaysContextValue | null>(null);

export function DaysProvider({ children }: { children: ReactNode }) {
  const [days, setDays] = useState(upcomingDays);

  const removeDay = (id: string) => {
    setDays((prev) => prev.filter((day) => day.id !== id));
  };

  const pinDay = (id: string) => {
    setDays((prev) => prev.map((day) => ({ ...day, pinned: day.id === id })));
  };

  const unpinDay = (id: string) => {
    setDays((prev) => prev.map((day) => (day.id === id ? { ...day, pinned: false } : day)));
  };

  const updateDay = (id: string, patch: Partial<UpcomingDay>) => {
    setDays((prev) =>
      prev.map((day) => {
        if (patch.pinned === true && day.id !== id) return { ...day, pinned: false };
        if (day.id !== id) return day;
        return { ...day, ...patch };
      }),
    );
  };

  return (
    <DaysContext.Provider value={{ days, removeDay, pinDay, unpinDay, updateDay }}>{children}</DaysContext.Provider>
  );
}

export function useDays() {
  const value = useContext(DaysContext);
  if (!value) throw new Error('useDays must be used within DaysProvider');
  return value;
}
