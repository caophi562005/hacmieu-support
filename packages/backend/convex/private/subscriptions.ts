import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { validateOperator } from "../validate";

export const getOne = query({
  args: {},
  handler: async (ctx) => {
    const { orgId } = await validateOperator(ctx);

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
      .first();

    return subscription;
  },
});

export const create = mutation({
  args: {
    plan: v.string(),
    interval: v.union(v.literal("month"), v.literal("year")),
  },
  handler: async (ctx, args) => {
    const { orgId } = await validateOperator(ctx);

    // Check if subscription already exists
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
      .first();

    if (existing) {
      throw new Error("Subscription already exists for this organization");
    }

    const now = Date.now();
    const periodInMs =
      args.interval === "month"
        ? 30 * 24 * 60 * 60 * 1000
        : 365 * 24 * 60 * 60 * 1000;

    const subscriptionId = await ctx.db.insert("subscriptions", {
      organizationId: orgId,
      plan: args.plan,
      status: "active",
      interval: args.interval,
      currentPeriodStart: now,
      currentPeriodEnd: now + periodInMs,
      cancelAtPeriodEnd: false,
    });

    return subscriptionId;
  },
});

export const renew = mutation({
  args: {},
  handler: async (ctx) => {
    const { orgId } = await validateOperator(ctx);

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
      .first();

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    const periodInMs =
      subscription.interval === "month"
        ? 30 * 24 * 60 * 60 * 1000
        : 365 * 24 * 60 * 60 * 1000;

    let newPeriodEnd = subscription.currentPeriodEnd;
    if (Date.now() > subscription.currentPeriodEnd) {
      newPeriodEnd = Date.now() + periodInMs;
    } else {
      newPeriodEnd += periodInMs;
    }

    await ctx.db.patch(subscription._id, {
      status: "active",
      currentPeriodEnd: newPeriodEnd,
      cancelAtPeriodEnd: false,
    });

    return subscription._id;
  },
});

export const cancel = mutation({
  args: {},
  handler: async (ctx) => {
    const { orgId } = await validateOperator(ctx);

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_organization_id", (q) => q.eq("organizationId", orgId))
      .first();

    if (!subscription) {
      throw new Error("Subscription not found");
    }

    await ctx.db.patch(subscription._id, {
      cancelAtPeriodEnd: true,
    });

    return subscription._id;
  },
});
