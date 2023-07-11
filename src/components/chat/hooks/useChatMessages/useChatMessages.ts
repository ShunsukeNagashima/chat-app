import { useCallback, useEffect, useRef, useState } from 'react';

import dayjs from 'dayjs';

import { MessageClass } from '@/domain/models/message';
import { useAuth } from '@/hooks/useAuth';
import { useErrorHandler } from '@/hooks/useErrorHandler/useErrorHandler';
import { EVENT_TYPES } from '@/lib/enum';
import { MessageEvent } from '@/lib/websocket-event';
import { messageRepository } from '@/repository/message/message-repository';
import { useChatStore } from '@/store/chat-store';

export const useChatMessages = () => {
  const { messages, selectedRoomId, addMessage, setMessages } = useChatStore();
  const [messageContent, setMessageContent] = useState('');
  const { resetError, handleError } = useErrorHandler();
  const { user } = useAuth();
  const socketRef = useRef<WebSocket>();

  const sendMessage = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      if (!selectedRoomId || !user) return;
      event.preventDefault();
      try {
        const message = await messageRepository.create({
          roomId: selectedRoomId,
          userId: user.uid,
          content: messageContent,
        });
        resetError();
        const rawEvent = {
          type: EVENT_TYPES.MESSAGE_SENT,
          data: message,
        };
        socketRef.current?.send(JSON.stringify(rawEvent));
        setMessageContent('');
      } catch (err) {
        handleError(err);
      }
    },
    [user, messageContent, selectedRoomId, handleError, resetError],
  );

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageContent(event.target.value);
  }, []);

  useEffect(() => {
    if (!selectedRoomId) return;

    const fetchMessages = async () => {
      try {
        const { messages, nextKey } = await messageRepository.fetchAllByRoomId({
          roomId: selectedRoomId,
        });
        setMessages(messages);
        resetError();
      } catch (err) {
        handleError(err);
      }
    };
    fetchMessages();

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
      const eventData = JSON.parse(event.data) as MessageEvent;

      console.log(eventData);
      const message = MessageClass.create({
        id: eventData.data.messageId,
        roomId: eventData.data.roomId,
        userId: eventData.data.userId,
        content: eventData.data.content,
        createdAt: dayjs(eventData.data.createdAt),
      });

      addMessage(message);
    };

    return () => {
      socketRef.current?.close();
    };
  }, [selectedRoomId, setMessages, addMessage, handleError, resetError]);

  return { messageContent, messages, sendMessage, handleChange };
};
