"use client"
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import throttle from "lodash.throttle";
import { Cursor } from "@/components/Cursor";

const socket = io("http://localhost:8000");
const THROTTLE = 400;

type Position = {
  x: number;
  y: number;
};
type Users = { [key: string]: Position | null };

export default function Home() {
  const [users, setUsers] = useState<Users>({});

  const sendPosition = (position: Position) => {
    socket.emit("move-mouse", position);
  };

  const sendPositionThrottled = useRef(throttle(sendPosition, THROTTLE));

  const renderCursor = (users: Users) => {
      return Object.keys(users).map(id => {
        const user = users[id]
        if (!user) return
  
        return <Cursor key={id} point={[user.x, user.y]} />
      })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      sendPositionThrottled.current({
        x: e.clientX,
        y: e.clientY,
      });
    };

    socket.on("update", (users) => {
      console.log("Update Occurred");
      
      setUsers(users);
    })

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <pre>{renderCursor(users)}</pre>;
}
