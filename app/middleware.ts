// app/middleware.ts
import createMiddleware from "next-intl/middleware";
import { lngLocales } from "../public/locales/lng-locales"; // Import lngLocales

export default createMiddleware({
  // A list of all locales that are supported
  locales: lngLocales.map((locale) => locale.lng), // Use lngLocales array for locales
  // Used when no locale matches
  defaultLocale: "en",
  localeDetection: true, // enable locale detection by setting it to true
});

export const config = {
  // Skip all paths that aren't pages and api routes.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
