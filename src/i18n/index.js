import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

const saved = localStorage.getItem("lang");
const browser = navigator.language?.split("-")[0] || "en";
const supported = ["en", "fr"];
const lng = saved || (supported.includes(browser) ? browser : "en");

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  react: {
    useSuspense: false, // ← Évite les crashes avec Suspense
  },
});

i18n.on("languageChanged", (lang) => {
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang; // Met à jour le HTML lang attribute
});

export default i18n;