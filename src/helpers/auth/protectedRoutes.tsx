import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

export function ProtectedRoute() {
  const isAuthed =
    useSelector((s: RootState) => s.auth.isAuthed) ||
    localStorage.getItem("auth_token");
  return isAuthed ? <Outlet /> : <Navigate to="/login" replace />;
}
