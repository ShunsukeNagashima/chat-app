import { FC, useState, useEffect, useCallback, useRef } from 'react';

import { ChatPresenter } from '@/components/chat/presenter/chat-presenter';
import { Message } from '@/domain/models/message';
import { useChatStore } from '@/store/chat-store';

export const ChatContainer: FC = () => {
  const { addMessage, username, messages } = useChatStore();
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
    socketRef.current = new WebSocket('ws://localhost:8080/ws');

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
      messages={messages}
      messageContent={messageContent}
    />
  );
};
