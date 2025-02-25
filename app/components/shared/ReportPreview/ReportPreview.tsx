import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"; // Import icons

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface ReportPreviewProps {
  pdfUrl: string; // URL of the PDF report (or a Blob/ArrayBuffer)
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null); // Clear any previous error
  };

  const onDocumentLoadError = (error: Error) => {
    setLoading(false);
    console.error("PDF loading error:", error);
    setError(
      "Failed to load the PDF report. Please try again later, or contact support if the issue persists."
    ); // User-friendly error
  };

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (numPages && pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {loading && <p>Loading PDF...</p>}
      {error && <div className="text-red-500">{error}</div>}

      {!loading && !error && (
        <>
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<p>Loading PDF...</p>}
          >
            <Page
              pageNumber={pageNumber}
              loading={<p>Loading page...</p>}
              // width and height for better rendering.
              width={800}
              height={1100}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>

          <div className="flex items-center space-x-4 mt-4">
            <Button
              variant="secondary"
              disabled={pageNumber <= 1}
              onClick={goToPrevPage}
            >
              <ChevronLeftIcon className="h-4 w-4" /> Previous
            </Button>
            <p>
              Page {pageNumber} of {numPages}
            </p>
            <Button
              variant="secondary"
              disabled={numPages === null || pageNumber >= numPages}
              onClick={goToNextPage}
            >
              Next <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportPreview;
