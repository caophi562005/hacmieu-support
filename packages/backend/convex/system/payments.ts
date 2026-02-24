import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

export const processWebhook = internalMutation({
  args: {
    code: v.string(),
    transferAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payment")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .unique();

    if (!payment) {
      throw new Error(`Payment not found for code: ${args.code}`);
    }

    if (payment.amount !== args.transferAmount) {
      throw new Error(
        `Amount mismatch: Expected ${payment.amount}, got ${args.transferAmount}`,
      );
    }

    if (payment.status === "success") {
      return payment._id;
    }

    await ctx.db.patch(payment._id, {
      status: "success",
      paidAt: Date.now(),
    });

    if (
      payment.type === "subscription_creation" &&
      payment.plan &&
      payment.interval
    ) {
      const now = Date.now();
      const periodInMs =
        payment.interval === "month"
          ? 30 * 24 * 60 * 60 * 1000
          : 365 * 24 * 60 * 60 * 1000;

      await ctx.db.insert("subscriptions", {
        organizationId: payment.organizationId,
        plan: payment.plan,
        status: "active",
        interval: payment.interval,
        currentPeriodStart: now,
        currentPeriodEnd: now + periodInMs,
        cancelAtPeriodEnd: false,
      });
    } else if (payment.type === "subscription_renewal") {
      const subscription = await ctx.db
        .query("subscriptions")
        .withIndex("by_organization_id", (q) =>
          q.eq("organizationId", payment.organizationId),
        )
        .unique();

      if (subscription) {
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
      }
    }

    return payment._id;
  },
});
