export const isCurrentPlayer = (lobby, user) => {
  return user.id === lobby.game.currentPlayerId;
};

export const isHost = (lobby, user) => {
  return user.id === lobby.hostId;
};

export const isStatus = (whatNeed, lobby) => {
  return lobby.game.status === whatNeed;
};
