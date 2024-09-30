import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { commentsTableSchema } from "../schema";
import { Id } from "../_generated/dataModel";

export const create = mutation({
  args: {
    userId: v.string(),
    fileId: v.string(),
    content: v.string()
  },
  handler: async (ctx, args) => {

    const newCommentId = await ctx.db.insert("comments", {
      userId: args.userId,
      fileId: args.fileId,
      content: args.content
    })
    return newCommentId;
  }
})