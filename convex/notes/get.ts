import { v } from "convex/values";
import { action, query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { Id } from "../_generated/dataModel";

export const list = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    fulltext: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    let results;

    if(args.fulltext === undefined || args.fulltext === "") {
      results = await ctx.db
        .query("notes")
        .order("desc")
        .paginate(args.paginationOpts)
    } else {
      results = await ctx.db
        .query("notes")
        .withSearchIndex("search_fulltext", q => q.search("fulltext", args.fulltext as string))
        .paginate(args.paginationOpts)
    }

    if(args.tags === undefined || args.tags.length === 0) return results;

    results.page = results.page.filter(note => args.tags?.some(tag => note.tags.includes(tag)));
    return results;
  }
})

export const id = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    if(!ctx.db.normalizeId("notes", args.id)) return null;
    return await ctx.db.get(args.id as Id<"notes">);
  }
})