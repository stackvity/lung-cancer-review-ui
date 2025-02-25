// app/IntlProviders.tsx
"use client";

import useLocale from "@/hooks/useLocale";
import { NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react"; // Import useEffect and useState

interface IntlProvidersProps {
  children: React.ReactNode;
}

export default function IntlProviders({ children }: IntlProvidersProps) {
  const locale = useLocale() || "en";
  const [messages, setMessages] = useState(null); // State to hold messages

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`/locales/${locale}/common.json`); // Fetch common.json - adjust path if needed
        if (!response.ok) {
          throw new Error(
            `Failed to load messages for locale ${locale}: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        setMessages(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error loading translations:", error.message);
        } else {
          console.error("Error loading translations:", error);
        }
        // Handle error appropriately, e.g., set a default message or display an error UI
      }
    };

    loadMessages();
  }, [locale]);

  // Render loading indicator while messages are loading
  if (!messages) {
    return <div>Loading translations...</div>; // Or a more sophisticated loading indicator
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
