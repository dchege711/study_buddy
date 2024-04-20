import { router, publicProcedure } from '../trpc';

export const authRouter = router({
  authRouterName: publicProcedure.query(() => {
    return "authRouterName";
  }),
});
