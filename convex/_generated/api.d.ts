/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as comments_get from "../comments/get.js";
import type * as comments_put from "../comments/put.js";
import type * as notes_delete from "../notes/delete.js";
import type * as notes_get from "../notes/get.js";
import type * as notes_put from "../notes/put.js";
import type * as tags_delete from "../tags/delete.js";
import type * as tags_get from "../tags/get.js";
import type * as tags_put from "../tags/put.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "comments/get": typeof comments_get;
  "comments/put": typeof comments_put;
  "notes/delete": typeof notes_delete;
  "notes/get": typeof notes_get;
  "notes/put": typeof notes_put;
  "tags/delete": typeof tags_delete;
  "tags/get": typeof tags_get;
  "tags/put": typeof tags_put;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
