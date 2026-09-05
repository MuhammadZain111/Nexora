import { io } from "socket.io-client";

import  axiosInstance  from "@/lib/axios";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});