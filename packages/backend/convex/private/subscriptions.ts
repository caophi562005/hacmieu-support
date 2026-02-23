import { query } from "../_generated/server";
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
