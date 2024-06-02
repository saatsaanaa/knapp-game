import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Cookies from "js-cookie";
import queryString from "query-string";

import { initUser } from "../store/userSlice.js";

import { processAction } from "./processAction.jsx";

import { createQueue } from "../store/gameSlice.js";

/*Иконки */

/*Компоненты*/
import PlayersList from "./components/PlayersList/PlayersList.jsx";
/**/
import { sendAction } from "./sendAction.jsx";
import Input from "./components/Input/Input.jsx";
import isUserExisting from "./utilities/isUserExisting.jsx";
import LoadingLobby from "./utilities/LoadingLobby.jsx";
import isCurrentPlayer from "./utilities/isCurrentPlayer.jsx";
import HostPixel from "./utilities/HostPixel.jsx";
import GameStatus from "./components/GameStatus/GameStatus.jsx";
import { Link } from "lucide-react";
import GameBoard from "./components/GameBoard/GameBoard.jsx";
import Button from "./components/Button/Button.jsx";
import ModalWindow from "./components/ModalWindow/ModalWindow.jsx";

/**
 * ЛОББИ
 * */
const Lobby = () => {
  const [modalWindow, setModalWindow] = useState({
    show: false,
    content: "Пусто",
  });

  const lobby = useSelector((state) => state.lobby.lobby);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  /** Получаем юзера из кук */
  const userId = Cookies.get("id");

  useEffect(() => {
    if (isUserExisting(lobby.players, userId)) {
      dispatch(
        initUser({
          ...lobby.players.filter((player) => {
            return player.id === userId;
          })[0],
          isCurrentPlayer: isCurrentPlayer(lobby, userId),
        })
      );
    } else {
      if (
        lobby.deletedPlayers.filter((player) => {
          return player.id === userId;
        }).length > 0
      ) {
        setModalWindow({
          show: true,
          content: (
            <>
              <p className="Title-1">Вас удалили из лобби</p>
              <p className="Body-1">Вы больше не сможете присоединиться</p>
            </>
          ),
        });
      } else
        setModalWindow({
          show: true,
          content: (
            <>
              <p className="Title-1">Присоединиться к лобби</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const data = new FormData(e.target);
                  const formJson = Object.fromEntries(data.entries());
                  console.log(formJson);
                  sendAction(
                    "JOIN_LOBBY",
                    { lobbyId: queryString.parse(location.search).id },
                    { id: userId, name: formJson.name }
                  );
                  setModalWindow({
                    show: false,
                    content: <>{location.reload()}</>,
                  });
                }}
              >
                <p className="Headline">Придумайте ник</p>
                <input name="name" size="9" required></input>

                <button className="A_Button" type="submit">
                  Присоединиться
                </button>
              </form>
            </>
          ),
        });
    }
  }, [lobby]);

  return (
    <>
      <div className="Lobby">
        {modalWindow.show ? (
          <ModalWindow>
            <div>{modalWindow.content}</div>
          </ModalWindow>
        ) : (
          ""
        )}
        <GameBoard />
        <div className="LobbyInfo">
          <div className="Info">
            <p className="Body-2">
              Лобби #{queryString.parse(location.search).id}
            </p>

            <p className="Body-2">Колода "Познакомимся?"</p>
          </div>
          <GameStatus />
          <PlayersList></PlayersList>
        </div>
        <div className="Menu">
          <div className="logo" />
          <p className="link">Правила</p>
          <Button
            appearance={"neutral"}
            onClick={() => (document.location.href = "../index.html")}
          >
            Покинуть игру
          </Button>
        </div>
      </div>
      {user.role === "host" ? <HostPixel /> : console.log("Не хост")}
    </>
  );
};

export default Lobby;
