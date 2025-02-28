// app/features/findings/types/findingTypes.ts

import { ImageAnnotation } from "@/types/api"; // Assuming ImageAnnotation type is defined in api.ts

export interface Finding {
  finding_id: string;
  file_id: string;
  finding_type: string;
  location?: string;
  description: string;
  image_annotations?: ImageAnnotation[];
  source: string;
  // ... other finding properties you might have ...
}
