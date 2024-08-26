import { v } from "convex/values";
import { query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";

export const list = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    let results;

    if(args.search === undefined || args.search === "") {
      results = await ctx.db
        .query("notes")
        .order("desc")
        .paginate(args.paginationOpts)
    } else {
      results = await ctx.db
        .query("notes")
        .withSearchIndex("search_fulltext", q => q.search("fulltext", args.search as string))
        .paginate(args.paginationOpts)
    }

    if(args.tags === undefined || args.tags.length === 0) return results;

    results.page = results.page.filter(note => args.tags?.some(tag => note.tags.includes(tag)));
    return results;
  }
})