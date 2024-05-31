import React, { useState } from "react";

import Cookies from "js-cookie";

import { db } from "./firebaseConfig.js";
import { ref, child, push, update } from "firebase/database";

import { Copy } from "lucide-react";

import Button from "./components/Button/Button.jsx";
import Logo from "../imgs/knapp-logo.svg";
import ModalWindow from "./components/ModalWindow/ModalWindow.jsx";
import Input from "./components/Input/Input.jsx";

const Header = () => {
  Cookies.get("id") !== undefined
    ? console.log(Cookies.get("id"))
    : console.log(Cookies.set("id", Date.now()));

  const decksList = [
    {
      id: 1,
      name: "Deck #1",
      description:
        "Длинное или не очень описание колоды, темы вопросов и действий.",
    },
    {
      id: 2,
      name: "Deck #2",
      description:
        "Длинное или не очень описание колоды, темы вопросов и действий.",
    },
    {
      id: 3,
      name: "Deck #3",
      description:
        "Длинное или не очень описание колоды, темы вопросов и действий.",
    },
    {
      id: 4,
      name: "Deck #4",
      description:
        "Длинное или не очень описание колоды, темы вопросов и действий.",
    },
  ];

  const [modalWindow, setModalWindow] = useState({
    show: false,
    content: "Пусто",
  });

  function chAge() {
    setAge(1);
    console.log(age);
  }

  return (
    <>
      <a href="/">
        <img src={Logo} alt="" />
      </a>

      <div className="LinkGroup">
        <a href="/">Колоды</a>
        <a href="/">Правила игры</a>
        <a href="/">О проекте</a>
      </div>

      <Button
        onClick={() => {
          console.log("Привет");
          setModalWindow({
            show: true,
          });
        }}
      >
        Начать игру
      </Button>

      {modalWindow.show && (
        <ModalWindow>
          <CreateLobbyModalWindow decksList={decksList} />
        </ModalWindow>
      )}
    </>
  );
};

export default Header;

/**
 *
 *
 * МОДАЛЬНОЕ ОКНО СОЗДАНИЯ ИГРЫ
 */

export const CreateLobbyModalWindow = ({ decksList }) => {
  const [selectedDeck, setSelectedDeck] = useState(0);
  const [deckSelected, setDeckSelected] = useState(false);

  const newLobbyKey = push(child(ref(db), "lobbies")).key;
  console.log(newLobbyKey);

  function getLobbyKey() {}

  if (!deckSelected) {
    return (
      <form>
        <p className="Title-1">Создаем лобби</p>
        <p className="Headline">Выберите колоду</p>
        <div className="DeckContainer">
          {decksList.map((deck) => {
            return (
              <div
                className={`Deck${selectedDeck == deck.id ? " selected" : ""}`}
                key={deck.id}
                onClick={() => {
                  console.log("Привет");
                  setSelectedDeck(deck.id);
                  console.log(selectedDeck);
                }}
              >
                <div className="deck-background">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
                    <div className={"rectangle-" + n}></div>
                  ))}
                </div>
                <div className="deck-content">
                  <p className="Headline">{deck.name}</p>
                  <p className="Body-1">{deck.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          disabled={selectedDeck === 0}
          onClick={() => setDeckSelected(true)}
        >
          Продолжить
        </Button>
      </form>
    );
  } else {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const playerName = Object.fromEntries(
            new FormData(e.target).entries()
          ).name;

          update(ref(db, `lobbies/${newLobbyKey}`), {
            hostId: Cookies.get("id"),
            stage: "wait",
            deckId: 0,
            players: [
              {
                name: playerName,
                id: Cookies.get("id"),
                role: "host",
              },
            ],
          }).then(() => {
            document.location.href = `./pages/lobby.html?id=${newLobbyKey}`;
          });
        }}
      >
        <p className="A_Title large">Пригласить игроков</p>
        <p className="A_Paragraph large">Ссылка-приглашение</p>
        <Button
          appearance="copy"
          onClick={() => {
            navigator.clipboard
              .writeText(
                window.location.href + "/pages/lobby.html?id=" + newLobbyKey
              )
              .then(() => console.log("Done!"))
              .catch((err) => console.error(err));
          }}
        >
          {window.location.href + "pages/lobby.html?id=" + newLobbyKey}
          <Copy />
        </Button>
        <p className="A_Paragraph large">Придумайте себе ник</p>
        <Input name={"name"} required={true} maxLength="10">
          Например: Енот228
        </Input>
        <Button type={"submit"} onClick={() => {}}>
          Перейти в лобби
        </Button>
      </form>
    );
  }
};
