type PasswordInputProps = {
  label: string;
  placeholder: string;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
};

export function PasswordInput({
  label,
  placeholder,
  password,
  setPassword,
  showPassword,
  setShowPassword,
}: PasswordInputProps) {
  const displayValue = showPassword ? password : "*".repeat(password.length);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (showPassword) {
      setPassword(input);
      return;
    }
    if (input.length < password.length) {
      setPassword(password.slice(0, input.length));
    } else if (input.length > password.length) {
      const added = input.slice(password.length);
      const realAdded = added.replace(/\*/g, "");
      setPassword(password + realAdded);
    }
  };

  return (
    <div className="relative">
      <label
        htmlFor="password"
        className="absolute left-2 -top-2 bg-white px-1 text-xs text-[#0D0D0DE5] font-plex font-medium"
      >
        {label} *
      </label>

      <input
        id="password"
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full px-3 py-2.5 pr-12 border border-[#0D0D0D1A] rounded-xs focus:outline-none focus:border-blue-500 text-[#030303] text-xs font-medium transition-colors"
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        <img src="/login/eye.svg" className="h-5 w-5" alt="eye" />
      </button>
    </div>
  );
}
