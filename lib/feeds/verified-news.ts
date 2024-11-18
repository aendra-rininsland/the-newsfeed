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
    const feed = await (
      await ctx.bot.getList(
        "at://did:plc:kkf4naxqmweop7dv4l2iqqf5/app.bsky.graph.list/3jzmo456b6j2t"
      )
    ).getFeed({
      limit: params.limit,
      cursor: params.cursor,
    });

    const [last] = [...feed.posts].reverse();
    const cursor = last
      ? `${new Date(last.indexedAt ?? last.createdAt).getTime()}::${last.cid}`
      : undefined;

    return {
      cursor,
      feed: feed.posts.map((d) => ({ post: d.uri })),
    };
  } catch (e) {
    console.error(e);

    throw new InvalidRequestError(e);
  }
};
