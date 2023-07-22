import React, { createContext, useContext, useState, useEffect } from "react";

import { AuthenticateUser } from "../../../models/LogInUtilities";

const UserContext = createContext({
  user: null as AuthenticateUser | null,
});

export const useUser = () => useContext(UserContext);

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthenticateUser | null>(null);

  useEffect(() => {
    // TODO: Get a more robust way of identifying a signed in user.
    let retrievedAccountInfo = localStorage.getItem("session_info");
    if (retrievedAccountInfo === null) return;
    else setUser(JSON.parse(retrievedAccountInfo));
  }, []);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}
