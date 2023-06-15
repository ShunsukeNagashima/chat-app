import { FC } from 'react';

import { User } from 'firebase/auth';

import { MessageForm } from '../components/message-form';
import { MessageList } from '../components/message-list';

import { Message } from '@/domain/models/message';

type ChatPresenterProps = {
  sendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  messages: Message[];
  messageContent: string;
  user: User | null;
};

export const ChatPresenter: FC<ChatPresenterProps> = (props) => {
  const { sendMessage, handleChange, messages, messageContent, user } = props;

  if (!user) {
    return null;
  }

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
