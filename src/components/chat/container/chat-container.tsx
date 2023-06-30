import { FC } from 'react';

import { useChatMessages } from '../hooks/useChatMessages';
import { useChatRooms } from '../hooks/useChatRooms';

import { ChatPresenter } from '@/components/chat/presenter/chat-presenter';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { useBoolean } from '@/hooks/useBoolean';
import { useChatStore } from '@/store/chat-store';

export const ChatContainer: FC = () => {
  const { messages, selectedRoomId } = useChatStore();
  const [isOpenDropdown, { toggle: toggleDropdown }] = useBoolean(false);
  const { user, logout } = useAuth();
  const {
    rooms,
    formState,
    currentStep,
    roomCreationError,
    loading,
    createRoom,
    selectRoom,
    handleNextStep,
    handleClose,
    register,
    handleSubmit,
  } = useChatRooms();
  const { sendMessage, handleChange, messageContent } = useChatMessages();

  return (
    <ChatPresenter
      createRoom={createRoom}
      messages={messages}
      messageContent={messageContent}
      user={user}
      isOpen={isOpenDropdown}
      chatRooms={rooms}
      selectedRoomId={selectedRoomId}
      formState={formState}
      currentStep={currentStep}
      roomCreationError={roomCreationError}
      loading={loading}
      sendMessage={sendMessage}
      handleChange={handleChange}
      handleLogout={logout}
      toggleDropdown={toggleDropdown}
      selectRoom={selectRoom}
      handleNextStep={handleNextStep}
      handleCloseModal={handleClose}
      register={register}
      handleSubmit={handleSubmit}
    />
  );
};
