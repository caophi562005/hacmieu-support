"use client";

import { useQuery } from "convex/react";

import { api } from "@workspace/backend/_generated/api";

import { CustomizationForm } from "../components/customization-form";

export const CustomizationView = () => {
  const widgetSettings = useQuery(api.private.widgetSettings.getOne);

  return (
    <div className="bg-muted flex min-h-screen flex-col p-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl">Tùy chỉnh Giao diện</h1>
          <p className="text-muted-foreground">
            Tùy chỉnh giao diện và hành vi của khung chat cho khách hàng
          </p>
        </div>

        <div className="mt-8">
          <CustomizationForm initialData={widgetSettings?.widgetSettings} />
        </div>
      </div>
    </div>
  );
};
