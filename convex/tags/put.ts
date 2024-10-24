import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { Id } from "../_generated/dataModel";

export const create = mutation({
  args: {
    tag: v.string(),
  },
  handler: async (ctx, args) => {
    const newNoteId = await ctx.db.insert("tags", {
      tag: args.tag
    })

    return newNoteId;
  }
})