// app/features/report/services/reportService.ts
// import { apiClient } from "@/lib/apiClient";
import { apiClient } from "../../../../lib/apiClient";
import { ReportResponseData } from "../../../../types/api"; // Importing API types

/**
 * @function getReportUrl
 * @async
 * @description Fetches report URL from the backend.
 * @param {string} linkId - Unique access link ID.
 * @returns {Promise<ReportResponseData>} - Promise resolving to report URL.
 * @throws {Error} - Throws an error if API call fails, including specific error messages based on HTTP status codes.
 */
export const getReportUrl = async (
  linkId: string
): Promise<ReportResponseData> => {
  try {
    const response = await apiClient.get(`/report/${linkId}`); // Adjust API endpoint as needed

    if (!response.ok) {
      let message = "Failed to fetch report URL"; // Default error message
      const errorData = await response.json();
      if (response.status === 404) {
        message =
          errorData?.detail ||
          "Report not found. Please ensure report generation was successful.";
      } else if (response.status === 500) {
        message =
          errorData?.detail ||
          "Internal server error while fetching report URL.";
      }
      console.error("API Error in getReportUrl:", errorData); // Log detailed error response
      throw new Error(message);
    }

    const data = await response.json();
    return data as ReportResponseData;
  } catch (error: unknown) {
    console.error("API Error in getReportUrl:", error);
    if (error instanceof Error) {
      throw new Error(
        error.message || "Failed to fetch report URL due to an unexpected error"
      );
    } else {
      throw new Error("Failed to fetch report URL due to an unexpected error");
    }
  }
};
