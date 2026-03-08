import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fr from './locales/fr.json';
import rn from './locales/rn.json';
import en from './locales/en.json';
import sw from './locales/sw.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'fr',
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        resources: {
            fr: { translation: fr },
            rn: { translation: rn },
            en: { translation: en },
            sw: { translation: sw },
        },
    });

export default i18n;
