import { FC } from 'react';

import { Message } from '@/domain/models/message';

type MessageItemProps = {
  message: Message;
  className?: string;
};

export const MessageItem: FC<MessageItemProps> = ({ message, className }) => (
  <div className={`flex items-start mb-4 p-4 bg-gray-800 rounded-lg shadow-md ${className}`}>
    <div className='flex-1 overflow-hidden text-white'>
      <div className='flex justify-between'>
        <span className='font-bold text-md'>{message.userName}</span>
        <span className='text-gray-400 text-xs'>
          {message.createdAt.format('YYYY-MM-DD HH:mm:ss')}
        </span>
      </div>
      <p className='mt-2 text-sm leading-normal'>{message.content}</p>
    </div>
  </div>
);
