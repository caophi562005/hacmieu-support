"use client";

import { useAction } from "convex/react";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";

import { api } from "@workspace/backend/_generated/api";
import { WidgetSettingsType } from "@workspace/backend/types";

import { CustomizationForm } from "../components/customization-form";

export const CustomizationView = () => {
  const getWidgetSettings = useAction(api.private.widgetSettings.getOne);

  const [isLoading, setIsLoading] = useState(true);
  const [widgetSettingsData, setWidgetSettingsData] =
    useState<WidgetSettingsType | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const result = await getWidgetSettings();
        if (result.valid) {
          setWidgetSettingsData(result.widgetSettings!);
        } else {
          setWidgetSettingsData(null);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        setWidgetSettingsData(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [getWidgetSettings]);

  if (isLoading) {
    return (
      <div className="bg-muted flex min-h-screen flex-col items-center justify-center gap-y-2 p-8">
        <Loader2Icon className="text-muted-foreground animate-spin" />
        <p className="text-muted-foreground text-sm">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-muted flex min-h-screen flex-col p-8">
      <div className="mx-auto w-full max-w-screen-md">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl">Widget Customization</h1>
          <p className="text-muted-foreground">
            Customize how your chat widget looks and behaves for your customers
          </p>
        </div>

        <div className="mt-8">
          <CustomizationForm initialData={widgetSettingsData} />
        </div>
      </div>
    </div>
  );
};
