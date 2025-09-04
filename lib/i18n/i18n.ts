import { cookies } from "next/headers";
import { getTranslation, Locale, TranslationKeys } from "./translation";

export const serverI18n = async () => {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("lang")?.value || "en") as Locale;

  return {
    locale,
    t: (key: TranslationKeys, params?: Record<string, string>) =>
      getTranslation(locale, key, params),
  };
};
