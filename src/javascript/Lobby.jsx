import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  ref,
  onValue,
  onChildAdded,
  update,
  query,
  equalTo,
  orderByChild,
  limitToLast,
} from "firebase/database";
import { db } from "./firebaseConfig.js";
import Cookies from "js-cookie";
import queryString from "query-string";

import { initLobby } from "../store/lobbySlice.js";
import { initUser } from "../store/userSlice.js";

import { processAction } from "./processAction.jsx";

import { createQueue } from "../store/gameSlice.js";

/*Компоненты*/
import PlayersList from "./lobby-components/PlayersList/PlayersList.jsx";
import GameStatusBar from "./lobby-components/GameStatusBar/GameStatusBar.jsx";
import GameProcess from "./lobby-components/GameProcess.jsx";
/**/
import { sendAction } from "./sendAction.jsx";
import Input from "./components/Input/Input.jsx";
import isUserExisting from "./utilities/isUserExisting.jsx";

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

  const isLobbyLoaded = () => {
    if (Object.keys(lobby).length !== 0) {
      return true;
    } else {
      return false;
    }
  };

  if (isLobbyLoaded()) {
    console.log("Загрузили лобби");
  }

  useEffect(() => {
    console.log("Я пошел за данными");
    return onValue(
      ref(db, "lobbies/" + queryString.parse(location.search).id),
      (data) => {
        if (data.exists()) {
          dispatch(
            initLobby({
              ...data.val(),
              lobbyId: queryString.parse(location.search).id,
            })
          );

          //ПРОВЕРЯЕМ
          if (isUserExisting(data.val().players, userId))
            {console.log("Вы есть в списке")}
            else {
              setModalWindow({
                ...modalWindow,
                show: true,
                content: (
                  <>
                    <p className="A_Title large">Присоединиться к лобби</p>
                  </>)
            });
          /*data.val().players.filter((player) => {
            if (userId === player.id) {
              console.log("Вы есть в списке");
              const userData = data.val().players.filter((player) => {
                return userId === player.id;
              });

              if (userData.length !== 0) {
                dispatch(
                  initUser({
                    id: userData[0].id,
                    name: userData[0].name,
                    isHost: userData[0].role === "host",
                    isCurrentPlayer: isCurrentPlayer(),
                  })
                );
              }
            } else {
              setModalWindow({
                ...modalWindow,
                show: true,
                content: (
                  <>
                    <p className="A_Title large">Присоединиться к лобби</p>
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
                          show: true,
                          content: (
                            <>
                              <p className="A_Title medium">
                                Добавляем вас в лобби
                              </p>
                            </>
                          ),
                        });
                      }}
                    >
                      <p className="A_Paragraph large">Придумайте ник</p>
                      <input name="name" size="9" required></input>

                      <button className="A_Button" type="submit">
                        Присоединиться
                      </button>
                    </form>
                  </>
                ),
              });
            }
          });*/
        }
      }
    );
  }, []);

  /**
   *
   * Получаем и обновляем информацию о лобби
   * */
  /*useEffect(() => {
    console.log("Я пошел за данными");
    return onValue(ref(db, "lobbies/" + lobbyId.id), (data) => {
      if (data.exists()) {
        dispatch(initLobby({ ...data.val(), lobbyId: lobbyId.id }));

        //Определяем юзера
        const userData = data.val().players.filter((player) => {
          return userId === player.id;
        });

        const isCurrentPlayer = () => {
          if (
            data.val().stage === "game" &&
            Object.hasOwn(data.val(), "game")
          ) {
            return userData[0].id === data.val().game.currentPlayerId;
          } else return false;
        };

        if (userData.length !== 0) {
          dispatch(
            initUser({
              id: userData[0].id,
              name: userData[0].name,
              isHost: userData[0].role === "host",
              isCurrentPlayer: isCurrentPlayer(),
            })
          );
        } else dispatch(initUser({ id: userId }));

        //
      } else console.log("Такого лобби не существует");
    });
  }, []);*/

  /**
   *
   * Проверяем юзера
   * */
  /*if (Object.keys(lobby).length !== 0) {
    Object.keys(user).length === 1 && sendAction("JOIN_LOBBY", lobby, user);
  }

  /**
   *
   *   Отслеживание экшенов
   * */
  useEffect(() => {
    if (Object.keys(lobby).length !== 0 && user.isHost) {
      return onChildAdded(
        query(
          ref(db, "actions"),
          orderByChild("gameId"),
          equalTo(lobby.lobbyId),
          limitToLast(1)
        ),
        (data) => {
          const action = data.val();
          const actionKey = data.key;
          !action.processed
            ? processAction(action, actionKey, lobby, user)
            : "Экшен уже обработан";
        }
      );
    }
  });

  return (
    <>
      <div className="Lobby">
        {modalWindow.show ? (
          <div className="ModalWindow">
            <div>{modalWindow.content}</div>
          </div>
        ) : (
          ""
        )}

        {Object.keys(lobby).length !== 0 ? (
          <>
            <div className="GameBoard">kzkzkzk</div>
            <div className="LobbyInfo">
              <div className="Info">
                <p>Lobby Id</p>
                <p>Desk name</p>
              </div>
              <div className="GameStatus">
                <p>Очень ждем всех участников ы апривет</p>
                <p>Начать игру</p>
              </div>
              <div className="PlayersList">
                <p>Участники</p>
                <div>
                  <p>Имя 1</p>
                </div>
                <div>
                  <p>Имя 2</p>
                </div>
              </div>
            </div>
            <div className="Menu">
              <p>LOGO</p>
              <p>Правила</p>
              <p>Кнопка</p>
            </div>
          </>
        ) : (
          "Лобби загружается"
        )}
      </div>
    </>
  );
};

export default Lobby;

/*<div className="W_LobbyInfo">
<PlayersList />
<p className="A_Paragraph large">Колода “Познакомимся?”</p>
</div>
<div className="GameBoard">
<GameStatusBar />
<GameProcess />
</div>*/
