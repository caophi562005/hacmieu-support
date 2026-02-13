import { Auth } from "convex/server";
import { ConvexError } from "convex/values";

export const validateOperator = async (ctx: { auth: Auth }) => {
  const identity = await ctx.auth.getUserIdentity();

  if (identity === null) {
    throw new ConvexError({
      code: "UNAUTHORIZED",
      message: "Identity not found",
    });
  }

  const orgId = identity.org_id as string;

  if (!orgId) {
    throw new ConvexError({
      code: "UNAUTHORIZED",
      message: "Organization not found",
    });
  }

  return { orgId, identity };
};
