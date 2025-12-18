type TextInputProps = {
  label: string;
  placeholder: string;
  text: string;
  setText: (v: string) => void;
};

export function TextInput({label, placeholder, text, setText} : TextInputProps) {
  return (
    <div className="relative">
      <label
        htmlFor="password"
        className="absolute left-2 -top-2 bg-white px-1 text-xs text-[#0D0D0DE5] font-plex font-medium"
      >
        {label} *
      </label>

      <input
        id="text"
        type="text"
        value={text}
        onChange={(e) => {
            setText(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 border border-[#0D0D0D1A] rounded-xs focus:outline-none focus:border-blue-500 text-[#030303] text-xs font-medium transition-colors"
      />
    </div>
  );
}
