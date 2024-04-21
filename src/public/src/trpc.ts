import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { inferRouterOutputs } from '@trpc/server';

import type { AppRouter } from '../../server.js';
 
// Pass `AppRouter` as generic here. This lets the `trpc` object know what
// procedures are available on the server and their input/output types.
export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:5000/trpc',
    }),
  ],
});

type RouterInput = inferRouterOutputs<AppRouter>;

export type CardSearchResult = RouterInput['searchPublicCards'][0];
