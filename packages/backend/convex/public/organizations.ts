import { createClerkClient } from "@clerk/backend";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { action } from "../_generated/server";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || "",
});

export const validate = action({
  args: {
    organizationId: v.string(),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{
    valid: boolean;
    widgetSettings?: {
      greetingMessage: string;
      defaultSuggestions: {
        suggestion1?: string;
        suggestion2?: string;
        suggestion3?: string;
      };
      theme: string;
    };
    imageUrl?: string;
    reason?: string;
  }> => {
    try {
      const organization = await clerkClient.organizations.getOrganization({
        organizationId: args.organizationId,
      });

      if (organization) {
        const settings = await ctx.runQuery(
          internal.private.widgetSettings.getSettingsForOrg,
          { organizationId: args.organizationId },
        );

        let widgetSettings;
        if (settings) {
          widgetSettings = {
            greetingMessage: settings.greetingMessage,
            defaultSuggestions: settings.defaultSuggestions,
            theme: settings.theme,
          };
        }

        return {
          valid: true,
          widgetSettings,
          imageUrl: organization.imageUrl,
        };
      } else {
        return {
          valid: false,
          reason: "Organization not valid",
        };
      }
    } catch (error) {
      return {
        valid: false,
        reason: "Organization not valid",
      };
    }
  },
});
