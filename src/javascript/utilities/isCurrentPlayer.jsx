import React from "react";

const isCurrentPlayer = (stage) => {
  if (stage === "game") {
    return userData[0].id === data.val().game.currentPlayerId;
  } else return false;
};

export default isCurrentPlayer;
