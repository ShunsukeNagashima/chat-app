import { FC, useState, useEffect, useCallback, useRef } from 'react';

import { signOut, getAuth } from 'firebase/auth';

import { ChatPresenter } from '@/components/chat/presenter/chat-presenter';
import { Message } from '@/domain/models/message';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { useBoolean } from '@/hooks/useBoolean';
import { firebaseApp } from '@/lib/firebase-client';
import { useChatStore } from '@/store/chat-store';

const auth = getAuth(firebaseApp);

export const ChatContainer: FC = () => {
  const { addMessage, username, messages } = useChatStore();
  const [isOpenDropdown, { toggle: toggleDropdown }] = useBoolean(false);
  const [messageContent, setMessageContent] = useState('');
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

  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8080/ws');

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
  }, [addMessage]);

  return (
    <ChatPresenter
      sendMessage={sendMessage}
      handleChange={handleChange}
      handleLogout={handleLogout}
      toggleDropdown={toggleDropdown}
      messages={messages}
      messageContent={messageContent}
      user={user}
      isOpen={isOpenDropdown}
    />
  );
};
