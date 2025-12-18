import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  isAuthed: boolean;
  token: string | null;
};

const initialState: AuthState = {
  isAuthed: false,
  token: localStorage.getItem("auth_token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthed(state, action: PayloadAction<{ token: string }>) {
      state.isAuthed = true;
      state.token = action.payload.token;

      localStorage.setItem("auth_token", action.payload.token);
    },
    clearAuth(state) {
      state.isAuthed = false;
      state.token = null;

      localStorage.removeItem("auth_token");
    },
    initializeAuth(state) {
      const token = localStorage.getItem("auth_token")
      if (token) {
        state.isAuthed = true
        state.token = token
      }
    },
  },
});

export const { setAuthed, clearAuth, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
