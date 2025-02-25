// app/hooks/useAccessLink.ts
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient"; // Ensure correct path to apiClient

/**
 * @function useAccessLink
 * @description Custom hook for validating the access link against the backend API.
 * @param {string} linkId - The unique access link ID to validate.
 * @returns {object} - An object containing:
 *   - isValid: boolean | null -  True if the link is valid, false if invalid, null if still loading.
 *   - isLoading: boolean - True if the validation request is in progress.
 *   - error: string | null - Error message if validation fails.
 */
export const useAccessLink = (linkId: string) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkLink = async () => {
      if (!linkId) {
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null); // Clear any previous errors

      try {
        const response = await apiClient.get(`/auth/validate-link/${linkId}`); // API endpoint to validate link - adjust if needed

        if (!response.ok) {
          // Non-2xx response indicates invalid link
          setIsValid(false);
          const errorData = await response.json();
          setError(
            errorData?.detail ||
              `Link validation failed with status: ${response.status}`
          ); // Extract detail from error response if available
        } else {
          // 2xx response means link is valid
          setIsValid(true);
        }
      } catch (err: unknown) {
        // Network errors or errors during fetch
        console.error("Network error during link validation:", err);
        setIsValid(false);
        if (err instanceof Error) {
          setError(
            err.message || "Network error occurred while validating the link."
          );
        } else {
          setError("Network error occurred while validating the link.");
        }
      } finally {
        setIsLoading(false); // Set loading to false regardless of outcome
      }
    };

    checkLink();
  }, [linkId]); // Dependency array: effect runs when linkId changes

  return { isValid, isLoading, error };
};
