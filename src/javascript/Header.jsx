import React, { useMemo, useState } from "react";

import Cookies from "js-cookie";

import { db } from "./firebaseConfig.js";
import { ref, child, push, update, set } from "firebase/database";

import { Copy, X } from "lucide-react";

import Button from "./components/Button/Button.jsx";
import Logo from "../imgs/knapp-logo.svg";
import ModalWindow from "./components/ModalWindow/ModalWindow.jsx";
import Input from "./components/Input/Input.jsx";
import Deck from "./components/Deck.jsx";

const Header = () => {
  Cookies.get("id") !== undefined
    ? console.log(Cookies.get("id"))
    : console.log(Cookies.set("id", Date.now()));

  const decksList = [
    {
      id: 1,
      name: "Познакомимся?",
      description: "Узнать друг друга, не нарушая личных границ",
    },
    {
      id: 2,
      name: "Давно знакомы",
      description: "Проверить, как хорошо тебя знает твой бро.",
    },
    {
      id: 3,
      name: "Заново завоевать",
      description: "Разговоры тет-а-тет до утра",
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
          <CreateLobbyModalWindow
            decksList={decksList}
            onClose={() =>
              setModalWindow({
                show: false,
                content: "Пусто",
              })
            }
          />
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

export const CreateLobbyModalWindow = ({ decksList, onClose }) => {
  const [selectedDeck, setSelectedDeck] = useState(0);
  const [deckSelected, setDeckSelected] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const newLobbyKey = useMemo(() => push(child(ref(db), "lobbies")).key, [db]);
  console.log(newLobbyKey);

  if (!deckSelected) {
    return (
      <form>
        <div className="modal-header">
          <X onClick={() => onClose()} size={32} />
        </div>
        <p className="Title-1">Создаем лобби</p>
        <p className="Headline">Выберите колоду</p>
        <div className="DeckContainer">
          {decksList.map((deck, index) => {
            return (
              <Deck
                key={index}
                isSelected={selectedDeck === deck.id ? true : false}
                onClick={() => {
                  setSelectedDeck(deck.id);
                  console.log(selectedDeck);
                }}
              >
                {console.log(selectedDeck)}
                <p className="Headline">{deck.name}</p>
                <p className="Body-1">{deck.description}</p>
              </Deck>
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
                bonuses: 0,
              },
            ],
          }).then(() => {
            document.location.href = `./pages/lobby.html?id=${newLobbyKey}`;
          });
        }}
      >
        <p className="Title-1">Пригласить игроков</p>
        <p className="Headline">Ссылка-приглашение</p>
        <Button
          appearance={!linkCopied ? "neutral" : "neutral active"}
          onClick={() => {
            navigator.clipboard
              .writeText(
                window.location.href + "pages/lobby.html?id=" + newLobbyKey
              )
              .then(() => {
                console.log("Done!");
                setLinkCopied(true);
                setTimeout(() => {
                  setLinkCopied(false);
                }, 1000);
              })
              .catch((err) => console.error(err));
          }}
        >
          {!linkCopied ? "lobby" + newLobbyKey : "Ссылка успешно скопирована"}
          <Copy />
        </Button>
        <p className="Headline">Придумайте себе ник</p>
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
