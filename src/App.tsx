import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAuth } from "@/store/slices/authSlice";
import { ProtectedRoute } from "@/helpers/auth/protectedRoutes";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "./pages/DasboardPage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<div></div>} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
