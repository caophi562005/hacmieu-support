"use client";

import { api } from "@workspace/backend/_generated/api";
import { useQuery } from "convex/react";
import { ReactNode } from "react";

type ProtectProps = {
  children: ReactNode;
  fallback?: ReactNode;
  plan?: string;
};

export const Protect = ({ children, fallback, plan }: ProtectProps) => {
  const subscription = useQuery(api.private.subscriptions.getOne);

  if (!subscription) {
    return <>{fallback}</>;
  }

  if (plan && subscription.plan !== plan) {
    return <>{fallback}</>;
  }

  if (subscription.status !== "active" && subscription.status !== "canceled") {
    return <>{fallback}</>;
  }

  if (
    subscription.currentPeriodEnd &&
    subscription.currentPeriodEnd < Date.now()
  ) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
