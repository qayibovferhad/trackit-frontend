import { io } from "socket.io-client";

// ⚡ backend port 5500
const socket = io("http://localhost:5500", {
  transports: ["websocket", "polling"]
});

export default socket;
