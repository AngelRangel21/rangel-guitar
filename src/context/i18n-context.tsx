'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Translations = { [key: string]: string };

interface I18nContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, params?: { [key: string]: string | number }) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const languages: { [key: string]: () => Promise<{ default: Translations }> } = {
  es: () => import('@/locales/es.json'),
  en: () => import('@/locales/en.json'),
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState('es');
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    const storedLang = localStorage.getItem('language');
    if (storedLang && languages[storedLang]) {
      setLanguageState(storedLang);
    }
  }, []);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const module = await languages[language]();
        setTranslations(module.default);
        document.documentElement.lang = language;
      } catch (error) {
        console.error(`Could not load translations for ${language}`, error);
        // Fallback to default language if loading fails
        if (language !== 'es') {
          setLanguage('es');
        }
      }
    };
    loadTranslations();
  }, [language]);
  
  const setLanguage = (lang: string) => {
      if (languages[lang]) {
          setLanguageState(lang);
          localStorage.setItem('language', lang);
      }
  }

  const t = useCallback((key: string, params?: { [key:string]: string | number }): string => {
    let translation = translations[key] || key;
    if (params) {
        Object.keys(params).forEach(paramKey => {
            translation = translation.replace(`{${paramKey}}`, String(params[paramKey]));
        });
    }
    return translation;
  }, [translations]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
