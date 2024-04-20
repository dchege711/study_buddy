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

// Example usage:
function logResult(result: any) {
  console.log(result);
}

trpc.publicCard.query({cardID: '66240a488f79d475ec0fd68a'}).then((x) => logResult(x?.title));
trpc.publicCards.query({queryString: 'C++'}).then((x) => logResult(x));
trpc.publicMetadata.query().then((x) => logResult(x));
trpc.flagCard.mutate({cardID: '66240a488f79d475ec0fd68a'}).then((x) => logResult(x));
trpc.sendValidationEmail.mutate({email: 'd.chege711@gmail.com'}).then((x) => logResult(x));
