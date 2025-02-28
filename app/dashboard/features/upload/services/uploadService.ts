// app/features/upload/services/uploadService.ts
import { apiClient } from "@/lib/apiClient"; // Adjust path to apiClient if necessary
import { UploadResponseData } from "@/types/api"; // Adjust path to types/api.ts if necessary

/**
 * @function processDocuments
 * @async
 * @description Processes document upload to the backend.
 * @param {FormData} formData - Form data containing files and linkId.
 * @returns {Promise<UploadResponseData>} - Promise resolving to the API response data.
 * @throws {Error} - Throws an error if the API call fails.
 */
export const processDocuments = async (
  formData: FormData
): Promise<UploadResponseData> => {
  try {
    const response = await apiClient.post("/upload", formData, {
      // Adjust endpoint if necessary
      headers: {
        "Content-Type": "multipart/form-data", // Correct Content-Type for FormData
        // 'X-Access-Link' header will be handled by the API gateway / middleware
      },
    });

    if (!response.ok) {
      // Handle non-2xx responses (error statuses)
      const errorDetail = await response.json(); // Assuming error response is JSON
      console.error("Upload API error:", errorDetail);
      throw new Error(
        `Upload failed: ${response.status} - ${
          errorDetail.message || response.statusText
        }`
      );
    }

    const data = await response.json(); // Assuming success response is also JSON
    return data as UploadResponseData;
  } catch (error: unknown) {
    // Handle network errors or errors during json parsing
    console.error("Error processing upload request:", error);
    throw new Error(
      `Failed to process upload: ${
        error instanceof Error ? error.message : "Network error"
      }`
    );
  }
};
