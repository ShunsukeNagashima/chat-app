import { FC } from 'react';

import { MessageItem } from '../message-item/message-item';

import { Message } from '@/domain/models/message';

type MessageListProps = {
  messages: Message[];
  selectedRoomId: string;
  className?: string;
};

export const MessageList: FC<MessageListProps> = (props) => {
  const { messages, selectedRoomId, className } = props;

  if (!selectedRoomId) {
    return (
      <div className='flex items-center justify-center h-full text-center text-gray-400 text-lg'>
        No chat room is selected. <br />
        Please select one from the sidebar or create a new chat room.
      </div>
    );
  }

  return (
    <div className={`px-6 py-4 flex-1 overflow-y-scroll ${className}`}>
      {messages.map((message, i) => (
        <MessageItem key={i} message={message} />
      ))}
    </div>
  );
};
