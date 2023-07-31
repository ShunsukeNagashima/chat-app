import { FC } from 'react';

import { Message } from '@/domain/models/message';

type MessageItemProps = {
  message: Message;
  className?: string;
};

export const MessageItem: FC<MessageItemProps> = ({ message, className }) => {
  return (
    <div className={`mb-4 flex items-start rounded-lg bg-gray-800 p-4 shadow-md ${className}`}>
      <div className='mr-4'>
        <img
          src={message.userImageUrl || '/images/default-profile.png'}
          alt={`${message.userName} Profile`}
          className='h-12 w-12 rounded-full'
        />
      </div>

      <div className='flex-1 overflow-hidden text-white'>
        <div className='flex justify-between'>
          <span className='text-base font-bold'>{message.userName}</span>
          <span className='text-xs text-gray-400'>
            {message.createdAt.format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </div>
        <p className='mt-2 text-sm leading-normal'>
          {message.content.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};
