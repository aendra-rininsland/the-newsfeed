/**
 * @file
 * Newsfeed bot
 */

import { InvalidRequestError } from "@atproto/xrpc-server";
import { QueryParams } from "@atproto/bsky/src/lexicon/types/app/bsky/feed/getFeedSkeleton";
import { AppContext } from "../config";

// max 15 chars
export const shortname = "verified-news";

export const handler = async (ctx: AppContext, params: QueryParams) => {
  try {
    const posts: any[] = [];
    let lastCursor;

    while (posts.length < (params.limit || 100)) {
      const feed = await ctx.agent.app.bsky.feed.getListFeed({
        list: "at://did:plc:kkf4naxqmweop7dv4l2iqqf5/app.bsky.graph.list/3jzmo456b6j2t",
        limit: params.limit ?? 100,
        cursor: lastCursor || params.cursor,
      });

      lastCursor = feed.data.cursor;

      for (const post of feed.data.feed) {
        if (post.post.embed?.external && !post.reply) {
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
