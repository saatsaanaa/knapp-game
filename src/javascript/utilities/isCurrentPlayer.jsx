import React from "react";

const isCurrentPlayer = (lobby, userId) => {
  if (lobby.stage === "game") {
    console.log(lobby.game.currentPlayerId);
    console.log(userId);
    return lobby.game.currentPlayerId === userId;
  } else return false;
};

export default isCurrentPlayer;
