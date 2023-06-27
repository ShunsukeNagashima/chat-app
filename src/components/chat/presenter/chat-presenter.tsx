import { FC } from 'react';

import { User } from 'firebase/auth';
import { UseFormRegister, UseFormHandleSubmit, FormState, SubmitHandler } from 'react-hook-form';

import { CreateRoomModal } from '../components/create-room-modal';
import { MessageForm } from '../components/message-form';
import { MessageList } from '../components/message-list';
import { ChatRoomFormInput } from '../type';

import { Sidebar } from '@/components/chat/components/sidebar';
import { Message } from '@/domain/models/message';
import { Room } from '@/infra/room/entity/room';

type ChatPresenterProps = {
  sendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleDropdown: () => void;
  handleLogout: () => Promise<void>;
  selectRoom: (id: string) => void;
  openCreateRoomModal: () => void;
  closeCreateRoomModal: () => void;
  createRoom: SubmitHandler<ChatRoomFormInput>;
  register: UseFormRegister<ChatRoomFormInput>;
  handleSubmit: UseFormHandleSubmit<ChatRoomFormInput>;
  messages: Message[];
  messageContent: string;
  user: User | null;
  isOpen: boolean;
  chatRooms: Room[];
  selectedRoomId: string;
  isOpenCreateRoomModal: boolean;
  formState: FormState<ChatRoomFormInput>;
};

export const ChatPresenter: FC<ChatPresenterProps> = (props) => {
  const {
    sendMessage,
    handleChange,
    toggleDropdown,
    handleLogout,
    selectRoom,
    openCreateRoomModal,
    closeCreateRoomModal,
    createRoom,
    register,
    handleSubmit,
    messages,
    messageContent,
    user,
    isOpen,
    chatRooms,
    selectedRoomId,
    isOpenCreateRoomModal,
    formState,
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
        selectRoom={selectRoom}
        chatRooms={chatRooms}
        openCreateRoomModal={openCreateRoomModal}
      />
      <main className='flex flex-1 flex-col h-screen justify-between'>
        <MessageList messages={messages} selectedRoomId={selectedRoomId} />
        <MessageForm
          sendMessage={sendMessage}
          handleChange={handleChange}
          messageContent={messageContent}
          selectedRoomId={selectedRoomId}
          className='mt-auto'
        />
      </main>
      {isOpenCreateRoomModal && (
        <CreateRoomModal
          formState={formState}
          handleClose={closeCreateRoomModal}
          register={register}
          handleSubmit={handleSubmit}
          createRoom={createRoom}
        />
      )}
    </div>
  );
};
