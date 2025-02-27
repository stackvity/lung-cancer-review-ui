import React from "react";
import Image from "next/image";
import styles from "./ImageViewer.module.css"; // Import CSS module
import { cn } from "@/lib/utils";

interface ImageViewerProps {
  imageUrl: string;
  className?: string;
  // Add other props as needed, e.g., annotations
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, className }) => {
  return (
    <div className={cn(styles.imageViewer, className)}>
      <Image
        src={imageUrl}
        alt="Medical Image"
        className={styles.imageViewerImage}
        width={500}
        height={500}
        priority
      />
      {/* Add annotation overlay or other elements here if needed */}
    </div>
  );
};

export default ImageViewer;
