export const joinLobby = (id) => {
  return {
    name: ("Player" + id).slice(0, 10),
    id: id,
  };
};
