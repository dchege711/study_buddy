import React from "react";
import { createRoot } from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  useRouteError,
  isRouteErrorResponse,
  Outlet,
  LoaderFunction,
} from "react-router-dom";
import Wiki from "./routes/Wiki";
import NavBar from "./partials/NavBar";
import Footer from "./partials/Footer";
import Browse from "./routes/Browse";
import MetadataProvider from "./partials/MetadataHook";
import LogInOrSignUp, { handleLogin, handleSignUp } from "./routes/LogInOrSignUp";
import { AuthenticateUser } from "../../models/LogInUtilities";

const appLoader: LoaderFunction = () => {
  let retrievedAccountInfo = localStorage.getItem("session_info");
  if (retrievedAccountInfo === null) return null;

  // TODO: What if this is stale?
  let authenticatedUser = JSON.parse(retrievedAccountInfo) as AuthenticateUser;
  return authenticatedUser;
}

function App() {
  return (
    <MetadataProvider endpoint="/read-metadata">
      <NavBar />
      <div id="main_div">
        <Outlet />
      </div>
      <Footer />
    </MetadataProvider>
  );
}

function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  // Per [1], there's no better typing for `error` as it can be anything from
  // the loaders or actions.
  //
  // [1]: https://stackoverflow.com/a/76126878/7812406
  let errorMessage: string;
  if (isRouteErrorResponse(error)) {
    errorMessage = error.error?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Unknown error";
  }

  return (
    <>
      <h1>Unexpected error</h1>
      <p>{errorMessage}</p>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    id: "root",
    loader: appLoader,
    children: [
      { path: "wiki/", element: <Wiki /> },
      { path: "browse/", element: <Browse /> },
      { path: "login-or-sign-up/", element: <LogInOrSignUp />, children: [
        { path: "login", element: null, action: handleLogin },
        { path: "register-user", element: null, action: handleSignUp }
      ] },
    ],
  },
]);

const container = document.getElementById("App");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
