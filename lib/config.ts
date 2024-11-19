import { AtpAgent } from "@atproto/api";
export type AppContext = {
  cfg: Config;
  agent: AtpAgent;
};

export type Config = {
  port: number;
  hostname: string;
  publisherDid: string;
  cacheTTL: number | string;
};
