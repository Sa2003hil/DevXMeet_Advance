import React, { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";

// here we are creating a context for the socket

const SocketContext = createContext(null);


// This is the custome hook which will be used to get the socket instance in any component
export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};


export const SocketProvider = (props) => {
  // here useMemo is used so that the socket is not created again and again
  const socket = useMemo(() => io("localhost:8000"), []); // here we are creating a socket connection to the server and port is the port on which the server is running (socket server)

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
