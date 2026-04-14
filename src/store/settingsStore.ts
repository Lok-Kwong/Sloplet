import { create } from 'zustand';
import { AppSettings, DEFAULT_SETTINGS } from '@/types';
import { getSettings, saveSettings } from '@/db/repository';

interface SettingsStore {
  settings: AppSettings;
  isLoaded: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoaded: false,

  loadSettings: async () => {
    const settings = await getSettings();
    set({ settings, isLoaded: true });
  },

  updateSettings: async (patch) => {
    const updated = { ...get().settings, ...patch };
    set({ settings: updated });
    await saveSettings(updated);
  },
}));
