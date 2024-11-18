import { AppContext } from "../config";
import {
  QueryParams,
  OutputSchema as AlgoOutput,
} from "@atproto/bsky/src/lexicon/types/app/bsky/feed/getFeedSkeleton";
import * as verifiedNews from "./verified-news";

type AlgoHandler = (
  ctx: AppContext,
  params: QueryParams
) => Promise<AlgoOutput>;

const algos: Record<string, AlgoHandler> = {
  [verifiedNews.shortname]: verifiedNews.handler,
};

export default algos;
