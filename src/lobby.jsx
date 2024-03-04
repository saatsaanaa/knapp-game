import "./lobby.css";

import React from "react";
import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";
import store from "./store/index";

import Cookies from "js-cookie";

import Lobby from "./javascript/Lobby.jsx";
import Header from "./javascript/Header.jsx";

Cookies.get("id") !== undefined
  ? console.log(Cookies.get("id"))
  : console.log(Cookies.set("id", Date.now()));

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("reactComponentRoot");
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <div class="O_Header">
        <Header />
      </div>

      <Lobby />
    </Provider>
  );
});
