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
  userId: v.string(),
  numberOfLikes: v.string()
})

export const userTableSchema = v.object({
  userId: v.string(),
  likedFileId: v.string(), //change to list of liked files
  commentedFileId: v.string(), //change to list of comment id
  ratedFileId: v.string() //change to list of dictionaries. dict: {fileid: string, rating: int}
})

export const commentsTableSchema = v.object({
  commentId: v.string(),
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
  user: defineTable(userTableSchema),
  comments: defineTable(commentsTableSchema)

});