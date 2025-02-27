import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ListIcon } from "lucide-react"; // Example icon
import { cn } from "@/lib/utils";
import styles from "./ExternalResources.module.css"; // Import CSS module

interface ExternalResourcesProps {
  className?: string;
  resources?: ResourceItem[]; // Define resource item type
}

interface ResourceItem {
  name: string;
  url: string;
  description?: string;
}

const defaultResources: ResourceItem[] = [
  {
    name: "National Cancer Institute (NCI)",
    url: "https://www.cancer.gov/",
    description:
      "The U.S. National Cancer Institute: authoritative information on cancer types, treatment, research, and prevention.",
  },
  {
    name: "American Cancer Society (ACS)",
    url: "https://www.cancer.org/",
    description:
      "The American Cancer Society: patient support, education, and advocacy.",
  },
  {
    name: "Mayo Clinic - Cancer Center",
    url: "https://www.mayoclinic.org/cancer-center/",
    description:
      "Mayo Clinic Cancer Center:  information on cancer diagnosis, treatment, and research from a leading medical center.",
  },
  // Add more resources as needed
];

const ExternalResources: React.FC<ExternalResourcesProps> = ({
  className,
  resources = defaultResources,
}) => {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>External Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          For more in-depth information and support, please visit these external
          resources:
        </p>
        <ul className="list-none pl-0 ml-0">
          {resources.map((resource, index) => (
            <li key={index} className={styles.resourceItem}>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.resourceLink}
              >
                <ListIcon className={styles.resourceIcon} aria-hidden="true" />
                <span className={styles.resourceName}>{resource.name}</span>
              </a>
              {resource.description && (
                <p className={styles.resourceDescription}>
                  {resource.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ExternalResources;
