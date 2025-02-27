import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import styles from "./FindingsSummary.module.css"; // Import CSS module

interface FindingsSummaryProps {
  findings: Finding[]; // You'll need to define the Finding type
  className?: string;
}

// Define the Finding interface (adjust to match your actual type definition)
interface Finding {
  finding_id: string;
  file_id: string;
  finding_type: string;
  location?: string;
  description: string;
  source: string;
  [key: string]: string | undefined; // Allow additional string properties
}

const FindingsSummary: React.FC<FindingsSummaryProps> = ({
  findings,
  className,
}) => {
  if (!findings || findings.length === 0) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle>Findings Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No findings available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>AI Findings Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {findings.map((finding) => (
          <div key={finding.finding_id} className={styles.findingItem}>
            <Badge className={styles.findingBadge}>{finding.source}</Badge>
            <p className={styles.findingDescription}>{finding.description}</p>
            {finding.location && (
              <p className={styles.findingLocation}>
                Location: {finding.location}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FindingsSummary;
