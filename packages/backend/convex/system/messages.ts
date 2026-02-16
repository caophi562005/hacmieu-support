import { ConvexError, v } from "convex/values";
import { internalMutation } from "../_generated/server";

export const create = internalMutation({
  args: {
    conversationId: v.id("conversations"),
    message: v.object({
      role: v.string(),
      text: v.string(),
      _creationTime: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    await ctx.db.patch(conversation._id, {
      lastMessage: {
        role: args.message.role as "user" | "assistant",
        text: args.message.text,
        _creationTime: args.message._creationTime,
      },
    });
  },
});
