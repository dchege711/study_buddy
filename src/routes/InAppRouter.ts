import type { ReadPublicCardParams, SearchPublicCardParams } from '../models/CardsMongoDB';
import { router, publicProcedure } from '../trpc';
import * as CardsDB from "../models/CardsMongoDB";
import * as MetadataDB from "../models/MetadataMongoDB";

export const inAppRouter = router({
  publicCard: publicProcedure
    .input((params: unknown) => params as ReadPublicCardParams)
    .query(({ input }) => {
      return CardsDB.readPublicCard(input);
    }),

  publicCards: publicProcedure
    .input((params: unknown) => params as SearchPublicCardParams)
    .query(({ input }) => {
      return CardsDB.publicSearch(input);
    }),

  publicMetadata: publicProcedure
    .query(() => {
      return MetadataDB.readPublicMetadata();
    }),

  flagCard: publicProcedure
    .input((params: unknown) => params as CardsDB.FlagCardParams)
    .mutation(({ input }) => {
      return CardsDB.flagCard(input);
    }),
});
