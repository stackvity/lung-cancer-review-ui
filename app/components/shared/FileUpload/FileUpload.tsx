import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress"; // shadcn/ui Progress
import { XIcon } from "lucide-react"; // Import X icon
import { useTranslation } from "next-i18next";
import { useMutation } from "@tanstack/react-query"; // Import useMutation
import { uploadFiles } from "@/dashboard/features/upload/services/uploadService";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

import { UploadResponseData } from "@/types/api";

interface FileUploadProps {
  onFilesUploaded: (files: File[]) => void; // Callback for successful upload
  maxFileSize?: number; // Optional: Max file size in bytes (default: 50MB)
  allowedFileTypes?: string[]; // Optional: Allowed MIME types (default: DICOM, PDF, JPEG, PNG, CSV)
  onError?: (error: string) => void; // Optional: Callback for error handling
  className?: string; // Optional: Prop to extend/override container class
}

interface UploadedFile {
  name: string;
  progress: number;
  error?: string; // Add an optional error field
  file?: File; // Store the original File object
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesUploaded,
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/dicom", // Custom MIME type needed
    "text/csv",
  ],
  onError,
  className,
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null); // General upload error
  const { t } = useTranslation("common");

  const { mutate } = useMutation<UploadResponseData, Error, FormData>({
    mutationFn: uploadFiles,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setUploadError(null); // Clear any previous general error

      // Handle file rejections (too large, wrong type)
      fileRejections.forEach((rejection: FileRejection) => {
        rejection.errors.forEach((error: { code: string; message: string }) => {
          if (error.code === "file-too-large") {
            toast.error(
              t("upload.file_too_large", { fileName: rejection.file.name })
            );
          } else if (error.code === "file-invalid-type") {
            toast.error(
              t("upload.file_invalid_type", { fileName: rejection.file.name })
            );
          } else {
            toast.error(
              t("upload.upload_failed_error", {
                fileName: rejection.file.name,
                message: error.message,
              })
            );
          }
        });
      });

      const newFiles = acceptedFiles.map((file) => ({
        name: file.name,
        progress: 0,
        file: file, // Store the original File object
      }));
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);

      newFiles.forEach((file, index) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress > 100) {
            clearInterval(interval);
            // Simulate API call completion - replace with actual API call using mutate
            setTimeout(() => {
              const formData = new FormData();
              formData.append("file", file.file);
              mutate(
                formData, // Pass a FormData object to the mutation function
                {
                  onSuccess: (data) => {
                    // Handle successful upload (e.g., update UI, show message)
                    toast.success(
                      t("upload.upload_success", { fileName: file.name })
                    );
                    // Update the file object with any data from the backend (if needed)
                    setFiles((prevFiles) => {
                      const fileIndex =
                        prevFiles.length - newFiles.length + index;
                      if (fileIndex < 0 || fileIndex >= prevFiles.length) {
                        return prevFiles; // Safety check
                      }
                      const updatedFiles = [...prevFiles];
                      updatedFiles[fileIndex] = {
                        ...updatedFiles[fileIndex],
                        ...data,
                      };
                      return updatedFiles;
                    });
                    onFilesUploaded(acceptedFiles);
                  },
                  onError: (error: Error) => {
                    // Handle upload error (e.g., update UI, show message)
                    setFiles((prevFiles) => {
                      const fileIndex =
                        prevFiles.length - newFiles.length + index;
                      if (fileIndex < 0 || fileIndex >= prevFiles.length) {
                        return prevFiles;
                      }
                      const updatedFiles = [...prevFiles];
                      updatedFiles[fileIndex] = {
                        ...updatedFiles[fileIndex],
                        error: error.message || "Upload failed",
                      };
                      if (onError) {
                        onError(error.message || "Upload failed"); // Call custom error callback
                      }
                      return updatedFiles;
                    });
                    toast.error(
                      t("upload.upload_error", {
                        fileName: file.name,
                        message: error.message || "Unknown error",
                      })
                    );
                  },
                }
              );
            }, 500); // Simulate server processing time - replace with actual API call
          }
          setFiles((prevFiles) => {
            const fileIndex = prevFiles.length - newFiles.length + index;
            if (fileIndex < 0 || fileIndex >= prevFiles.length) {
              return prevFiles; // Safety check
            }
            const updatedFiles = [...prevFiles];
            updatedFiles[fileIndex] = { ...updatedFiles[fileIndex], progress };
            return updatedFiles;
          });
        }, 100);
      });
    },
    [mutate, onFilesUploaded, onError, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: maxFileSize,
    accept: allowedFileTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as { [key: string]: string[] }),
  });

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleDisclaimerChange = (checked: boolean) => {
    setDisclaimerChecked(checked);
  };

  const handleSubmit = () => {
    // Process uploaded files
    if (files.length > 0) {
      const uploadedFiles = files
        .filter((f) => f.file && !f.error)
        .map((f) => f.file as File);
      onFilesUploaded(uploadedFiles);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-h4">{t("upload.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {t("upload.instructions")}
        </p>
        <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
          <li>{t("upload.cxr")}</li>
          <li>{t("upload.ct")}</li>
          <li>{t("upload.petct")}</li>
          <li>{t("upload.pathology")}</li>
          <li>{t("upload.radiology")}</li>
          <li>{t("upload.lab")}</li>
        </ul>

        <div
          {...getRootProps()}
          className={`mt-4 p-4 border-dashed border-2 rounded-md cursor-pointer transition-colors
            ${isDragActive ? "border-primary bg-primary/10" : "border-border"}
                focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2`}
        >
          <input {...getInputProps()} aria-label={t("upload.dragOrClick")} />
          <p className="text-center">
            {isDragActive ? t("upload.dropHere") : t("upload.dragOrClick")}
          </p>
        </div>

        <p className="text-sm text-muted-foreground mt-2">
          {t("upload.allowedTypes")}
        </p>
        <p className="text-sm text-muted-foreground">{t("upload.maxSize")}</p>

        {/* Display general upload error */}
        {uploadError && (
          <div className="text-red-500 mt-2" role="alert">
            {uploadError}
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-4">
            <h5 className="text-lg font-medium">{t("upload.uploadedFiles")}</h5>
            <ul>
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between mt-2"
                >
                  <span>{file.name}</span>
                  {file.error ? (
                    <span className="text-red-500" role="alert">
                      {file.error}
                    </span>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Progress value={file.progress} className="w-[150px]" />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                        aria-label={`${t("upload.remove")} ${file.name}`}
                      >
                        <XIcon className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4">
          <Checkbox
            id="disclaimer"
            checked={disclaimerChecked}
            onCheckedChange={handleDisclaimerChange}
            aria-label={t("upload.disclaimer")}
          />
          <Label htmlFor="disclaimer" className="ml-2">
            {t("upload.disclaimer")}
          </Label>
        </div>
        <Button
          disabled={!disclaimerChecked}
          className="mt-4 w-full"
          onClick={() => handleSubmit()}
        >
          {t("common.next")}
        </Button>
      </CardContent>
    </Card>
  );
};
export default FileUpload;
