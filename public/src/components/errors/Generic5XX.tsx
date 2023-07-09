import React from "react";
import { useRouteError } from "react-router-dom";

interface RouterError {
  error: Error;
  data: string;
  internal: boolean;
  status: number;
  statusText: string;
}

export default function Generic5XX() {
  const error = useRouteError() as RouterError;
  console.error(error);

  return (
    <div style={{ margin: "5% 20% 10% 20%" }}>
      <h1>
        {error.status} {error.statusText}
      </h1>
      <p>{error.data}</p>
    </div>
  );
}
