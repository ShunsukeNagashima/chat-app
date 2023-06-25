import { useCallback, useEffect, useRef, useState } from 'react';

import { Message } from '@/domain/models/message';
import { useChatStore } from '@/store/chat-store';

export const useChatMessages = () => {
  const { addMessage, username, selectedRoomId } = useChatStore();
  const [messageContent, setMessageContent] = useState('');
  const socketRef = useRef<WebSocket>();

  const sendMessage = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const message: Message = { user: username, content: messageContent };
      socketRef.current?.send(JSON.stringify(message));
      setMessageContent('');
    },
    [username, messageContent],
  );

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageContent(event.target.value);
  }, []);

  useEffect(() => {
    if (!selectedRoomId) return;
    socketRef.current = new WebSocket(
      `ws://${process.env.NEXT_PUBLIC_API_HOST}/ws/${selectedRoomId}`,
    );

    socketRef.current.onopen = (event) => {
      console.log('WebSocket successfully connected:', event);
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      addMessage(message);
    };

    return () => {
      socketRef.current?.close();
    };
  }, [addMessage, selectedRoomId]);

  return { sendMessage, handleChange, messageContent };
};
