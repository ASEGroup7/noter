import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const notesTableSchema = v.object({
  description: v.string(),
  html: v.string(),
  fileUrl: v.string(),
  fileId: v.string(),
  stars: v.number(),
  downloads: v.number(),
  tags: v.array(v.string()),
  title: v.string(),
  fulltext: v.string(), //We do fulltext search on only the title and description.
  userId: v.string(), //Notes must have a userId
})

export const commentsTableSchema = v.object({
  userId: v.string(),
  fileId: v.string(), 
  content: v.string()
})

export default defineSchema({
  notes: defineTable(notesTableSchema).searchIndex("search_fulltext", {
    searchField: "fulltext",
  }),
  tags: defineTable({ tag: v.string() }).searchIndex("search_tags", {
    searchField: "tag",
  }),
  comments: defineTable(commentsTableSchema)

});

// "pnpx convex dev" to update schema 