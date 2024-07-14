import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { v4 } from "uuid";

const server = createServer();
const io = new Server(server);

const port = 8000;

const users: any = {};

const handleMessage = (data: any, uuid: string) => {
  const user = users[uuid];
  user.state = data;
  broadcast();
  console.log(
    `${user.username} updated their state: ${JSON.stringify(user.state)}`
  );
};

const handleClose = (uuid: string) => {
  console.log(`${users[uuid].username} disconnected`);
  delete users[uuid];
  broadcast();
};

const broadcast = () => {
  io.emit("update", users);
};

io.on("connection", (socket: Socket) => {
  const { username } = socket.handshake.query;
  if (typeof username !== "string") {
    socket.disconnect();
    return;
  }
  console.log(`${username} connected`);
  const uuid = v4();
  users[uuid] = {
    username,
    state: {},
  };

  socket.on("message", (data: any) => {
    handleMessage(data, uuid);
  });

  socket.on("disconnect", () => handleClose(uuid));
});

server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});
