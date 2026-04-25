import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "@/constants/constants";
import socketService from "@/services/socket.service";

interface UnreadContextType {
  totalUnread: number;
  refreshUnread: () => void;
}

const UnreadContext = createContext<UnreadContextType>({ totalUnread: 0, refreshUnread: () => {} });

export function UnreadProvider({ children }: { children: React.ReactNode }) {
  const [totalUnread, setTotalUnread] = useState(0);
  const currentUserIdRef = useRef<string | null>(null);

  const refreshUnread = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      const userJson = await SecureStore.getItemAsync("user");
      if (!token || !userJson) return;

      const user = JSON.parse(userJson);
      currentUserIdRef.current = user.id;

      const res = await fetch(`${BASE_URL}/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const chats: any[] = data.chats || [];

      const total = chats.reduce((sum, chat) => {
        const unreadObj = (chat.unreadCount as Record<string, number>) || {};
        return sum + (unreadObj[user.id] || 0);
      }, 0);

      setTotalUnread(total);
    } catch {}
  };

  useEffect(() => {
    refreshUnread();

    const handleNewMessage = (message: any) => {
      if (message.sender?._id !== currentUserIdRef.current) {
        setTotalUnread(n => n + 1);
      }
    };

    const handleRead = () => {
      refreshUnread();
    };

    socketService.on("message:new", handleNewMessage, "unread-context");
    socketService.on("message:read", handleRead, "unread-context-read");

    return () => {
      socketService.off("message:new", "unread-context");
      socketService.off("message:read", "unread-context-read");
    };
  }, []);

  return (
    <UnreadContext.Provider value={{ totalUnread, refreshUnread }}>
      {children}
    </UnreadContext.Provider>
  );
}

export function useUnread() {
  return useContext(UnreadContext);
}
