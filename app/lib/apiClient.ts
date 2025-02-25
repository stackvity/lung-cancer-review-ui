// lib/apiClient.ts
/**
 * @module apiClient
 * @description Utility module for creating and configuring an API client using fetch.
 */

/**
 * @function apiClient
 * @description Creates and configures an API client for making requests to the backend.
 *              Uses the `fetch` API for making HTTP requests.
 * @param {string} baseURL - The base URL for the API. Defaults to the NEXT_PUBLIC_API_BASE_URL environment variable.
 * @returns {object} - An object containing methods for making API requests (get, post, put, delete).
 */
export const apiClient = {
  /**
   * @method get
   * @async
   * @description Makes a GET request to the specified API endpoint.
   * @param {string} endpoint - The API endpoint URL (relative to the baseURL).
   * @param {RequestInit} options - Optional fetch API options.
   * @returns {Promise<Response>} - Promise resolving to the fetch API response object.
   * @throws {Error} - Throws an error if the fetch API call fails.
   */
  get: async (endpoint: string, options?: RequestInit) => {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL; // Access base URL from environment variable
    const url = `${baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // You can add default headers here, e.g., authorization tokens
          ...options?.headers, // Merge with any specific headers passed in options
        },
        ...options, // Spread other options (e.g., body, mode, cache)
      });

      if (!response.ok) {
        // Handle HTTP errors (non-2xx responses)
        console.error(
          `API GET request failed for endpoint: ${endpoint}`,
          response
        );
        throw new Error(
          `API GET request failed with status ${response.status}: ${response.statusText}`
        );
      }

      return response; // Return the raw response object for the caller to handle data extraction
    } catch (error: unknown) {
      console.error(`Fetch error during GET request to ${endpoint}:`, error); // Log fetch errors
      if (error instanceof Error) {
        throw new Error(
          `Network error occurred while making GET request: ${error.message}`
        );
      } else {
        throw new Error("Network error occurred while making GET request");
      }
    }
  },

  /**
   * @method post
   * @async
   * @description Makes a POST request to the specified API endpoint.
   * @param {string} endpoint - The API endpoint URL (relative to the baseURL).
   * @param {any} data - The request body data (will be serialized to JSON).
   * @param {RequestInit} options - Optional fetch API options.
   * @returns {Promise<Response>} - Promise resolving to the fetch API response object.
   * @throws {Error} - Throws an error if the fetch API call fails.
   */
  post: async (endpoint: string, data: unknown, options?: RequestInit) => {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL; // Access base URL from environment variable
    const url = `${baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // You can add default headers here, e.g., authorization tokens
          ...options?.headers, // Merge with any specific headers passed in options
        },
        body: JSON.stringify(data), // Serialize data to JSON for POST requests
        ...options, // Spread other options
      });

      if (!response.ok) {
        // Handle HTTP errors (non-2xx responses)
        console.error(
          `API POST request failed for endpoint: ${endpoint}`,
          response
        );
        throw new Error(
          `API POST request failed with status ${response.status}: ${response.statusText}`
        );
      }

      return response;
    } catch (error: unknown) {
      console.error(`Fetch error during POST request to ${endpoint}:`, error); // Log fetch errors
      if (error instanceof Error) {
        throw new Error(
          `Network error occurred while making POST request: ${error.message}`
        ); // Throw a more user-friendly error
      } else {
        throw new Error("Network error occurred while making POST request");
      }
    }
  },

  // Add similar methods for PUT, DELETE, etc. as needed for your API
  // ... (PUT, DELETE methods would follow similar structure to GET and POST) ...
};
