'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import AccessLinkGuard from '@/components/layouts/AccessLinkGuard';
// import FileUpload from '@/components/shared/FileUpload/FileUpload'; // Corrected import path
// import ImageViewer from '@/components/shared/ImageViewer/ImageViewer'; // Corrected import path
// import FindingsSummary from '@/components/shared/FindingsSummary/FindingsSummary'; // Corrected import path
// import ReportPreview from '@/components/shared/ReportPreview/ReportPreview'; // Corrected import path
// import Disclaimer from '@/components/ui/Disclaimer/Disclaimer'; // Corrected import path
// import ExternalResources from '@/components/shared/ExternalResources/ExternalResources'; // Corrected import path
import { Button } from "@/components/ui/button" // Corrected import path
import { useAccessLink } from '@/hooks/useAccessLink';
import { useMutation, useQuery } from '@tanstack/react-query';
import { processDocuments } from '@/dashboard/features/upload/services/uploadService'; // Corrected import path
import { getFindings } from '@/dashboard/features/findings/services/findingsService'; // Corrected import path
import { getReportUrl } from '@/dashboard/features/report/services/reportService'; // Corrected import path
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" // Corrected import path
import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from 'react-hot-toast';
import { FindingsResponseData, ReportResponseData } from '@/types/api';


/**
 * @component DashboardPage
 * @description Dynamic route for patient dashboard with unique access link.
 *              Handles secure access, data display, and report generation.
 * @returns {JSX.Element} The DashboardPage component.
 */
const DashboardPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;
  const linkId = Array.isArray(slug) ? slug[0] : slug;

  const { isValid, isLoading: isLinkLoading, error: linkError } = useAccessLink(linkId || ''); // Using implemented useAccessLink
  const { t } = useTranslations('dashboard');
  const common_t = useTranslations('common');
  const { mutate: process, isPending: isProcessing } = useMutation({
    mutationFn: processDocuments
  });
  const { data: findingsData, isLoading: isLoadingFindings, error: findingsError, refetch } = useQuery({
    queryKey: ['findings', linkId],
    queryFn: () => getFindings(linkId || ''),
    enabled: false,
    retry: false,
  });

  const { data: reportUrl, isLoading: isLoadingReport, error: reportError, refetch : refetchReportUrl } = useQuery<ReportResponseData, Error>(
    ['reportUrl', linkId],
    () => getReportUrl(linkId || ''),
    {
      enabled: false,
      retry: false,
    }
  );

  /**
   * @function handleFilesUploaded
   * @description Handles successful file upload, initiates document processing, and refetches data.
   * @async
   * @param {File[]} newFiles - Array of uploaded files.
   * @returns {Promise<void>}
   */
  const handleFilesUploaded = async (newFiles: File[]) => {
    if (linkId) {
      const formData = new FormData();
      newFiles.forEach((file) => formData.append('files', file));
      formData.append('linkId', linkId);

      try {
        await process(formData);
        toast.success(common_t('success'));
        await refetch();
        await refetchReportUrl();
      } catch (error: any) {
        console.error("Error processing documents:", error);
        toast.error(`${common_t('error')} : ${error?.message || common_t('an_error_occurred')}`);
      }

    } else {
      console.error("linkId is undefined, cannot proceed with processing.");
      toast.error(common_t('an_error_occurred'));
    }
  };

  if (isLinkLoading) {
    return <div>{common_t('loading')}</div>;
  }

  if (linkError || !isValid) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('access_link_invalid')}</AlertTitle>
        <AlertDescription>
          {t('access_link_expired_message')}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <AccessLinkGuard>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>

        <Disclaimer />

        {!findingsData && (
          <FileUpload onFilesUploaded={handleFilesUploaded} />
        )}

        {isProcessing && (
          <div className="flex items-center justify-center w-full h-full bg-gray-200">
            <Loader2 className="animate-spin text-gray-600 h-8 w-8" />
          </div>
        )}

        {(findingsError) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{common_t('error')}</AlertTitle>
            <AlertDescription>
              {findingsError.message}
            </AlertDescription>
          </Alert>
        )}
        {(reportError) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{common_t('error')}</AlertTitle>
            <AlertDescription>
              {reportError.message}
            </AlertDescription>
          </Alert>
        )}

        {findingsData && (
          <>
            <FindingsSummary findings={findingsData} />
            {findingsData.filter(finding => finding.file_id && finding.finding_type === 'potential nodule').map((finding) => (
              <ImageViewer key={finding.finding_id} imageUrl={`/api/backend/images/${finding.file_id}`} /> {/* Updated API endpoint */}
            ))}

            {reportUrl && (
              <>
                <ReportPreview pdfUrl={reportUrl} />
                <Button variant="outline"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.open(reportUrl, '_blank');
                    }
                  }}
                  className="mt-4"
                >
                  {t('download_report_button')}
                </Button>
              </>
            )}
          </>
        )}
        <ExternalResources />
      </div>
    </AccessLinkGuard>
  );
};

export default DashboardPage;