/**
 * I18n Service
 * Internationalization service for multilingual support
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from '../locales/en/common.json';
import vi from '../locales/vi/common.json';
import zh from '../locales/zh/common.json';
import es from '../locales/es/common.json';
import ru from '../locales/ru/common.json';
import hi from '../locales/hi/common.json';
import fr from '../locales/fr/common.json';

const resources = {
  en: { common: en },
  vi: { common: vi },
  zh: { common: zh },
  es: { common: es },
  ru: { common: ru },
  hi: { common: hi },
  fr: { common: fr },
};

const FALLBACK_LANGUAGE = 'en';

export class I18nService {
  static async initialize(): Promise<void> {
    const locales = RNLocalize.getLocales();
    const deviceLanguage = locales[0]?.languageCode ?? FALLBACK_LANGUAGE;

    await i18n.use(initReactI18next).init({
      compatibilityJSON: 'v3',
      resources,
      lng: deviceLanguage,
      fallbackLng: FALLBACK_LANGUAGE,
      ns: ['common'],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
  }

  static changeLanguage(languageCode: string): Promise<any> {
    return i18n.changeLanguage(languageCode);
  }

  static getCurrentLanguage(): string {
    return i18n.language;
  }

  static getAvailableLanguages(): string[] {
    return Object.keys(resources);
  }

  static t(key: string, options?: any): string {
    return i18n.t(key, options);
  }
}

export default i18n;