import { useState } from "react";
import { PasswordInput } from "./inputPassword";
import { TextInput } from "./inputText";
import { login } from "../../helpers/auth/loginHelper";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader } from "../loader";

export const LoginForm = () => {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    // Validate email
    if (!email) {
      setError("Email is required.");
      setLoading(false);
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // Validate password
    if (!password) {
      setError("Password is required.");
      setLoading(false);
      return;
    } else if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      await login(dispatch, email, password);
      navigate("/dashboard/overview");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-6 gap-5.5">
      <TextInput
        label="LogIn"
        placeholder="Email"
        text={email}
        setText={setEmail}
      />
      <PasswordInput
        label="Password"
        placeholder="Password"
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
      <div className="flex flex-col gap-1">
      <button
        type="submit"
        disabled={loading}
        className={`w-full h-10.5 flex items-center justify-center rounded-lg bg-[#009490] text-white font-plex font-normal ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        {loading ? <Loader height={20} width={20} color="#ffffff" /> : "Login"}
      </button>
      {error !== "" ? <p className="font-medium text-xs text-red-800">{error}</p> : <></>}
      </div>
    </form>
  );
};
