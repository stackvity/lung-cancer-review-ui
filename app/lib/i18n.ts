// lib/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n

  .use(Backend)

  .use(LanguageDetector)

  .use(initReactI18next)

  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "id"],
    debug: process.env.NEXT_PUBLIC_I18NEXT_DEBUG === "true",
    defaultNS: "common",
    ns: ["common", "upload", "dashboard"],
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
