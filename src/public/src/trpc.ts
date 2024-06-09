import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import type { AppRouter } from '../../server.js';
 
// Pass `AppRouter` as generic here. This lets the `trpc` object know what
// procedures are available on the server and their input/output types.
export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/trpc',
    }),
  ],
});

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

// TODO: Assert PublicCardSearchQuery and PrivateCardSearchQuery are the same?
type PublicCardSearchQuery = RouterInput['searchPublicCards'];
type PrivateCardSearchQuery = RouterInput['searchCards'];
export type CardSearchQuery = PublicCardSearchQuery | PrivateCardSearchQuery;

export type CardFetchEndpoint = typeof trpc.fetchCard.query | typeof trpc.fetchPublicCard.query;
export type CardSearchEndpoint = typeof trpc.searchCards.query | typeof trpc.searchPublicCards.query;

export type CardSearchResult = RouterOutput['searchPublicCards'][0];
export type PublicCardResult = RouterOutput['fetchPublicCard'];
export type PrivateCardResult = RouterOutput['fetchCard'];
export type Card = NonNullable<PublicCardResult> | PrivateCardResult;
export type FlagCardParams = RouterInput['flagCard'];
export type AddCardParams = RouterInput['addCard'];
export type MetadataNodeInformation = RouterOutput['publicMetadata'][0]['node_information'];

export type FetchCardEndpoint = (params: RouterInput['fetchCard'] | RouterInput['fetchPublicCard']) => Promise<RouterOutput['fetchCard'] | RouterOutput['fetchPublicCard']>;
