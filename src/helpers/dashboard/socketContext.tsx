import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "../auth/loginHelper";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: any}) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const authToken = localStorage.getItem("auth_token");

    if (!authToken) {
      console.error("Authentication token is missing");
      return;
    }

    const newSocket = io(API_BASE_URL, {
      auth: {
        token: authToken,
      },
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection Error:", err);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
