// app/components/shared/ImageViewer/useImageViewer.ts

import { useState, useEffect } from "react";

// This is a placeholder hook - add actual ImageViewer logic here if needed.
// For example, you might add logic for zoom, pan, window/level, etc.
const useImageViewer = (imageUrl: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) return;

    const loadImage = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate image loading (replace with actual image loading logic if needed)
        await new Promise((resolve) => setTimeout(resolve, 500));
        setLoading(false);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load image");
        setLoading(false);
      }
    };

    loadImage();
  }, [imageUrl]);

  return { loading, error };
};

export default useImageViewer;
