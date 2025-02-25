"use client"; // <- Add this at the top

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function Home() {
  const t = useTranslations("common");
  const router = useRouter();

  const handleNextClick = () => {
    router.push("/dashboard"); // Navigate to the dashboard route
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold foreground">
          {" "}
          {/* Added foreground class */}
          {t("app_title")}
        </h1>

        <p className="mt-3 text-2xl foreground">
          {" "}
          {/* Added foreground class */}
          {t("common.loading")}
        </p>

        <div className="mt-6">
          <Button
            variant="default"
            size="lg"
            onClick={handleNextClick}
            aria-label={t("common.next")} // Added aria-label for accessibility
          >
            {t("common.next")}
          </Button>
        </div>
      </main>
    </div>
  );
}
