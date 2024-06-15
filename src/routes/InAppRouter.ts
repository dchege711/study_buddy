import type { ReadPublicCardParams } from "../models/CardsMongoDB";
import * as CardsDB from "../models/CardsMongoDB";
import * as MetadataDB from "../models/MetadataMongoDB";
import { ICard } from "../models/mongoose_models/CardSchema";
import { authedProcedure, publicProcedure, router } from "../trpc";

export const inAppRouter = router({
  fetchPublicCard: publicProcedure
    .input((params: unknown) => params as ReadPublicCardParams)
    .query(({ input }) => {
      return CardsDB.readPublicCard(input);
    }),

  searchPublicCards: publicProcedure
    .input((params: unknown) => params as CardsDB.SearchCardParams)
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

  fetchCard: authedProcedure
    .input((params: unknown) =>
      params as Omit<CardsDB.ReadCardParams, "userIDInApp">
    )
    .query(({ input, ctx }) => {
      return CardsDB.read({ ...input, userIDInApp: ctx.user.userIDInApp });
    }),

  addCard: authedProcedure
    .input((params: unknown) =>
      params as Omit<CardsDB.CreateCardParams, "createdById">
    )
    .mutation(({ input, ctx }) => {
      return CardsDB.create({ ...input, createdById: ctx.user.userIDInApp });
    }),

  updateCard: authedProcedure
    .input((params: unknown) => params as Partial<ICard>)
    .mutation(({ input, ctx }) => {
      return CardsDB.update({ ...input, createdById: ctx.user.userIDInApp });
    }),

  trashCard: authedProcedure
    .input((params: unknown) =>
      params as Omit<MetadataDB.SendCardToTrashParams, "createdById">
    )
    .mutation(({ input, ctx }) => {
      return MetadataDB.sendCardToTrash({
        ...input,
        createdById: ctx.user.userIDInApp,
      });
    }),

  deleteCard: authedProcedure
    .input((params: unknown) =>
      params as Omit<MetadataDB.SendCardToTrashParams, "createdById">
    )
    .mutation(({ input, ctx }) => {
      return MetadataDB.deleteCardFromTrash({
        ...input,
        createdById: ctx.user.userIDInApp,
      });
    }),

  /**
   * TODO: The difference between this and `searchPublicCards` should
   * only be that the server enforces restrictions, e.g. userID in the former
   * and isPublic in the latter.
   */
  searchCards: authedProcedure
    .input((params: unknown) => params as CardsDB.SearchCardParams)
    .query(({ input, ctx }) => {
      return CardsDB.search(input, ctx.user.userIDInApp);
    }),

  duplicateCard: authedProcedure
    .input((params: unknown) =>
      params as Pick<CardsDB.DuplicateCardParams, "cardID">
    )
    .mutation(({ input, ctx }) => {
      return CardsDB.duplicateCard({
        ...input,
        userIDInApp: ctx.user.userIDInApp,
        cardsAreByDefaultPrivate: ctx.user.cardsAreByDefaultPrivate,
      });
    }),

  restoreCardFromTrash: authedProcedure
    .input((params: unknown) =>
      params as Omit<MetadataDB.SendCardToTrashParams, "createdById">
    )
    .mutation(({ input, ctx }) => {
      return MetadataDB.restoreCardFromTrash({
        ...input,
        createdById: ctx.user.userIDInApp,
      });
    }),

  metadata: authedProcedure
    .query(({ ctx }) => {
      return MetadataDB
        .read({ userIDInApp: ctx.user.userIDInApp });
    }),

  tagGroups: authedProcedure
    .query(({ ctx }) => {
      return CardsDB.getTagGroupings({ userIDInApp: ctx.user.userIDInApp });
    }),

  streak: authedProcedure
    .input((params: unknown) =>
      params as Omit<MetadataDB.UpdateStreakParams, "userIDInApp">
    )
    .mutation(({ input, ctx }) => {
      return MetadataDB.updateStreak({
        ...input,
        userIDInApp: ctx.user.userIDInApp,
      });
    }),

  settings: authedProcedure
    .input((params: unknown) =>
      params as Omit<MetadataDB.UpdateUserSettingsParams, "userIDInApp">
    )
    .mutation(({ input, ctx }) => {
      return MetadataDB.updateUserSettings({
        ...input,
        userIDInApp: ctx.user.userIDInApp,
      });
    }),
});
