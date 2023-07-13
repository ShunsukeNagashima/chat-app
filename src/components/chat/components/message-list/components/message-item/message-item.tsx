import { FC } from 'react';

import { Message } from '@/domain/models/message';

type MessageItemProps = {
  message: Message;
  className?: string;
};

export const MessageItem: FC<MessageItemProps> = ({ message, className }) => (
  <div className={`mb-4 flex items-start rounded-lg bg-gray-800 p-4 shadow-md ${className}`}>
    <div className='flex-1 overflow-hidden text-white'>
      <div className='flex justify-between'>
        <span className='text-base font-bold'>{message.userName}</span>
        <span className='text-xs text-gray-400'>
          {message.createdAt.format('YYYY-MM-DD HH:mm:ss')}
        </span>
      </div>
      <p className='mt-2 text-sm leading-normal'>{message.content}</p>
    </div>
  </div>
);
