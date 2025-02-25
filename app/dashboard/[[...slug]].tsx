"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AccessLinkGuard from "@/components/layouts/AccessLinkGuard";
import FileUpload from "@/components/shared/FileUpload";
import ImageViewer from "@/components/shared/ImageViewer";
import FindingsSummary from "@/components/shared/FindingsSummary";
import ReportPreview from "@/components/shared/ReportPreview/ReportPreview"; // Corrected import path
import Disclaimer from "@/components/ui/Disclaimer";
import ExternalResources from "@/components/shared/ExternalResources";
import { Button } from "@/components/ui/button";
import { useAccessLink } from "@/hooks/useAccessLink";
import { useMutation, useQuery } from "@tanstack/react-query";
import { processDocuments } from "@/features/upload/services/uploadService";
import { getFindings } from "@/features/findings/services/findingsService";
import { getReportUrl } from "@/features/report/services/reportService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";
import ErrorBoundary from "@/components/shared/ErrorBoundary"; // Import ErrorBoundary

/**
 * @component DashboardPage
 * @description Main dashboard page component for patients, displaying AI analysis results.
 *              It handles secure access via access links, document upload, displays findings,
 *              report preview, and integrates various UI components.
 * @returns {JSX.Element} - Dashboard page UI.
 */
const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [files, setFiles] = useState<File[]>([]);
  const linkId = Array.isArray(slug) ? slug[0] : slug;

  const {
    isValid,
    isLoading: isLinkLoading,
    error: linkError,
  } = useAccessLink(linkId || "");
  const { mutate: process, isLoading: isProcessing } =
    useMutation(processDocuments);
  const {
    data: findingsData,
    isLoading: isLoadingFindings,
    error: findingsError,
    refetch,
  } = useQuery(["findings", linkId], () => getFindings(linkId || ""), {
    enabled: false,
    retry: false,
  });

  const {
    data: reportUrl,
    isLoading: isLoadingReport,
    error: reportError,
    refetch: refetchReportUrl,
  } = useQuery(["reportUrl", linkId], () => getReportUrl(linkId || ""), {
    enabled: false,
    retry: false,
  });

  const t = useTranslations("dashboard");

  /**
   * @function handleFilesUploaded
   * @description Handles file upload submission, processes documents via backend API,
   *              and updates the UI with processing status and results.
   * @param {File[]} newFiles - Array of files uploaded by the user.
   */
  const handleFilesUploaded = useCallback(
    async (newFiles: File[]) => {
      // Use useCallback
      setFiles(newFiles);
      if (linkId) {
        const formData = new FormData();
        newFiles.forEach((file) => formData.append("files", file));
        formData.append("linkId", linkId);
        try {
          await process(formData, {
            onSuccess: () => {
              refetch();
              refetchReportUrl();
              toast.success(t("common.success"), {
                description: t("dashboard.processing_documents"),
              }); // More informative success toast
            },
            onError: (error: any) => {
              console.error(
                "Error processing documents for linkId:",
                linkId,
                error
              ); // More detailed error logging
              toast.error(
                `${t("common.error")}: ${
                  error.message || t("upload.upload_failed")
                }`
              );
            },
          });
        } catch (error: any) {
          // Explicitly type error as any for catch block
          console.error(
            "Unexpected error in handleFilesUploaded for linkId:",
            linkId,
            error
          ); // Even more detailed logging for unexpected errors
          toast.error(`${t("common.error")}: ${t("common.an_error_occurred")}`);
        }
      } else {
        console.error("linkId is undefined, cannot proceed with processing.");
        toast.error(
          `${t("common.error")}: ${t("dashboard.access_link_invalid")}`
        ); // User-friendly error for missing linkId
      }
    },
    [linkId, process, refetch, refetchReportUrl, t]
  ); // Dependencies for useCallback

  if (isLinkLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2
          className="animate-spin text-gray-600 h-8 w-8"
          aria-label={t("common.loading")}
        />
        {/* Added aria-label for accessibility */}
      </div>
    );
  }

  if (linkError || !isValid) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" aria-hidden="true" />
        {/* aria-hidden for decorative icon */}
        <AlertTitle>{t("access_link_invalid")}</AlertTitle>
        <AlertDescription>{t("access_link_expired_message")}</AlertDescription>
      </Alert>
    );
  }

  return (
    <AccessLinkGuard linkId={linkId}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>

        <Disclaimer />

        {/* File Upload Section */}
        {!findingsData && <FileUpload onFilesUploaded={handleFilesUploaded} />}

        {/* Processing Spinner */}
        {isProcessing && (
          <div className="flex items-center justify-center w-full h-full bg-gray-200">
            <Loader2
              className="animate-spin text-gray-600 h-8 w-8"
              aria-label={t("common.loading")}
            />{" "}
            {/* Added aria-label for accessibility */}
          </div>
        )}

        {/* Display errors */}
        {findingsError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            {/* aria-hidden for decorative icon */}
            <AlertTitle>{t("common.error")}</AlertTitle>
            <AlertDescription>{findingsError.message}</AlertDescription>
          </Alert>
        )}
        {reportError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            {/* aria-hidden for decorative icon */}
            <AlertTitle>{t("common.error")}</AlertTitle>
            <AlertDescription>{reportError.message}</AlertDescription>
          </Alert>
        )}

        {/* Findings and Report Section - Wrapped with ErrorBoundary */}
        {findingsData && (
          <ErrorBoundary
            fallbackContent={
              <Alert variant="destructive">
                {t("common.error")}: {t("dashboard.ai_unavailable_contingency")}
              </Alert>
            }
          >
            {" "}
            {/* ErrorBoundary */}
            <>
              <FindingsSummary findings={findingsData} />
              {findingsData
                .filter(
                  (finding) =>
                    finding.file_id &&
                    finding.finding_type === "potential nodule"
                )
                .map((finding) => (
                  <ImageViewer
                    key={finding.finding_id}
                    imageUrl={`/api/images/${finding.file_id}`}
                    // Consider lazy loading images in ImageViewer for performance optimization
                  />
                ))}

              {reportUrl && (
                <>
                  <ReportPreview pdfUrl={reportUrl} />
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.open(reportUrl, "_blank");
                      }
                    }}
                    className="mt-4"
                  >
                    {t("download_report_button")}
                  </Button>
                </>
              )}
            </>
          </ErrorBoundary>
        )}
        <ExternalResources />
      </div>
    </AccessLinkGuard>
  );
};

export default DashboardPage;
