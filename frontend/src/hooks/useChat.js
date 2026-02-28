import { useState, useCallback } from 'react';

/**
 * Lightweight chat state hook — placeholder for WebSocket / real-time integration.
 */
export function useChat(channelId) {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const sendMessage = useCallback(
    (text) => {
      const msg = {
        id: crypto.randomUUID(),
        channelId,
        text,
        sentAt: new Date().toISOString(),
        sender: 'me', // replace with actual userId
      };
      setMessages((prev) => [...prev, msg]);
    },
    [channelId],
  );

  const connect = useCallback(() => setIsConnected(true), []);
  const disconnect = useCallback(() => setIsConnected(false), []);

  return { messages, sendMessage, isConnected, connect, disconnect };
}
