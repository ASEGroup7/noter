import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  comments: defineTable({
    content: v.string(),
    fileId: v.string(),
    userId: v.string(),
  }),
  notes: defineTable({
    description: v.string(),
    downloads: v.float64(),
    fileId: v.string(),
    fileUrl: v.string(),
    fulltext: v.string(),
    html: v.string(),
    originalId: v.optional(v.string()),
    stars: v.float64(),
    tags: v.array(v.string()),
    title: v.string(),
    userId: v.string(),
  }).searchIndex("search_fulltext", {
    searchField: "fulltext",
  }),
  tags: defineTable({ tag: v.string() }).searchIndex(
    "search_tags",
    { searchField: "tag" }
  ),
});