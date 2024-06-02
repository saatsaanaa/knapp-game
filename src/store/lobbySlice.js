import { createSlice } from "@reduxjs/toolkit";

const lobbySlice = createSlice({
  name: "lobby",
  initialState: {
    lobby: {},
  },
  reducers: {
    initLobby(state, action) {
      console.log(action.payload);
      state.lobby = {
        ...action.payload,
        players: action.payload.players.filter((player) => {
          return player.role !== "deleted";
        }),
        deletedPlayers: action.payload.players.filter((player) => {
          return player.role === "deleted";
        }),
      };
      console.log("Создали лобби:");
      console.log(state.lobby);
    },
  },
});

export const { initLobby } = lobbySlice.actions;

export default lobbySlice.reducer;
