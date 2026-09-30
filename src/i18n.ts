import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import pt from '../locales/pt.json';
import type { Locale } from './domain/types';

const STORAGE_KEY = 'ct-locale';

function initialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'fr' || saved === 'pt') return saved;
  } catch {
    /* storage unavailable */
  }
  const nav = (navigator.language || 'fr').slice(0, 2);
  return nav === 'en' || nav === 'pt' ? nav : 'fr';
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, fr: { translation: fr }, pt: { translation: pt } },
  lng: initialLocale(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export function setLocale(locale: Locale) {
  void i18n.changeLanguage(locale);
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* storage unavailable */
  }
  document.documentElement.lang = locale === 'pt' ? 'pt-PT' : locale;
}

export function useLocale(): Locale {
  const { i18n: inst } = useTranslation();
  const l = inst.language.slice(0, 2);
  return l === 'en' || l === 'pt' ? l : 'fr';
}

export default i18n;
