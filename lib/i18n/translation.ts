import en from "@/constant/language/en.json";
import vi from "@/constant/language/vi.json";

const translations = { en, vi };

type Locale = keyof typeof translations;
type NestedKeys<T> = T extends object
  ? {
      [K in Extract<keyof T, string>]:
        T[K] extends object ? `${K}` | `${K}.${NestedKeys<T[K]>}` : `${K}`;
    }[Extract<keyof T, string>]
  : never;

type TranslationKeys = NestedKeys<typeof en>;

export const getTranslation = (
  locale: Locale,
  key: TranslationKeys,
  params?: Record<string, string>
): string => {
  const keys = key.split(".");
  let translation: any = translations[locale];

  for (const k of keys) {
    if (!translation || !(k in translation)) {
      console.warn(`Translation key "${key}" not found for locale "${locale}".`);
      return key; // Fallback to key if translation is missing
    }
    translation = translation[k];
  }

  if (params) {
    return Object.keys(params).reduce(
      (str, param) => str.replace(`{${param}}`, params[param]),
      translation
    );
  }

  return translation;
};

export type { Locale, TranslationKeys };
