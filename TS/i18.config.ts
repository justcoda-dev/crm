import LOCALES from "../constants/i18n";
export default defineI18nConfig(() => ({
  legacy: false,
  globalInjection: true,
  locale: LOCALES.DEFAULT,
  fallbackLocale: LOCALES.FALLBACK,
  messages: LOCALES.FILES,
}));
