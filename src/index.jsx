import "./index.css";

import React from "react";
import { createRoot } from "react-dom/client";

import Header from "./javascript/components/Header/Header.jsx";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("reactCreateHeaderRoot");
  const root = createRoot(container);
  root.render(<Header />);
});
