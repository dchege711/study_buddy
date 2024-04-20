import { initTRPC } from '@trpc/server';
 
// Initialize tRPC exactly once per application. Multiple instances of tRPC will
// cause issues.
const t = initTRPC.create();

// Export certain members of `t` but not `t` itself to establish a certain set
// of procedures that we will use idiomatically in our codebase.

export const router = t.router;
export const publicProcedure = t.procedure;
