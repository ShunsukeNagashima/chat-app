import { FC } from 'react';

import { useChatMessages } from '../hooks/useChatMessages';
import { useChatRooms } from '../hooks/useChatRooms';

import { ChatPresenter } from '@/components/chat/presenter/chat-presenter';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { useBoolean } from '@/hooks/useBoolean';
import { useChatStore } from '@/store/chat-store';

export const ChatContainer: FC = () => {
  const { messages, rooms, selectedRoomId } = useChatStore();
  const [isOpenDropdown, { toggle: toggleDropdown }] = useBoolean(false);
  const { user, logout } = useAuth();
  const {
    isOpenCreateRoomModal,
    formState,
    createRoom,
    selectRoom,
    openCreateRoomModal,
    closeCreateRoomModal,
    register,
    handleSubmit,
  } = useChatRooms();
  const { sendMessage, handleChange, messageContent } = useChatMessages();

  return (
    <ChatPresenter
      sendMessage={sendMessage}
      handleChange={handleChange}
      handleLogout={logout}
      toggleDropdown={toggleDropdown}
      selectRoom={selectRoom}
      openCreateRoomModal={openCreateRoomModal}
      closeCreateRoomModal={closeCreateRoomModal}
      register={register}
      handleSubmit={handleSubmit}
      createRoom={createRoom}
      messages={messages}
      messageContent={messageContent}
      user={user}
      isOpen={isOpenDropdown}
      chatRooms={rooms}
      selectedRoomId={selectedRoomId}
      isOpenCreateRoomModal={isOpenCreateRoomModal}
      formState={formState}
    />
  );
};
