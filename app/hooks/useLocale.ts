// app/hooks/useLocale.ts
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * @function useLocale
 * @description Custom hook to manage and get the current locale.
 *              In a real application, this might fetch the locale from user preferences,
 *              browser settings, or a more robust locale detection mechanism.
 *              For this example, it defaults to 'en' and allows setting via search param for demonstration.
 * @returns {string} The current locale (e.g., 'en', 'id').
 */
const useLocale = (): string => {
  // Removed unused `router` to eliminate compilation error.
  const searchParams = useSearchParams();

  // Example: Get locale from search params or default to 'en'
  let initialLocale = searchParams.get("lng") || "en";

  // Simple validation to ensure locale is supported (en, id for this example)
  if (!["en", "id"].includes(initialLocale)) {
    initialLocale = "en"; // Default to 'en' if invalid locale
  }

  const [locale, setLocale] = useState<string>(initialLocale);

  useEffect(() => {
    // Update locale state if searchParams change (e.g., user manually changes lng param)
    const newLocale = searchParams.get("lng") || "en";
    if (!["en", "id"].includes(newLocale)) {
      return; // Do not update if invalid locale
    }
    setLocale(newLocale);
  }, [searchParams]);

  return locale;
};

export default useLocale;
