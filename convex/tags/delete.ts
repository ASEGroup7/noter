import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const remove = mutation({
  args: {
    id: v.id("tags"),
  }, 
  handler: async (ctx, args) => {
    ctx.db.delete(args.id)
      .then((res) => true)
      .catch((e) => false)
  }
})