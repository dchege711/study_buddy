import { router, publicProcedure } from '../trpc';

export const inAppRouter = router({
  inAppRouterName: publicProcedure.query(() => {
    return "inAppRouterName";
  }),
});
