import { useCallback, useEffect, useRef, useState } from 'react';

import dayjs from 'dayjs';

import { MessageClass } from '@/domain/models/message';
import { useErrorHandler } from '@/hooks/useErrorHandler/useErrorHandler';
import { EVENT_TYPES } from '@/lib/enum';
import { MessageEvent } from '@/lib/websocket-event';
import { messageRepository } from '@/repository/message/message-repository';
import { userRepository } from '@/repository/user/user-repository';
import { useAuthStore } from '@/store/auth-store';
import { useChatStore } from '@/store/chat-store';

type UserMap = Record<string, Record<string, string>>;

export const useChatMessages = () => {
  const { messages, selectedRoom, addMessage, setMessages } = useChatStore();
  const [messageContent, setMessageContent] = useState('');
  const [nextKey, setNextKey] = useState('');
  const { resetError, handleError } = useErrorHandler();
  const { user } = useAuthStore();
  const socketRef = useRef<WebSocket>();

  const sendMessage = useCallback(
    async (event?: React.SyntheticEvent) => {
      if (!selectedRoom || !user) return;
      if (event) event.preventDefault();
      try {
        const message = await messageRepository.create({
          roomId: selectedRoom.id,
          userId: user.id,
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
    [user, messageContent, selectedRoom, handleError, resetError],
  );

  const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageContent(event.target.value);
  }, []);

  const checkIsTimestampValid = useCallback((timestamp: number, validTimePeriods: number) => {
    const now = Date.now();
    return timestamp > now - validTimePeriods;
  }, []);

  const fetchMessagesAndUserNames = useCallback(
    async (roomId: string, nextKey?: string) => {
      const { messages: fetchedMessages, nextKey: fetchedNextKey } =
        await messageRepository.fetchAllByRoomId({
          roomId: roomId,
          nextKey: nextKey ?? '',
        });

      let userMap: UserMap = {};
      let storedTimestamp = 0;

      const storagedData = localStorage.getItem(roomId);
      if (storagedData !== null) {
        const userData = JSON.parse(storagedData) as {
          userMap: UserMap;
          timestamp: number;
        };
        userMap = userData.userMap;
        storedTimestamp = userData.timestamp;
      }

      const userIds = fetchedMessages.map((message) => message.userId);
      const idsWithNoDupulicates = Array.from(new Set(userIds));

      const milliSecInHalfDay = 1000 * 60 * 60 * 12;
      if (!checkIsTimestampValid(storedTimestamp, milliSecInHalfDay)) {
        userMap = {};
      }

      const missingUserIds = idsWithNoDupulicates.filter((id) => !(id in userMap));
      if (missingUserIds.length) {
        const users = await userRepository.batchGet({ userIds: missingUserIds });
        const newUserMap = users.reduce<UserMap>((acc, user) => {
          acc[user.id] = { name: user.name, imageUrl: user.profileImageUrl };
          return acc;
        }, {});

        userMap = { ...userMap, ...newUserMap };
        const data = { userMap, timestamp: Date.now() };

        localStorage.setItem(roomId, JSON.stringify(data));
      }

      const messagesWithUserName = fetchedMessages.map((message) => {
        return MessageClass.clone(message, {
          userName: userMap[message.userId].name,
          userImageUrl: userMap[message.userId].imageUrl,
        });
      });

      return { messagesWithUserName, fetchedNextKey };
    },
    [checkIsTimestampValid],
  );

  const fetchMoreMessages = useCallback(async () => {
    if (!selectedRoom) return;
    try {
      const { messagesWithUserName, fetchedNextKey } = await fetchMessagesAndUserNames(
        selectedRoom.id,
        nextKey,
      );

      const updatedMessages = [...messages, ...messagesWithUserName];
      setMessages(updatedMessages);
      setNextKey(fetchedNextKey);
      resetError();
    } catch (err) {
      handleError(err);
    }
  }, [
    messages,
    nextKey,
    selectedRoom,
    fetchMessagesAndUserNames,
    setMessages,
    handleError,
    resetError,
  ]);

  useEffect(() => {
    if (!selectedRoom) return;

    (async () => {
      try {
        const { messagesWithUserName, fetchedNextKey } = await fetchMessagesAndUserNames(
          selectedRoom.id,
        );
        setMessages(messagesWithUserName);
        setNextKey(fetchedNextKey);
        resetError();
      } catch (err) {
        handleError(err);
      }
    })();

    socketRef.current = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEBSOCKET_API_ENDPOINT}/ws/${selectedRoom.id}`,
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
        userImageUrl: user.profileImageUrl,
        content: eventData.data.content,
        createdAt: dayjs(eventData.data.createdAt),
      });

      addMessage(message);
    };

    return () => {
      socketRef.current?.close();
    };
  }, [
    selectedRoom,
    fetchMessagesAndUserNames,
    setMessages,
    addMessage,
    handleError,
    resetError,
    checkIsTimestampValid,
  ]);

  return { messageContent, nextKey, sendMessage, handleChange, fetchMoreMessages };
};
