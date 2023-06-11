import { FC } from 'react';

import { MessageForm } from '../components/message-form';
import { MessageList } from '../components/message-list';

import { Message } from '@/domain/models/message';

type ChatPresenterProps = {
  sendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  messages: Message[];
  messageContent: string;
};

export const ChatPresenter: FC<ChatPresenterProps> = (props) => {
  const { sendMessage, handleChange, messages, messageContent } = props;

  return (
    <div className='flex flex-col justify-between h-screen bg-gray-800'>
      <MessageList messages={messages} />
      <MessageForm
        sendMessage={sendMessage}
        handleChange={handleChange}
        messageContent={messageContent}
        className='mt-auto'
      />
    </div>
  );
};
