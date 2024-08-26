import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const notesTableSchema = v.object({
  description: v.string(),
  fileUrl: v.string(),
  fileId: v.string(),
  stars: v.float64(),
  tags: v.array(v.string()),
  title: v.string(),
  fulltext: v.string(),
})

export default defineSchema({
  notes: defineTable(notesTableSchema).searchIndex("search_fulltext", {
    searchField: "fulltext",
  }),
  tags: defineTable({ tag: v.string() }).searchIndex("search_tags", {
    searchField: "tag",
  }),
});