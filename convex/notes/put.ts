import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { notesTableSchema } from "../schema";
import { Id } from "../_generated/dataModel";

export const create = mutation({
  args: {
    fileUrl: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {

    const newNoteId = await ctx.db.insert("notes", {
      title: "",
      description: "",
      fulltext: "",
      stars: 0,
      tags: [],
      fileUrl: args.fileUrl,
      fileId: args.fileId,
      userId: ""
    })
    return newNoteId;
  }
})

export const update = mutation({
  args: {
    id: v.string(),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    stars: v.optional(v.float64()),
  }, 
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(args.id as Id<"notes">, {
      ...data
    })
  }
})