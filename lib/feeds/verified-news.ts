/**
 * @file
 * Newsfeed bot
 */

import { InvalidRequestError } from "@atproto/xrpc-server";
import { QueryParams } from "@atproto/bsky/src/lexicon/types/app/bsky/feed/getFeedSkeleton";
import { AppContext } from "../config";
import { Post } from "@skyware/bot";

// max 15 chars
export const shortname = "verified-news";

export const handler = async (ctx: AppContext, params: QueryParams) => {
  try {
    const posts: Post[] = [];
    let lastCursor;
    while (posts.length < params.limit || 100) {
      const feed = await (
        await ctx.bot.getList(
          "at://did:plc:kkf4naxqmweop7dv4l2iqqf5/app.bsky.graph.list/3jzmo456b6j2t"
        )
      ).getFeed({
        limit: params.limit,
        cursor: lastCursor || params.cursor,
      });

      lastCursor = feed.cursor;

      for (const post of feed.posts) {
        if (post.embed?.isExternal && !post.replyRef) {
          posts.push(post);
        }
      }
    }

    const [last] = [...posts].reverse();
    const cursor = last
      ? `${new Date(last.indexedAt ?? last.createdAt).getTime()}::${last.cid}`
      : undefined;

    return {
      cursor,
      feed: posts.map((d) => ({ post: d.uri })),
    };
  } catch (e) {
    console.error(e);

    throw new InvalidRequestError(e);
  }
};
