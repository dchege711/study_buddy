import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { store } from "./Store";
import { LogInOrSignUp } from "../../src/app/login/page";
import { App } from "./app/App";
import Generic5XX from "./components/errors/Generic5XX";
import { Wiki } from "./components/wiki/Wiki";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App isLoggedIn={true}/>,
        errorElement: <Generic5XX />,
        children: [
            {
                path: "login",
                element: <LogInOrSignUp />,
            },
            {
                path: "wiki",
                element: <Wiki />,
            }
        ],
    }
]);

const container = document.getElementById("App");
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>
);
