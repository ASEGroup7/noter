import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { notesTableSchema } from "../schema";
import { Id } from "../_generated/dataModel";

export const create = mutation({
  args: {
    description: v.optional(v.string()),
    downloads: v.optional(v.number()),
    fileId: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    fulltext: v.optional(v.string()),
    html: v.optional(v.string()),
    stars: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    title: v.optional(v.string()),
    userId: v.optional(v.string()),
    originalId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { description, downloads, fileId, fileUrl, html, stars, tags, title, userId, originalId } = args;

    const newNoteId = await ctx.db.insert("notes", {
      description: description || "",
      downloads: downloads || 0,
      fileId: fileId || "",
      fileUrl: fileUrl || "",
      fulltext: description + " " + title + " " + tags,
      html: html || "",
      stars: stars || 0,
      tags: tags || [],
      title: title || "",
      userId: userId || "",
      originalId: originalId || undefined
    })

    return newNoteId;
  }
})

export const update = mutation({
  args: {
    id: v.string(),
    description: v.optional(v.string()),
    downloads: v.optional(v.number()),
    fileId: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    html: v.optional(v.string()),
    stars: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    title: v.optional(v.string()),
    userId: v.optional(v.string()),
  }, 
  handler: async (ctx, args) => {
    const { id, description, downloads, fileId, fileUrl, html, stars, tags, title, userId } = args;

    await ctx.db.patch(id as Id<"notes">, {
      ...(description !== undefined && { description }),
      ...(downloads !== undefined && { downloads }),
      ...(fileId !== undefined && { fileId }),
      ...(fileUrl !== undefined && { fileUrl }),
      ...(html !== undefined && { html }),
      ...(stars !== undefined && { stars }),
      ...(tags !== undefined && { tags }),
      ...(title !== undefined && { title }),
      ...(userId !== undefined && { userId }),
      fulltext: title + " " +  description + " " + (tags ? tags.join(" ") : ""),
    })
  }
})