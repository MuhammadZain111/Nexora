import { io } from "socket.io-client";

const configuredSocketUrl = import.meta.env.VITE_SOCKET_URL;
const isLocalSocketUrl = configuredSocketUrl?.includes("localhost") ||
  configuredSocketUrl?.includes("127.0.0.1");
const SOCKET_URL =
  (import.meta.env.PROD && isLocalSocketUrl ? "" : configuredSocketUrl) ||
  import.meta.env.VITE_API_URL ||
  window.location.origin;


export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["polling", "websocket"],
  timeout: 20000,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});