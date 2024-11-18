import { Bot } from "@skyware/bot";

export type AppContext = {
  cfg: Config;
  bot: Bot;
};

export type Config = {
  port: number;
  hostname: string;
  publisherDid: string;
  cacheTTL: number | string;
};
