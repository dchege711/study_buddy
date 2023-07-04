import React from "react";
import { createRoot } from "react-dom/client"

function App() {
  return (
    <div className="App">
      <h1>Hello World!</h1>
    </div>
  );
}

const container = document.getElementById("App");
const root = createRoot(container!);
root.render(<React.StrictMode><App /></React.StrictMode>);
