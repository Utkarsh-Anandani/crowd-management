import { LoginForm } from "../components/login/loginForm";

const LoginPage = () => {
  return (
    <main
      className="min-h-screen w-full bg-center bg-cover flex items-center justify-center p-4 sm:p-6 md:p-8"
      style={{
        backgroundImage:
          "linear-gradient(#00000066, #00000066), url('/login/bg-image.png')",
      }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-24 xl:gap-32 2xl:gap-80.5 w-full max-w-7xl">
        <h1 className="font-plex text-2xl sm:text-3xl md:text-4xl lg:text-[32px] font-semibold text-white leading-tight sm:leading-snug md:leading-10 tracking-wide text-center lg:text-left">
          Welcome to the
          <br />
          Crowd Management System
        </h1>
        <div className="flex flex-col w-full max-w-sm sm:max-w-md md:max-w-lg lg:w-90 rounded-lg bg-white shadow-2xl">
          <div
            className="w-full h-32 sm:h-36 md:h-40 lg:h-27.25 bg-center bg-cover flex items-center justify-center rounded-t-lg"
            style={{
              backgroundImage: "url('/login/banner.png')",
            }}
          >
            <img 
              src="/login/logo.png" 
              alt="logo" 
              className="max-w-[60%] sm:max-w-[70%] md:max-w-[80%] h-auto object-contain"
            />
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
};

export default LoginPage;