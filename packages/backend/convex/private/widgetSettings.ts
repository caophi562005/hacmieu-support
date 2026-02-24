import { v } from "convex/values";
import { internalQuery, mutation, query } from "../_generated/server";
import { WidgetSettingsType } from "../types";
import { validateOperator } from "../validate";

export const upsert = mutation({
  args: {
    greetingMessage: v.string(),
    defaultSuggestions: v.object({
      suggestion1: v.optional(v.string()),
      suggestion2: v.optional(v.string()),
      suggestion3: v.optional(v.string()),
    }),
    theme: v.string(),
    phoneNumber: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const { orgId } = await validateOperator(ctx);

      const existing = await ctx.db
        .query("widgetSettings")
        .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          greetingMessage: args.greetingMessage,
          defaultSuggestions: args.defaultSuggestions,
          theme: args.theme,
          phoneNumber: args.phoneNumber,
        });
      } else {
        await ctx.db.insert("widgetSettings", {
          organizationId: orgId,
          greetingMessage: args.greetingMessage,
          defaultSuggestions: args.defaultSuggestions,
          theme: args.theme,
          phoneNumber: args.phoneNumber,
        });
      }
    } catch (error) {
      console.error(error);
    }
  },
});

export const getOne = query({
  args: {},
  handler: async (ctx) => {
    try {
      const { orgId } = await validateOperator(ctx);

      const settings = await ctx.db
        .query("widgetSettings")
        .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
        .first();

      if (settings) {
        return {
          valid: true,
          widgetSettings: {
            greetingMessage: settings.greetingMessage,
            defaultSuggestions: settings.defaultSuggestions,
            theme: settings.theme,
          } as WidgetSettingsType,
        };
      } else {
        return {
          valid: true,
          widgetSettings: undefined,
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

export const getSettingsForOrg = internalQuery({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("widgetSettings")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", args.organizationId),
      )
      .first();
  },
});
