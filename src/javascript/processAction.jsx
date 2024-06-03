import { ref, push, child, update, get } from "firebase/database";
import { db } from "./firebaseConfig.js";
import { sendAction } from "./sendAction.jsx";
import { getCardPair } from "./airtableConfig.js";

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
          bonuses: 0,
        }
      );
    } else console.log("Такой юзер сущесвует");
    /**
     *
     * START_GAME*/
  } else if (action.actionType === "START_GAME") {
    console.log("Начинаем игру");
    if (lobby.stage === "wait") {
      const pairs = createCardsPairs();

      getCardPair(pairs[0][0], pairs[0][1]).then((cards) => {
        console.log(cards);

        update(ref(db, `lobbies/${lobby.lobbyId}`), {
          ...lobby,
          stage: "game",
          game: {
            currentPlayerId: lobby.players[0].id,
            status: "pick",
            currentPair: [0, cards.truth, cards.dare],
            pairs: pairs,
          },
        });
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
      } else if (action.actionType.includes("DARE")) {
        console.log("Выбрали действие");
        update(ref(db, `lobbies/${lobby.lobbyId}/game`), { status: "dare" });
      }
    } else if (lobby.game.status === "true") {
      if (action.actionType.includes("DARE")) {
        console.log("Сменили правду на действие");
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
      //Если выбрана правда или выбрано действие
      //Апдейтим статус
      //Выбираем след. игрока
      //Запоминаем, что выбирал предыдущий игрок
      update(ref(db, `lobbies/${lobby.lobbyId}/game`), {
        status: "PASS_TURN",
        nextCurrentPlayerId: action.actionData.nextCurrentPlayerId,
        previousStatus: lobby.game.status,
      }).then(() => {
        //Посде обновления включаем таймер
        console.log("Начинаю отсчет");
        setTimeout(
          (lobby) => {
            //Забираем оправленные перед этим данные
            get(child(ref(db), `lobbies/${lobby.lobbyId}/game`)).then(
              (data) => {
                if (data.exists()) {
                  console.log(lobby.game);
                  const nextCurrentPair = lobby.game.currentPair[0] + 1;
                  console.log(nextCurrentPair);

                  if (nextCurrentPair < 8) {
                    getCardPair(
                      lobby.game.pairs[nextCurrentPair][0],
                      lobby.game.pairs[nextCurrentPair][1]
                    ).then((cards) => {
                      update(ref(db, `lobbies/${lobby.lobbyId}/game`), {
                        currentPlayerId: data.val().nextCurrentPlayerId,
                        status: "pick",
                        nextCurrentPlayerId: null,
                        approves: null,
                        previousStatus: null,
                        currentPair: [nextCurrentPair, cards.truth, cards.dare],
                      });
                    });
                  } else {
                    update(ref(db, `lobbies/${lobby.lobbyId}`), {
                      game: null,
                      stage: "end",
                    });
                  }
                }
              }
            );
          },
          30000,
          lobby
        );
      });
    }
  } else if (action.actionType.includes("DELETE_USER")) {
    //
    //
    //----------Новый список игроков----------
    let newPlayersList = lobby.players.map((player) => {
      if (player.id === action.actionData.deleteUser) {
        return { id: player.id, role: "deleted", bonuses: null, name: null };
      } else {
        return player;
      }
    });

    //----------Новый стейдж игры----------
    const newStage = () => {
      if (
        newPlayersList.filter((player) => {
          return player.role !== "deleted";
        }).length < 2 &&
        lobby.stage === "game"
      ) {
        return "end_no-user";
      } else return lobby.stage;
    };

    //----------Новый curPlayerId----------
    const newCurrentPlayerId = () => {
      if (newStage() !== "end_no-user" && lobby.stage === "game") {
        if (
          lobby.game.status === "pick" ||
          lobby.game.status === "true" ||
          lobby.game.status === "dare"
        ) {
          if (lobby.game.currentPlayerId === action.actionData.deleteUser) {
            let index =
              lobby.players.findIndex((player) => {
                return player.id === lobby.game.currentPlayerId;
              }) + 1;
            if (lobby.players.length <= index) index = 0;

            return lobby.players[index].id;
          } else return lobby.game.currentPlayerId;
        } else return lobby.game.currentPlayerId;
      } else return null;
    };

    //----------Новый curPair----------
    const newCurrentPair = () => {
      if (newStage() !== "end_no-user" && lobby.stage === "game") {
        if (lobby.game.status === "true" || lobby.game.status === "dare") {
          if (lobby.game.currentPlayerId === action.actionData.deleteUser) {
            const newPair = lobby.game.currentPair[0] + 1;
            if (newPair < 8) {
              getCardPair(
                lobby.game.pairs[newPair][0],
                lobby.game.pairs[newPair][1]
              ).then((cards) => {
                console.log([newPair, cards.truth, cards.dare]);
                return [newPair, cards.truth, cards.dare];
              });
            }
          } else return lobby.game.currentPair;
        } else return lobby.game.currentPair;
      } else return null;
    };

    //----------Новый статус игры----------
    const newGameStatus = () => {
      if (newStage() !== "end_no-user" && newStage() === "game") {
        if (lobby.game.status === "true" || lobby.game.status === "dare") {
          if (lobby.game.currentPlayerId === action.actionData.deleteUser) {
            return "pick";
          } else return lobby.game.status;
        } else return lobby.game.status;
      } else return null;
    };

    if (newStage() === "end_no-user") {
      update(ref(db, `lobbies/${lobby.lobbyId}`), {
        players: newPlayersList,
        stage: "end_no-user",
        game: null,
      });
    } else if (lobby.stage === "game") {
      if (lobby.game.currentPlayerId === action.actionData.deleteUser) {
        if (lobby.game.status === "true" || lobby.game.status === "dare") {
          const newPair = lobby.game.currentPair[0] + 1;
          if (newPair < 8) {
            getCardPair(
              lobby.game.pairs[newPair][0],
              lobby.game.pairs[newPair][1]
            ).then((cards) => {
              console.log([newPair, cards.truth, cards.dare]);
              update(ref(db, `lobbies/${lobby.lobbyId}`), {
                players: newPlayersList,
                game: {
                  ...lobby.game,
                  status: newGameStatus(),
                  currentPlayerId: newCurrentPlayerId(),
                  currentPair: [newPair, cards.truth, cards.dare],
                },
              });
            });
          }
        } else {
          update(ref(db, `lobbies/${lobby.lobbyId}`), {
            players: newPlayersList,
            game: {
              ...lobby.game,
              currentPlayerId: newCurrentPlayerId(),
            },
          });
        }
      } else
        update(ref(db, `lobbies/${lobby.lobbyId}`), {
          players: newPlayersList,
        });
    } else
      update(ref(db, `lobbies/${lobby.lobbyId}`), {
        players: newPlayersList,
      });

    console.log(newPlayersList);

    console.log(newStage());

    console.log(newCurrentPlayerId());

    console.log(newCurrentPair());

    console.log(newGameStatus());

    /*update(ref(db, `lobbies/${lobby.lobbyId}`), { ...newPlayersList }).then(
      () => {
        console.log("Обновил список игроков");

        get(child(ref(db), `lobbies/${lobby.lobbyId}/players`)).then((data) => {
          if (data.exists()) {
            if (
              data.val().filter((player) => {
                return player.role !== "deleted";
              }).length < 2
            ) {
              update(ref(db, `lobbies/${lobby.lobbyId}`), {
                stage: "end_no-user",
                game: null,
              });
            } else if (lobby.stage === "game") {
              //
              //
              //Если сейчас статус игры -- выбор карты
              if (lobby.game.status === "pick") {
                //И ходит игрок, которого хотят удалить
                if (
                  lobby.game.currentPlayerId === action.actionData.deleteUser
                ) {
                  //
                  //Обновляем айди игрока, который ходит
                  let index =
                    lobby.players.findIndex((player) => {
                      return player.id === lobby.game.currentPlayerId;
                    }) + 1;
                  if (lobby.players.length <= index) index = 0;

                  //
                  //Отправляем айди нового curPlayer
                  update(ref(db, `lobbies/${lobby.lobbyId}/game`), {
                    currentPlayerId: lobby.players[index].id,
                  });
                }
              }
              // Если карта уже выбрана
              else if (
                lobby.game.status === "true" ||
                lobby.game.status === "dare"
              ) {
                //И ходит игрок, которого хотят удалить
                if (
                  lobby.game.currentPlayerId === action.actionData.deleteUser
                ) {
                  //
                  //Обновляем айди игрока, который ходит
                  let index =
                    lobby.players.findIndex((player) => {
                      return player.id === lobby.game.currentPlayerId;
                    }) + 1;
                  if (lobby.players.length <= index) index = 0;

                  //
                  //Выбираем следующую пару
                  const newCurrentPair = lobby.game.currentPair[0] + 1;
                  if (newCurrentPair < 8) {
                    getCardPair(
                      lobby.game.pairs[newCurrentPair][0],
                      lobby.game.pairs[newCurrentPair][1]
                    ).then((cards) => {
                      //Отправляем новые данные об игре
                      update(ref(db, `lobbies/${lobby.lobbyId}/game`), {
                        currentPlayerId: lobby.players[index].id,
                        currentPair: [newCurrentPair, cards.truth, cards.dare],
                        status: "pick",
                      });
                    });
                  }
                }
              }
            }
          }
        });
      }
    );*/

    /*
        if (lobby.game.status === "true" || lobby.game.status === "dare") {
          const newCurrentPair = lobby.game.currentPair[0] + 1;
          let currentPair;

          if (newCurrentPair < 8) {
            getCardPair(
              lobby.game.pairs[newCurrentPair][0],
              lobby.game.pairs[newCurrentPair][1]
            ).then((cards) => {
              currentPair = [newCurrentPair, cards.truth, cards.dare];
              newData = {
                ...newData,
                game: {
                  currentPlayerId: newData.game.currentPlayerId,
                  approves: null,
                  status: "pick",
                  currentPair: currentPair,
                },
              };
              update(ref(db, `lobbies/${lobby.lobbyId}`), { ...newData });
            });
          }
        } else update(ref(db, `lobbies/${lobby.lobbyId}`), { ...newData });
      }
    }*/

    /*update(ref(db, `lobbies/${lobby.lobbyId}`), newData);*/
  } else if (action.actionType === "RESTART_GAME") {
    update(ref(db, `lobbies/${lobby.lobbyId}`), {
      stage: "wait",
    });
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
    pairs.push([truths[i], dares[i]]);
  }

  return pairs;
};
