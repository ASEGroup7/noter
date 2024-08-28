import { v } from "convex/values";
import { query } from "../_generated/server";

export const list = query({
  args: {
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if(args.search === undefined || args.search === "") return await ctx.db
      .query("tags")
      .order("desc")
      .collect();

    return await ctx.db
      .query("tags")
      .withSearchIndex("search_tags", q => q.search("tag", args.search as string))
      .collect();
  }
})