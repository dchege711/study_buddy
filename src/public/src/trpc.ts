import { createTRPCClient, httpBatchLink } from '@trpc/client';

import type { AppRouter } from '../../server';
 
// Pass `AppRouter` as generic here. This lets the `trpc` object know what
// procedures are available on the server and their input/output types.
export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:5000/trpc',
    }),
  ],
});

trpc.greeting.query().then((s) => console.log(s));

