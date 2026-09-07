import { io } from "socket.io-client";
import user from "../store/chatSlice";

const socket = io(import.meta.env.SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});


socket.emit("add-user", user._id);

socket.on("online-users", (users) => {
  console.log("Online users:", users);

  dispatch(setOnlineUsers(users));
});

export default socket;