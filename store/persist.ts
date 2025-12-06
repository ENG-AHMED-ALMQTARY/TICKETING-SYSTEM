import { StateCreator } from 'zustand';

export const withLocalStoragePersist = <T>(
  config: StateCreator<T>,
  key: string,
  partialize: (state: T) => Partial<T> = (state) => state
): StateCreator<T> => (set, get, api) => {
  const initialState = config(
    (args) => {
      set(args);
    },
    get,
    api
  );

  let hydratedState: Partial<T> = {};

  if (typeof window !== 'undefined') {
    // 1. Recover state from localStorage
    try {
      const storageValue = localStorage.getItem(key);
      if (storageValue) {
        hydratedState = JSON.parse(storageValue);
      }
    } catch (e) {
      console.warn(`Failed to parse stored state for key "${key}"`, e);
    }

    // 2. Subscribe to changes and save to localStorage
    api.subscribe((state) => {
      try {
        const stateToSave = partialize(state);
        localStorage.setItem(key, JSON.stringify(stateToSave));
      } catch (e) {
        console.warn(`Failed to save state for key "${key}"`, e);
      }
    });
  }

  // Merge initial state with hydrated state
  return { ...initialState, ...hydratedState };
};
