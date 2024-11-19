/**
 * @file
 * Main server entry point
 */

import Fastify from "fastify";
import middie from "@fastify/middie";
import { createServer } from "@atproto/bsky/src/lexicon";
import apicache from "apicache";
import { wellKnown } from "./well-known";
import describeGenerator from "./describe-generator";
import feedGenerator from "./feed-generator";
import { AtpAgent } from "@atproto/api";

const agent = new AtpAgent({ service: "https://bsky.app" });

export async function app() {
  const ctx = {
    cfg: {
      port: Number(process.env.PORT ?? 3000),
      hostname: process.env.HOSTNAME ?? "localhost",
      publisherDid:
        process.env.PUBLISHER_DID ?? "did:plc:kkf4naxqmweop7dv4l2iqqf5",
      cacheTTL: process.env.CACHE_TTL ?? "1 minute",
    },
    agent,
  };

  const server = createServer({
    validateResponse: true,
    payload: {
      jsonLimit: 100 * 1024, // 100kb
      textLimit: 100 * 1024, // 100kb
      blobLimit: 5 * 1024 * 1024, // 5mb
    },
  });

  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(middie);

  feedGenerator(server, ctx);
  describeGenerator(server, ctx);

  fastify.use(apicache.middleware(ctx.cfg.cacheTTL));
  fastify.use(server.xrpc.router);
  fastify.get("/.well-known/did.json", wellKnown(ctx));

  fastify.listen({ port: ctx.cfg.port, host: ctx.cfg.hostname });
}

app();
