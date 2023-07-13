import { useCallback, useEffect, useRef, useState } from 'react';

import dayjs from 'dayjs';

import { MessageClass } from '@/domain/models/message';
import { useAuth } from '@/hooks/useAuth';
import { useErrorHandler } from '@/hooks/useErrorHandler/useErrorHandler';
import { EVENT_TYPES } from '@/lib/enum';
import { MessageEvent } from '@/lib/websocket-event';
import { messageRepository } from '@/repository/message/message-repository';
import { userRepository } from '@/repository/user/user-repository';
import { useChatStore } from '@/store/chat-store';

export const useChatMessages = () => {
  const { messages, selectedRoomId, addMessage, setMessages } = useChatStore();
  const [messageContent, setMessageContent] = useState('');
  const { resetError, handleError } = useErrorHandler();
  const { user } = useAuth();
  const socketRef = useRef<WebSocket>();
  const bottomRef = useRef<HTMLDivElement>(null);

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

  const checkIsTimestampValid = useCallback((timestamp: number, validTimePeriods: number) => {
    const now = Date.now();
    return timestamp > now - validTimePeriods;
  }, []);

  useEffect(() => {
    if (!selectedRoomId) return;

    const fetchMessages = async () => {
      try {
        const { messages, nextKey } = await messageRepository.fetchAllByRoomId({
          roomId: selectedRoomId,
        });
        if (!messages.length) return;

        let userNameMap: Record<string, string> = {};
        let storedTimestamp = 0;

        const storagedData = localStorage.getItem(selectedRoomId);
        if (storagedData !== null) {
          const userData = JSON.parse(storagedData) as {
            userNameMap: Record<string, string>;
            timestamp: number;
          };
          userNameMap = userData.userNameMap;
          storedTimestamp = userData.timestamp;
        }

        const userIds = messages.map((message) => message.userId);
        const idsWithNoDupulicates = Array.from(new Set(userIds));

        const milliSecInHalfDay = 1000 * 60 * 60 * 12;
        if (!checkIsTimestampValid(storedTimestamp, milliSecInHalfDay)) {
          userNameMap = {};
        }

        const missingUserIds = idsWithNoDupulicates.filter((id) => !(id in userNameMap));
        if (missingUserIds.length) {
          const users = await userRepository.batchGet({ userIds: missingUserIds });
          const newUserNameMap = users.reduce<Record<string, string>>((acc, user) => {
            acc[user.id] = user.name;
            return acc;
          }, {});

          userNameMap = { ...userNameMap, ...newUserNameMap };
          const data = { userNameMap, timestamp: Date.now() };

          localStorage.setItem(selectedRoomId, JSON.stringify(data));
        }

        const messagesWithUserName = messages.map((message) => {
          return MessageClass.clone(message, {
            userName: userNameMap[message.userId],
          });
        });

        setMessages(messagesWithUserName);
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

    socketRef.current.onmessage = async (event) => {
      const eventData = JSON.parse(event.data) as MessageEvent;
      const user = await userRepository.fetchById({ userId: eventData.data.userId });
      const message = MessageClass.create({
        id: eventData.data.messageId,
        roomId: eventData.data.roomId,
        userId: eventData.data.userId,
        userName: user.name,
        content: eventData.data.content,
        createdAt: dayjs(eventData.data.createdAt),
      });

      addMessage(message);
    };

    return () => {
      socketRef.current?.close();
    };
  }, [selectedRoomId, setMessages, addMessage, handleError, resetError, checkIsTimestampValid]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return { messageContent, messages, bottomRef, sendMessage, handleChange };
};
