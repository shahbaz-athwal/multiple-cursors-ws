"use client";
import { useCallback, useEffect, useState, useMemo } from "react";
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

let userId: string;

socket.on("user-id", (id: string) => {
  userId = id;
});

export default function Home() {
  const [users, setUsers] = useState<Users>({});

  const sendPosition = useCallback((position: Position) => {
    socket.emit("move-mouse", position);
  }, []);

  const sendPositionThrottled = useMemo(() => throttle(sendPosition, THROTTLE), [sendPosition]);

  const renderCursor = useCallback(
    (users: Users) => {
      return Object.keys(users).map((id) => {
        if (id === userId) return null;
        const user = users[id];
        if (!user) return null;

        return <Cursor key={id} point={[user.x, user.y]} />;
      });
    },
    [users]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      sendPositionThrottled({
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
      sendPositionThrottled.cancel();
    };
  }, [sendPositionThrottled]);

  return <div>{renderCursor(users)}</div>;
}
