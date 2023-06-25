import { FC, useState, useEffect, useCallback, useRef } from 'react';

import { signOut, getAuth } from 'firebase/auth';

import { ChatPresenter } from '@/components/chat/presenter/chat-presenter';
import { Message } from '@/domain/models/message';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { useBoolean } from '@/hooks/useBoolean';
import { Room } from '@/infra/room/entity/room';
import { roomClient } from '@/infra/room/room-client';
import { firebaseApp } from '@/lib/firebase-client';
import { useChatStore } from '@/store/chat-store';

const auth = getAuth(firebaseApp);

export const ChatContainer: FC = () => {
  const { addMessage, clearMessages, username, messages } = useChatStore();
  const [isOpenDropdown, { toggle: toggleDropdown }] = useBoolean(false);
  const [messageContent, setMessageContent] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string>('');
  const socketRef = useRef<WebSocket>();
  const { user } = useAuth();

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

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Failed to logout', err);
    }
  }, []);

  const selectChatRoom = useCallback(
    (roomId: string) => {
      if (selectedChatRoomId === roomId) return;
      setSelectedChatRoomId(roomId);
      clearMessages();
    },
    [selectedChatRoomId, clearMessages],
  );

  useEffect(() => {
    if (!selectedChatRoomId) return;
    socketRef.current = new WebSocket(`ws://localhost:8080/ws/${selectedChatRoomId}`);

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
  }, [addMessage, selectedChatRoomId]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await roomClient.fetchAllByUserID(user.uid);
        const rooms = data.result;
        setRooms(rooms);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [user]);

  return (
    <ChatPresenter
      sendMessage={sendMessage}
      handleChange={handleChange}
      handleLogout={handleLogout}
      toggleDropdown={toggleDropdown}
      selectChatRoom={selectChatRoom}
      messages={messages}
      messageContent={messageContent}
      user={user}
      isOpen={isOpenDropdown}
      chatRooms={rooms}
      selectedChatRoomId={selectedChatRoomId}
    />
  );
};
