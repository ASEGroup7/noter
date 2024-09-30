import { v } from "convex/values";
import { query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";

export const list = query({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const results = await ctx.db
        .query("comments")
        .filter(q => q.eq(q.field("fileId"), args.fileId))
        .order("asc")
        .collect();

      return results;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw new Error("Unable to fetch comments");
    }
  }
});
