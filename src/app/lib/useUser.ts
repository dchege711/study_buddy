import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";

import { AuthenticateUser } from "../../models/LogInUtilities";

/**
 * Example adapted from [1], which makes use of [2].
 *
 * SWR, or stale-while-revalidate, is a HTTP cache invalidation strategy that
 * first returns the data from cache (stale), then sends the fetch request
 * (revalidate), and finally comes with the up-to-date data. It helps web devs
 * forget about fetching data in an imperative way: start the request, update
 * the loading state, and return the final result. Instead, the code is more
 * declarative because it specifies what data is used by the component.
 *
 * [1]: https://github.com/vvo/iron-session/blob/main/examples/next.js-typescript/lib/useUser.ts
 * [2]: https://swr.vercel.app/docs/getting-started
 */

/**
 * A hook for accessing the user data in different parts of the UI, e.g.,
 *
 * ```tsx
 * function ProfileCard() {
 *  const { user } = useUser();
 *  if (!user) {
 *   return <div>Loading...</div>;
 *  }
 *  return <div>User: {user.username}</div>;
 * }
 * ```
 */
export default function useUser({
  redirectTo = "",
  redirectIfFound = false,
} = {}) {
  const { data: user, mutate: mutateUser } =
    useSWR<AuthenticateUser>("/api/user");

  useEffect(() => {
    // If no redirect is needed, return, e.g.,  already on /account/*.
    if (!redirectTo) {
      return;
    }

    // If the user data is not yet available, e.g., still fetching, don't do
    // anything yet.
    if (!user) {
      return;
    }

    // If redirectTo is set, redirect if the user was not found.
    if (redirectTo && !redirectIfFound && !user.token_id) {
      Router.push(redirectTo);
    }

    // If redirectIfFound is set, redirect if the user was found.
    if (redirectIfFound && user.token_id) {
      Router.push(redirectTo);
    }
  }, [user, redirectIfFound, redirectTo]);

  return { user, mutateUser };
}
