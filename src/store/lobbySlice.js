import { createSlice } from '@reduxjs/toolkit'

const lobbySlice = createSlice({
  name: 'lobby',
  initialState: {
    lobby: {}
  },
  reducers: {
    initLobby(state, action) {
      state.lobby = action.payload
      console.log('Создали лобби:')
      console.log(state.lobby)
    }
  }
})

export const { initLobby } = lobbySlice.actions

export default lobbySlice.reducer
