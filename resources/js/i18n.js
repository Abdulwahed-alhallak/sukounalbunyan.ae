import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const customBackend = {
  type: 'backend',
  init: function(services, backendOptions) {
    this.services = services;
    this.options = backendOptions;
  },
  read: function(language, namespace, callback) {
    const loadPath = window.route ? window.route('languages.translations', language) : `/translations/${language}`;
    
    fetch(loadPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        // Atomic Direction Sync
        const dir = data.layoutDirection || (['ar', 'fa', 'he'].includes(language) ? 'rtl' : 'ltr');
        document.documentElement.dir = dir;
        document.body.dir = dir;
        document.documentElement.lang = language;
        
        callback(null, data.translations);
      })
      .catch(error => callback(error, null));
  }
};

i18n
    .use(LanguageDetector)
    .use(customBackend)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        detection: {
            order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage', 'cookie'],
        },
        interpolation: {
            escapeValue: false,
        },
        showSupportNotice: false
    });

export default i18n;
