import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";

// Initialize tRPC exactly once per application. Multiple instances of tRPC will
// cause issues.
const t = initTRPC.context<Context>().create();

// Export certain members of `t` but not `t` itself to establish a certain set
// of procedures that we will use idiomatically in our codebase.

export const router = t.router;
export const publicProcedure = t.procedure;
export const mergeRouters = t.mergeRouters;
export const createCallerFactory = t.createCallerFactory;

export const authedProcedure = publicProcedure
  .use(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Log in to perform this action.",
      });
    }

    return next({
      ctx: {
        user: ctx.user, // User is inferred to be non-null.
      },
    });
  });
