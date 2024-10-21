import { v } from "convex/values";
import { query } from "../_generated/server";

export const list = query({
  args: {
    fulltext: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let result;

    if(args.fulltext === undefined || args.fulltext === "") 
      result = await ctx.db
      .query("tags")
      .order("desc")

    else
      result = await ctx.db
      .query("tags")
      .withSearchIndex("search_tags", q => q.search("tag", args.fulltext as string))

    return args.limit ? result.take(args.limit) : result.collect()
  }
})