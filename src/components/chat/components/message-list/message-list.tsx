import { FC } from 'react';

import { MessageItem } from '../message-item/message-item';

import { Message } from '@/domain/models/message';

type MessageListProps = {
  messages: Message[];
  className?: string;
};

export const MessageList: FC<MessageListProps> = ({ messages, className }) => (
  <div className={`px-6 py-4 flex-1 overflow-y-scroll ${className}`}>
    {messages.map((message, i) => (
      <MessageItem key={i} message={message} />
    ))}
  </div>
);
