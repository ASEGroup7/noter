import { v } from "convex/values";
import { action, query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { Id } from "../_generated/dataModel";

export const list = query({
  args: { 
    paginationOpts: paginationOptsValidator,
    fulltext: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if(args.fulltext === undefined || args.fulltext === "") {
      return await ctx.db
        .query("notes")
        .order("desc")
        .paginate(args.paginationOpts)
    } else {
      return await ctx.db
        .query("notes")
        .withSearchIndex("search_fulltext", q => q.search("fulltext", args.fulltext as string))
        .paginate(args.paginationOpts)
    }
  }
})

export const idList = query({
  args: {
    fileIds: v.array(v.string())
  },
  handler: async (ctx, args) => {
    const documents = await Promise.all(
      args.fileIds.map(async (id) => {
        if(!ctx.db.normalizeId("notes", id)) return null;
        return await ctx.db.get(id as Id<"notes">);
      })
    );
    
    return documents;
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

export const userId = query({
  args: {
    paginationOpts: paginationOptsValidator,
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const noteList = await ctx.db.query("notes")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .paginate(args.paginationOpts);

    return noteList;
  }
})