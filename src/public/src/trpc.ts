import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

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

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

export type CardSearchResult = RouterOutput['searchPublicCards'][0];
export type PublicCard = RouterOutput['fetchPublicCard'];
export type FlagCardParams = RouterInput['flagCard'];
