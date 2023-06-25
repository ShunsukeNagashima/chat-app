import { FC } from 'react';

import { User } from 'firebase/auth';

import { MessageForm } from '../components/message-form';
import { MessageList } from '../components/message-list';

import { Sidebar } from '@/components/chat/components/sidebar';
import { Message } from '@/domain/models/message';
import { Room } from '@/infra/room/entity/room';

type ChatPresenterProps = {
  sendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleDropdown: () => void;
  handleLogout: () => Promise<void>;
  selectChatRoom: (id: string) => void;
  messages: Message[];
  messageContent: string;
  user: User | null;
  isOpen: boolean;
  chatRooms: Room[];
  selectedRoomId: string;
};

export const ChatPresenter: FC<ChatPresenterProps> = (props) => {
  const {
    sendMessage,
    handleChange,
    toggleDropdown,
    handleLogout,
    selectChatRoom,
    messages,
    messageContent,
    user,
    isOpen,
    chatRooms,
    selectedRoomId,
  } = props;

  if (!user) {
    return null;
  }

  return (
    <div className='flex h-screen bg-gray-800'>
      <Sidebar
        isOpen={isOpen}
        selectedRoomId={selectedRoomId}
        handleLogout={handleLogout}
        toggleDropdown={toggleDropdown}
        selectChatRoom={selectChatRoom}
        chatRooms={chatRooms}
      />
      <main className='flex flex-1 flex-col h-screen justify-between'>
        <MessageList messages={messages} />
        <MessageForm
          sendMessage={sendMessage}
          handleChange={handleChange}
          messageContent={messageContent}
          className='mt-auto'
        />
      </main>
    </div>
  );
};
