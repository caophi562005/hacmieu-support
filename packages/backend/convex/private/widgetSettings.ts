import { v } from "convex/values";

import { createClerkClient } from "@clerk/backend";
import { action } from "../_generated/server";
import { WidgetSettingsType } from "../types";
import { validateOperator } from "../validate";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || "",
});

export const upsert = action({
  args: {
    greetingMessage: v.string(),
    defaultSuggestions: v.object({
      suggestion1: v.optional(v.string()),
      suggestion2: v.optional(v.string()),
      suggestion3: v.optional(v.string()),
    }),
    theme: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const { orgId } = await validateOperator(ctx);

      await clerkClient.organizations.updateOrganization(orgId, {
        publicMetadata: {
          widgetSettings: {
            greetingMessage: args.greetingMessage,
            defaultSuggestions: args.defaultSuggestions,
            theme: args.theme,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  },
});

export const getOne = action({
  args: {},
  handler: async (ctx) => {
    try {
      const { orgId } = await validateOperator(ctx);

      const organization = await clerkClient.organizations.getOrganization({
        organizationId: orgId,
      });

      if (organization) {
        return {
          valid: true,
          widgetSettings: organization.publicMetadata
            ?.widgetSettings as WidgetSettingsType,
        };
      } else {
        return {
          valid: false,
          reason: "Organization not found",
        };
      }
    } catch (error) {
      return {
        valid: false,
        reason: "Organization not found",
      };
    }
  },
});
