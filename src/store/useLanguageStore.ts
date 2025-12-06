
import { create } from 'zustand';
import { en } from '../i18n/en';
import { ar } from '../i18n/ar';
import { withLocalStoragePersist } from './persist';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface LanguageState {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en,
  ar,
};

export const useLanguageStore = create<LanguageState>(
  withLocalStoragePersist(
    (set, get) => ({
      language: 'en',
      direction: 'ltr',
      
      setLanguage: (lang: Language) => {
        const direction = lang === 'ar' ? 'rtl' : 'ltr';
        // Update DOM immediately
        document.documentElement.setAttribute('dir', direction);
        document.documentElement.lang = lang;
        
        set({ language: lang, direction });
      },

      t: (key: string) => {
        const lang = get().language;
        const dict = translations[lang];
        return dict[key] || key;
      }
    }),
    'language_store',
    (state) => ({
      language: state.language,
      direction: state.direction
    })
  )
);
