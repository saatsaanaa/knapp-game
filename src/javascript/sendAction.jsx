import { ref, update, push, child } from "firebase/database";
import { db } from "./firebaseConfig";

export const sendAction = (actionType, lobby, user) => {
  const newActionKey = push(child(ref(db), "actions")).key;

  let actionData = {};

  console.log(actionType);

  /**
   *
   *
   * Добавить игрока в лобби
   */
  if (actionType === "JOIN_LOBBY") {
    actionData = {
      name: ("Player" + user.id).slice(0, 10),
      id: user.id,
    };
    /**
     *
     *
     * Начать игру
     */
  } else if (actionType === "START_GAME") {
    actionData = {};
    /**
     *
     *
     * Выбор правды или действия
     */
  } else if (actionType.includes("PICK")) {
    if (user.id === lobby.game.currentPlayerId) {
      actionData = {};
    } else console.log("Сейчас не ваш ход");
    /**
     *
     *
     * Подтверждение хода
     */
  } else if (actionType === "APPROVE_TURN") {
    actionData = {};
    /**
     *
     *
     * action PASS_TURN
     */
  } else if (actionType === "PASS_TURN") {
    const nextCurrentPlayerIndex = () => {
      let index =
        lobby.players.findIndex((player) => {
          return player.id === lobby.game.currentPlayerId;
        }) + 1;
      if (lobby.players.length <= index) {
        return 0;
      } else return index;
    };
    actionData = {
      nextCurrentPlayerId: lobby.players[nextCurrentPlayerIndex()].id,
    };
    /**
     *
     *
     * Если не опознали экшен
     */
  } else console.log(`Экшена ${actionType} не существует`);

  update(ref(db, `actions/${newActionKey}`), {
    gameId: lobby.lobbyId,
    playerId: user.id,
    actionType: actionType,
    actionData,
    processed: false,
  });
};
