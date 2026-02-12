"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { api } from "@workspace/backend/_generated/api";
import { useQuery } from "convex/react";

export default function Page() {
  const widgetSettings = useQuery(api.private.widgetSettings.getOne);

  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-svh">
      <UserButton showName />
      <OrganizationSwitcher hidePersonal={true} skipInvitationScreen />
      <pre>{JSON.stringify(widgetSettings)}</pre>
    </div>
  );
}
