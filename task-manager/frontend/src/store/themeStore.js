import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      dark: false,
      toggle: () =>
        set((state) => {
          const next = !state.dark;
          document.documentElement.classList.toggle('dark', next);
          return { dark: next };
        }),
      init: (dark) => {
        document.documentElement.classList.toggle('dark', dark);
      },
    }),
    { name: 'theme' }
  )
);
