import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import api from './api';

export const loadTranslations = async (lang) => {
    try {

    const res = await api.get(`/translations/${lang}`);
    i18n.addResourceBundle(lang, 'translation', res.data, true, true);
    i18n.changeLanguage(lang);
    } catch (error) {
        console.error("Error loading translations:", error);
    }
};

i18n.use(initReactI18next).init({
    resources: {},
    lng: 'sv',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    }
}).then(() => {
    loadTranslations('sv');
});

export default i18n;