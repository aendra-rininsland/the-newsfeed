import logger from "debug";
import { Server } from "@atproto/bsky/src/lexicon";
import { AppContext } from "./config";
import algos from "./feeds";
import { AtUri } from "@atproto/syntax";

const debug = logger("newsfeed:feed-generator");

export default function (server: Server, ctx: AppContext) {
  server.app.bsky.feed.getFeedSkeleton(async ({ params, req }) => {
    const feedUri = new AtUri(params.feed);
    const algo = algos[feedUri.rkey];

    const body = await algo(ctx, params);

    return {
      encoding: "application/json",
      body: body,
      headers: {
        // TODO make more configurable
        "Surrogate-Control": "max-age=300, stale-if-error=86400",
        "Cache-Control": "max-age=300, stale-if-error=86400",
      },
    };
  });
}
