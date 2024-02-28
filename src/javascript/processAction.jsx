import { ref, push, child, update, get } from "firebase/database";
import { db } from "./firebaseConfig.js";
import { sendAction } from "./sendAction.jsx";

import { TestCardDecks } from "./TestCardDeck.js";

export const processAction = (action, actionKey, lobby, user) => {
  console.log(action);
  console.log(lobby);

  if (action.actionType === "JOIN_LOBBY") {
    if (
      lobby.players.filter((player) => {
        return player.id === action.actionData.id;
      }).length === 0
    ) {
      console.log("Такого юзера не существует");
      update(
        ref(db, `lobbies/${lobby.lobbyId}/players/${lobby.players.length}`),
        {
          id: action.actionData.id,
          name: action.actionData.name,
          role: "player",
        }
      );
    } else console.log("Такой юзер сущесвует");
    /**
     *
     * START_GAME*/
  } else if (action.actionType === "START_GAME") {
    console.log("Начинаем игру");
    if (lobby.stage === "wait") {
      update(ref(db, `lobbies/${lobby.lobbyId}`), { stage: "game" });
      update(ref(db, `lobbies/${lobby.lobbyId}/game`), {
        currentPlayerId: lobby.players[0].id,
        status: "pick",
        pairs: createCardsPairs(),
      });
    } else console.log("Игра уже началась");

    /**
     *
     * Выбор правды или действия*/
  } else if (action.actionType.includes("PICK")) {
    if (lobby.game.status === "pick") {
      if (action.actionType.includes("TRUE")) {
        console.log("Выбрали правду");
        update(ref(db, `lobbies/${lobby.lobbyId}/game`), { status: "true" });
      } else if (actionType.includes("DARE")) {
        console.log("Выбрали действие");
        update(ref(db, `lobbies/${lobby.lobbyId}/game`), { status: "dare" });
      }
    }

    /**
     *
     * Аппрув хода
     *  */
  } else if (action.actionType === "APPROVE_TURN") {
    if (lobby.game.status === "true" || lobby.game.status === "dare") {
      const newApproveKey = push(
        child(ref(db), `lobbies/${lobby.lobbyId}/game/approves`)
      ).key;

      if (
        lobby.game.approves === undefined ||
        Object.values(lobby.game.approves).filter((approve) => {
          return approve.id === action.playerId;
        }).length === 0
      ) {
        update(
          ref(db, `lobbies/${lobby.lobbyId}/game/approves/${newApproveKey}`),
          {
            id: action.playerId,
            name: lobby.players.filter((player) => {
              return player.id === action.playerId;
            })[0].name,
          }
        ).then(() => {
          get(child(ref(db), `lobbies/${lobby.lobbyId}/game/approves/`)).then(
            (data) => {
              if (data.exists()) {
                console.log(data.val());
                Object.values(data.val()).length === lobby.players.length - 1
                  ? sendAction("PASS_TURN", lobby, user)
                  : console.log("Еще ждем аппрувы");
              }
            }
          );
        });
      } else console.log("Вы уже подтверждали");
    } else console.log("Нечего подтверждать");
    /**
     *
     * Экшена не существует
     * */
  } else if (action.actionType === "PASS_TURN") {
    if (lobby.game.status === "true" || "dare") {
      update(ref(db, `lobbies/${lobby.lobbyId}/game`), {
        status: "PASS_TURN",
        nextCurrentPlayerId: action.actionData.nextCurrentPlayerId,
        previousStatus: lobby.game.status,
      }).then(() => {
        console.log("Начинаю отсчет");
        setTimeout(
          (lobby) => {
            get(child(ref(db), `lobbies/${lobby.lobbyId}/game`)).then(
              (data) => {
                if (data.exists()) {
                  console.log(data.val());
                  update(ref(db, `lobbies/${lobby.lobbyId}/game`), {
                    currentPlayerId: data.val().nextCurrentPlayerId,
                    status: "pick",
                    nextCurrentPlayerId: null,
                    approves: null,
                  });
                }
              }
            );
          },
          10000,
          lobby
        );
      });
    }
  } else console.log(`Экшена ${action.actionType} не существует`);

  update(ref(db, `actions/${actionKey}`), {
    processed: true,
  }).then(() => {
    console.log(`Обработали экшен ${action.actionType}`);
  });
};

export const createCardsPairs = () => {
  let truths = Array(8)
    .fill()
    .map((e, i) => i);

  let dares = Array(8)
    .fill()
    .map((e, i) => i);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));

      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  truths = shuffleArray(truths);
  dares = shuffleArray(dares);

  const pairs = [];
  for (let i = 0; i < 8; i++) {
    pairs.push([truths[0], dares[0]]);
  }

  return pairs;
};

// Если еще не аппрувили

/*if (lobby.game.approves === undefined) {
        update(
          ref(db, `lobbies/${lobby.lobbyId}/game/approves/${newApproveKey}`),
          {
            id: action.playerId,
            name: lobby.players.filter((player) => {
              return player.id === action.playerId;
            })[0].name,
          }
        );

        //Если кто-то уже аппрувил
      } else if (
        Object.values(lobby.game.approves).filter((approve) => {
          return approve.id === action.playerId;
        }).length === 0
      ) {
        update(
          ref(db, `lobbies/${lobby.lobbyId}/game/approves/${newApproveKey}`),
          {
            id: action.playerId,
            name: lobby.players.filter((player) => {
              return player.id === action.playerId;
            })[0].name,
          }
        ).then(() => {
          Object.values(lobby.game.approves).length === lobby.players.length - 1
            ? sendAction("PASS_TURN", lobby, user)
            : console.log("Еще ждем аппрувы");
        });*/

//Ответ подтвердили все
/*if (
        Object.hasOwn(lobby.game, "approves") &&
        Object.values(lobby.game.approves).length === lobby.players.length - 1
      ) {
        sendAction("PASS_TURN", lobby, user);
      } else console.log("Еще ждем аппрувы");*/
