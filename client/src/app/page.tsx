"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import throttle from "lodash.throttle";
import { Cursor } from "@/components/Cursor";

const socket = io("http://localhost:8000");

const THROTTLE = 300;

type Position = {
  x: number;
  y: number;
};
type Users = { [key: string]: Position | null };

export default function Home() {
  const [users, setUsers] = useState<Users>({});
  const [userId, setUserId] = useState<string | null>(null);

  socket.on("user-id", (id: string) => {
    setUserId(id);
  });

  const sendPosition = useCallback((position: Position) => {
    socket.emit("move-mouse", position);
  }, []);

  const sendPositionThrottled = useRef(throttle(sendPosition, THROTTLE));

  const renderCursor = useCallback(
    (users: Users) => {
      return Object.keys(users).map((id) => {
        if (id === userId) return null;
        const user = users[id];
        if (!user) return null;

        return <Cursor key={id} point={[user.x, user.y]} />;
      });
    },
    [users, userId]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      sendPositionThrottled.current({
        x: e.clientX,
        y: e.clientY,
      });
    };

    socket.on("update", (users) => {
      setUsers(users);
    });

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <div>{renderCursor(users)}</div>;
}
