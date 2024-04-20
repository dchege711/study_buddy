import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

/**
 * Creates context for an incoming request.
 */
export function createContext(opts: CreateExpressContextOptions) {
  return {
    user: opts.req.session?.user || null,
  };
}

export type Context = ReturnType<typeof createContext>;
