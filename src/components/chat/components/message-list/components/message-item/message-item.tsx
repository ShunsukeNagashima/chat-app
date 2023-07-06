import { FC } from 'react';

import { Message } from '@/domain/models/message';

type MessageItemProps = {
  message: Message;
  className?: string;
};

export const MessageItem: FC<MessageItemProps> = ({ message, className }) => (
  <div className={`flex items-start mb-4 text-sm ${className}`}>
    <div className='flex-1 overflow-hidden text-white'>
      <div>
        <span className='font-bold'>{message.user}</span>
        {/* <span className="text-grey-dark text-xs">{message.createdAt}</span> */}
      </div>
      <p className='leading-normal'>{message.content}</p>
    </div>
  </div>
);
