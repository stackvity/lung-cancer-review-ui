// app/layouts/AccessLinkGuard.tsx
"use client";

import React from "react";
import { useAccessLink } from "@/hooks/useAccessLink"; // Ensure correct path to useAccessLink hook
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import from alert.tsx
import { AlertCircle, Loader2 } from "lucide-react"; // Ensure lucide-react is installed
import { useTranslations } from "next-intl"; // For internationalization

interface AccessLinkGuardProps {
  children: React.ReactNode;
  linkId: string | undefined;
}

/**
 * @component AccessLinkGuard
 * @description A layout component that checks if the access link is valid before rendering its children.
 *              Displays loading or error states if the link is being validated or is invalid.
 * @param {AccessLinkGuardProps} props - Component props including children and linkId.
 * @returns {JSX.Element} - Returns either loading/error UI or children if the link is valid.
 */
const AccessLinkGuard: React.FC<AccessLinkGuardProps> = ({
  children,
  linkId,
}) => {
  const { isValid, isLoading, error: linkError } = useAccessLink(linkId || "");
  const t = useTranslations("dashboard"); // Assuming you want to use dashboard translations here as well

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {" "}
        {/* Full height loading screen */}
        <Loader2 className="animate-spin text-gray-600 h-8 w-8" />
      </div>
    );
  }

  if (linkError || !isValid) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("access_link_invalid")}</AlertTitle>
        <AlertDescription>{t("access_link_expired_message")}</AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>; // Render children if link is valid
};

export default AccessLinkGuard;
