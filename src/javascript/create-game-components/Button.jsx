import React, { useEffect, useState } from "react";
import "../../stylesheets/modal.scss";
import Cookies from "js-cookie";

import { db } from "../firebaseConfig";
import { ref, get, child, push, update, onValue } from "firebase/database";

const Button = () => {
  /*Проверяем наличие айди юзера*/
  Cookies.get("id") !== undefined
    ? console.log(Cookies.get("id"))
    : console.log(Cookies.set("id", Date.now()));

  return (
    <>
      <button
        className="A_Button"
        onClick={() => {
          /* Создаем новую комнату*/
          const newLobbyKey = push(child(ref(db), "lobbies")).key;
          console.log(newLobbyKey);

          update(ref(db, `lobbies/${newLobbyKey}`), {
            hostId: Cookies.get("id"),
            stage: "wait",
            deckId: 0,
            players: [
              {
                name: "Настя",
                id: Cookies.get("id"),
                role: "host",
              },
            ],
          }).then(() => {
            document.location.href = `./pages/lobby.html?id=${newLobbyKey}`;
          });
        }}
      >
        Начать игру
      </button>
    </>
  );
};

export default Button;
