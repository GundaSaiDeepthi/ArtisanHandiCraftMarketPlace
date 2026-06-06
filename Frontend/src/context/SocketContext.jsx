import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;

    const socketInstance = io(
      import.meta.env.VITE_API_URL,
      {
        withCredentials: true,
        transports: ["websocket", "polling"],
      }
    );

    socketInstance.on("connect", () => {
      console.log("Socket Connected");
      socketInstance.emit("joinRoom", user._id);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);