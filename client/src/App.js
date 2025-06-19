// src/App.js
import React from "react";
import { useRoutes } from "react-router-dom";
import appRoutes from "./routes";

function App() {
  const routes = useRoutes(appRoutes);
  return <div className="main-wrapper">{routes}</div>;
}

export default App;
