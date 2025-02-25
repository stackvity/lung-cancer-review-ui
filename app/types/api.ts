// app/types/api.ts

// Define types for API requests and responses

export interface UploadRequestData {
  linkId: string;
  files: File[];
}

export interface UploadResponseData {
  message: string;
  uploadId: string; // Or the actual field name from your API response
  // ... any other fields from a successful upload response
}

export interface FindingsResponseData {
  findings: Finding[]; // Assuming you define a Finding interface as well
  // ... other fields in the findings response
}

export interface ReportResponseData {
  reportUrl: string;
  // ... other fields in the report response if any
}

// Example Finding type - adjust to match your actual data structure
export interface Finding {
  finding_id: string;
  file_id: string;
  finding_type: string;
  location?: string;
  description: string;
  image_annotations?: ImageAnnotation[]; // Example of nested type - adjust as needed
  source: string;
  // ... other finding properties
}

// Example ImageAnnotation type - adjust to match your actual data structure
export interface ImageAnnotation {
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  // ... other annotation properties
}

// Define a generic Error response type based on ProblemDetail schema from api-contract.md
export interface ApiErrorResponse {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  "invalid-params"?: InvalidParam[];
}

interface InvalidParam {
  name: string;
  reason: string;
}

// ... other API type definitions as needed ...
