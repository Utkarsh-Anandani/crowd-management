import type { AppDispatch } from "@/store";
import { clearAuth, setAuthed } from "@/store/slices/authSlice";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function login(dispatch: AppDispatch, email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const err = (await res.json()) as { errorMessage: string };
    throw new Error(err.errorMessage)
  }

  const data = (await res.json()) as { token: string }

  dispatch(setAuthed({token: data.token}))
}

export function logout(dispatch: AppDispatch) {
  dispatch(clearAuth())
}
