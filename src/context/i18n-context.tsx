'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Define el tipo para un objeto de traducciones.
type Translations = { [key: string]: string };

// Define la forma del contexto de internacionalización (i18n).
interface I18nContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, params?: { [key: string]: string | number }) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Objeto que mapea los códigos de idioma a funciones de importación dinámica para los archivos JSON de traducción.
const languages: { [key: string]: () => Promise<{ default: Translations }> } = {
  es: () => import('@/locales/es.json'),
  en: () => import('@/locales/en.json'),
};

/**
 * Proveedor de contexto para la internacionalización.
 * Maneja el estado del idioma actual y carga las traducciones correspondientes.
 * @param {{ children: ReactNode }} props - Los componentes hijos que consumirán el contexto.
 * @returns {JSX.Element} El proveedor de contexto.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState('es'); // Idioma por defecto: español.
  const [translations, setTranslations] = useState<Translations>({});

  // Efecto para cargar el idioma guardado en localStorage al iniciar la aplicación.
  useEffect(() => {
    const storedLang = localStorage.getItem('language');
    if (storedLang && languages[storedLang]) {
      setLanguageState(storedLang);
    }
  }, []);

  // Efecto para cargar el archivo de traducciones cuando el idioma cambia.
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const module = await languages[language]();
        setTranslations(module.default);
        document.documentElement.lang = language; // Actualiza el atributo `lang` del HTML.
      } catch (error) {
        console.error(`Could not load translations for ${language}`, error);
        // Si falla la carga, vuelve al idioma por defecto (español).
        if (language !== 'es') {
          setLanguage('es');
        }
      }
    };
    loadTranslations();
  }, [language]);
  
  /**
   * Función para cambiar el idioma actual de la aplicación.
   * @param {string} lang - El código del nuevo idioma (ej. 'es', 'en').
   */
  const setLanguage = (lang: string) => {
      if (languages[lang]) {
          setLanguageState(lang);
          localStorage.setItem('language', lang); // Guarda la preferencia en localStorage.
      }
  }

  /**
   * Función de traducción.
   * Busca una clave en el archivo de traducciones y la devuelve.
   * Si no la encuentra, devuelve la clave misma.
   * Permite interpolar parámetros en la cadena de traducción.
   * @param {string} key - La clave de la traducción.
   * @param {object} [params] - Parámetros para reemplazar en la cadena (ej. { name: 'Mundo' }).
   * @returns {string} La cadena traducida.
   */
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

/**
 * Hook personalizado para acceder al contexto de internacionalización.
 * @returns {I18nContextType} - El valor del contexto de i18n.
 */
export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
