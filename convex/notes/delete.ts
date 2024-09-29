import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const remove = mutation({
  args: {
    id: v.id("notes"),
  }, 
  handler: async (ctx, args) => {
    ctx.db.delete(args.id)
      .then((res) => true)
      .catch((e) => false)
  }
})