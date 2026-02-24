import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { validateOperator } from "../validate";

export const create = mutation({
  args: {
    subscriptionId: v.optional(v.id("subscriptions")),
    amount: v.number(),
    currency: v.optional(v.string()),
    type: v.union(
      v.literal("subscription_creation"),
      v.literal("subscription_renewal"),
    ),
    paymentMethod: v.union(v.literal("qr"), v.literal("credit_card")),
    status: v.union(
      v.literal("pending"),
      v.literal("success"),
      v.literal("failed"),
      v.literal("refunded"),
    ),
    code: v.string(),
    plan: v.optional(v.string()),
    interval: v.optional(v.union(v.literal("month"), v.literal("year"))),
  },
  handler: async (ctx, args) => {
    const { orgId } = await validateOperator(ctx);

    const paymentId = await ctx.db.insert("payment", {
      ...args,
      organizationId: orgId,
    });

    return paymentId;
  },
});

export const getForOrganization = query({
  args: {},
  handler: async (ctx) => {
    const { orgId } = await validateOperator(ctx);

    const payments = await ctx.db
      .query("payment")
      .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
      .collect();

    return payments;
  },
});
