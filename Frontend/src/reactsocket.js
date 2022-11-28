import {io} from "socket.io-client";

//const URL = "http://localhost:8080";
const socket = io('http://localhost:8080', {
    autoConnect: false,
    path: "/api/chat"
});

// socket.onAny((event, ...args) => {
//   console.log(event, args);
// });

export default socket;