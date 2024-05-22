import React from "react";

const isUserExisting = (players, id) => {
  return (
    players.filter((player) => {
      return player.id === id;
    }).length === 1
  );
};

export default isUserExisting;
