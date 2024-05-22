import React from "react";

const isCurrentPlayer = () => {
  if (data.val().stage === "game" && Object.hasOwn(data.val(), "game")) {
    return userData[0].id === data.val().game.currentPlayerId;
  } else return false;
};

export default isCurrentPlayer;
