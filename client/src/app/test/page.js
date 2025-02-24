import { io } from "socket.io-client";

// Connect to the server
const socket = io("http://localhost:6000", { withCredentials: true });

// Listen for connection
socket.on("connect", () => {
  console.log("Connected to Socket.IO server:", socket.id);

  // Send a message to the server
  socket.emit("message", "Hello from client");
});

// Listen for messages from the server
socket.on("message", (data) => {
  console.log("Message from server:", data);
});

// Handle disconnection
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
