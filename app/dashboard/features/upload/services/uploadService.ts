// app/dashboard/features/upload/services/uploadService.ts  <- Adjusted file path to align with incorrect import

import { apiClient } from "../../../../lib/apiClient"; // Adjusted import path for apiClient
import { UploadResponseData } from "../../../../types/api"; // Adjusted import path for types

/**
 * @function processDocuments
 * @async
 * @description Processes document upload to the backend.
 * @param {FormData} formData - Form data containing files and linkId.
 * @returns {Promise<UploadResponseData>} - Promise resolving to the API response data.
 * @throws {Error} - Throws an error if the API call fails, including specific error messages based on HTTP status codes.
 */
export const uploadFiles = async (
  // Renamed to uploadFiles to align with FileUpload.tsx import
  formData: FormData
): Promise<UploadResponseData> => {
  try {
    const response = await apiClient.post("/upload", formData, {
      // Assuming "/upload" is still the correct API endpoint
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.ok) {
      let message = "Document processing failed"; // Default error message
      const errorData = await response.json();
      if (response.status === 400) {
        message =
          errorData?.detail ||
          "Invalid request data. Please check your inputs.";
      } else if (response.status === 413) {
        message =
          errorData?.detail || "Payload too large. Please reduce file sizes.";
      } else if (response.status === 500) {
        message =
          errorData?.detail ||
          "Internal server error during document processing.";
      }
      console.error("API Error in processDocuments:", errorData); // Log detailed error response
      throw new Error(message);
    }

    const data = await response.json();
    return data as UploadResponseData;
  } catch (error: unknown) {
    console.error("Error in processDocuments:", error); // Catch network errors or errors during JSON parsing
    if (error instanceof Error) {
      throw new Error(
        error.message ||
          "Document processing failed due to an unexpected error."
      );
    } else {
      throw new Error("Document processing failed due to an unexpected error.");
    }
  }
};
