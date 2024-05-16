import { createSlice } from "@reduxjs/toolkit";

const lobbySlice = createSlice({
  name: "lobby",
  initialState: {
    lobby: {
      id: "none",
    },
  },
  reducers: {
    initLobby(state, action) {
      state.lobby = action.payload;
      console.log("Инициировали лобби:");
      console.log(state.lobby);
    },
    updatePlayers(state, action) {},
  },
});

export const { initLobby } = lobbySlice.actions;

export default lobbySlice.reducer;
