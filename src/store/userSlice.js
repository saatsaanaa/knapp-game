import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {}
  },
  reducers: {
    initUser(state, action) {
      state.user = action.payload
      console.log('Создали игрока:')
      console.log(state.user)
    }
  }
})

export const { initUser } = userSlice.actions

export default userSlice.reducer
