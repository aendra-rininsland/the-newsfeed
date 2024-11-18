import { FastifyReply, FastifyRequest } from "fastify";
import { AppContext } from "./config";

export const wellKnown =
  (ctx: AppContext) => (req: FastifyRequest, res: FastifyReply) => {
    if (!ctx.cfg.publisherDid.endsWith(ctx.cfg.hostname)) {
      return res.status(404).send("Not found");
    }

    return res.send({
      "@context": ["https://www.w3.org/ns/did/v1"],
      id: ctx.cfg.publisherDid,
      service: [
        {
          id: "#bsky_fg",
          type: "BskyFeedGenerator",
          serviceEndpoint: `https://${ctx.cfg.hostname}`,
        },
      ],
    });
  };
