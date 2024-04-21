import type { ReadPublicCardParams, SearchPublicCardParams } from '../models/CardsMongoDB';
import { router, publicProcedure, authedProcedure } from '../trpc';
import * as CardsDB from "../models/CardsMongoDB";
import * as MetadataDB from "../models/MetadataMongoDB";
import { ICardRaw } from '../models/mongoose_models/CardSchema';

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

  card: authedProcedure
    .input((params: unknown) => params as Omit<CardsDB.ReadCardParams, "userIDInApp">)
    .query(({ input, ctx }) => {
      return CardsDB.read({ ...input, userIDInApp: ctx.user.userIDInApp });
    }),

  addCard: authedProcedure
    .input((params: unknown) => params as Omit<CardsDB.CreateCardParams, "createdById">)
    .mutation(({ input, ctx }) => {
      return CardsDB.create({ ...input, createdById: ctx.user.userIDInApp });
    }),

  updateCard: authedProcedure
    .input((params: unknown) => params as Partial<ICardRaw>)
    .mutation(({ input, ctx }) => {
      return CardsDB.update({ ...input, createdById: ctx.user.userIDInApp });
    }),

  trashCard: authedProcedure
    .input((params: unknown) => params as Omit<MetadataDB.SendCardToTrashParams, "createdById">)
    .mutation(({ input, ctx }) => {
      return MetadataDB.sendCardToTrash({ ...input, createdById: ctx.user.userIDInApp });
    }),

  deleteCard: authedProcedure
    .input((params: unknown) => params as Omit<MetadataDB.SendCardToTrashParams, "createdById">)
    .mutation(({ input, ctx }) => {
      return MetadataDB.deleteCardFromTrash({ ...input, createdById: ctx.user.userIDInApp });
    }),

  cards: authedProcedure
    .input((params: unknown) => params as Omit<CardsDB.SearchCardParams, "userIDInApp">)
    .query(({ input, ctx }) => {
      return CardsDB.search({ ...input, userIDInApp: ctx.user.userIDInApp });
    }),

  duplicateCard: authedProcedure
    .input((params: unknown) => params as Pick<CardsDB.DuplicateCardParams, "cardID">)
    .mutation(({ input, ctx }) => {
      return CardsDB.duplicateCard({
        ...input,
        userIDInApp: ctx.user.userIDInApp,
        cardsAreByDefaultPrivate: ctx.user.cardsAreByDefaultPrivate,
      });
    }),

  restoreCardFromTrash: authedProcedure
    .input((params: unknown) => params as Omit<MetadataDB.SendCardToTrashParams, "createdById">)
    .mutation(({ input, ctx }) => {
      return MetadataDB.restoreCardFromTrash({ ...input, createdById: ctx.user.userIDInApp });
    }),

  metadata: authedProcedure
    .query(({ ctx }) => {
      return MetadataDB
        .read({ userIDInApp: ctx.user.userIDInApp })
        .then(async (metadataDocs) => {
          let minicards = await CardsDB.read({ userIDInApp: ctx.user.userIDInApp }, "title tags urgency");
          return { metadataDocs, minicards };
        });
    }),

  tagGroups: authedProcedure
    .query(({ ctx }) => {
      return CardsDB.getTagGroupings({ userIDInApp: ctx.user.userIDInApp });
    }),

  streak: authedProcedure
    .input((params: unknown) => params as Omit<MetadataDB.UpdateStreakParams, "userIDInApp">)
    .mutation(({ input, ctx }) => {
      return MetadataDB.updateStreak({ ...input, userIDInApp: ctx.user.userIDInApp });
    }),

  settings: authedProcedure
    .input((params: unknown) => params as Omit<MetadataDB.UpdateUserSettingsParams, "userIDInApp">)
    .mutation(({ input, ctx }) => {
      return MetadataDB.updateUserSettings({ ...input, userIDInApp: ctx.user.userIDInApp });
    }),

});
