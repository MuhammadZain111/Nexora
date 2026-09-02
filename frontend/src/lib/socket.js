import { io } from "socket.io-client";

import  axiosInstance  from "@/lib/axios";

import { useDispatch } from "react-redux";
import { setUser } from "@/store/authSlice";;

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});