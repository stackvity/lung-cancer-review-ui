// app/features/findings/services/findingsService.ts
import { apiClient } from "../../../../lib/apiClient";
import { FindingsResponseData } from "../../../../types/api"; // Importing API types

/**
 * @function getFindings
 * @async
 * @description Fetches findings data from the backend.
 * @param {string} linkId - Unique access link ID.
 * @returns {Promise<FindingsResponseData>} - Promise resolving to findings data.
 * @throws {Error} - Throws an error if the API call fails, including specific error messages based on HTTP status codes.
 */
export const getFindings = async (
  linkId: string
): Promise<FindingsResponseData> => {
  try {
    const response = await apiClient.get(`/findings/${linkId}`); // Adjust API endpoint as needed

    if (!response.ok) {
      let message = "Failed to fetch findings data"; // Default error message
      const errorData = await response.json();
      if (response.status === 404) {
        message =
          errorData?.detail ||
          "Findings not found. Please ensure documents are uploaded and processed.";
      } else if (response.status === 500) {
        message =
          errorData?.detail || "Internal server error while fetching findings.";
      }
      console.error("API Error in getFindings:", errorData); // Log detailed error response
      throw new Error(message);
    }

    const data = await response.json();
    return data as FindingsResponseData;
  } catch (error: unknown) {
    console.error("Error in getFindings:", error);
    let errorMessage =
      "Failed to fetch findings data due to an unexpected error.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
};
