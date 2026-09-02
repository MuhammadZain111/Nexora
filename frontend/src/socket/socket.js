import { io } from "socket.io-client";
import user from "../store/chatSlice";

const socket = io("http://localhost:3001");


socket.emit("add-user", user._id);

socket.on("online-users", (users) => {
  console.log("Online users:", users);

  dispatch(setOnlineUsers(users));
});

export default socket;