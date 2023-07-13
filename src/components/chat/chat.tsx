import { FC } from 'react';

import {
  MessageList,
  MessageForm,
  CreateRoomModal,
  ResultModal,
  AddUsersModal,
  AddUsersConfirmModal,
} from './components';
import { useChatMessages } from './hooks/useChatMessages';
import { useChatRooms } from './hooks/useChatRooms';

import { Sidebar } from '@/components/chat/components/sidebar';
import { StepContent } from '@/components/ui/step-content';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { useBoolean } from '@/hooks/useBoolean';
import { ROOM_CREATION_STEPS, RoomCreationStepsEnum } from '@/lib/enum';
import { useChatStore } from '@/store/chat-store';

export const Chat: FC = () => {
  const { selectedRoomId } = useChatStore();
  const [isOpenDropdown, { toggle: toggleDropdown }] = useBoolean(false);
  const { user, logout } = useAuth();
  const {
    rooms,
    formState,
    currentStep,
    isActionFailed,
    loading,
    searchedUsers,
    usersToBeAdded,
    createdRoom,
    createRoom,
    selectRoom,
    handleNextStep,
    handlePrevStep,
    handleClose,
    register,
    handleSubmit,
    searchUsers,
    addUserToList,
    removeUserFromList,
    addUsersToRoom,
  } = useChatRooms();
  const { messages, messageContent, bottomRef, sendMessage, handleChange } = useChatMessages();

  return (
    <div className='flex h-screen bg-gray-800'>
      <Sidebar
        isOpen={isOpenDropdown}
        selectedRoomId={selectedRoomId}
        handleLogout={logout}
        toggleDropdown={toggleDropdown}
        selectRoom={selectRoom}
        chatRooms={rooms}
        openCreateRoomModal={handleNextStep}
      />
      <main className='flex flex-1 flex-col h-screen justify-between'>
        <MessageList messages={messages} selectedRoomId={selectedRoomId} bottomRef={bottomRef} />
        <MessageForm
          sendMessage={sendMessage}
          handleChange={handleChange}
          messageContent={messageContent}
          selectedRoomId={selectedRoomId}
          className='mt-auto'
        />
      </main>

      <StepContent step={ROOM_CREATION_STEPS.CREATE_ROOM} currentStep={currentStep}>
        <CreateRoomModal
          formState={formState}
          loading={loading}
          handleClose={handleClose}
          register={register}
          handleSubmit={handleSubmit}
          createRoom={createRoom}
        />
      </StepContent>

      <StepContent step={ROOM_CREATION_STEPS.CREATE_ROOM_RESULT} currentStep={currentStep}>
        <ResultModal
          handleNextStep={handleNextStep}
          handleClose={handleClose}
          currentStep={currentStep}
          hasError={isActionFailed}
        />
      </StepContent>

      <StepContent step={ROOM_CREATION_STEPS.ADD_USERS} currentStep={currentStep}>
        <AddUsersModal
          users={searchedUsers}
          usersToBeAdded={usersToBeAdded}
          handleClose={handleClose}
          searchUsers={searchUsers}
          addUserToList={addUserToList}
          removeUserFromList={removeUserFromList}
          handleNextStep={handleNextStep}
        />
      </StepContent>

      <StepContent step={ROOM_CREATION_STEPS.ADD_USERS_CONFIRM} currentStep={currentStep}>
        <AddUsersConfirmModal
          room={createdRoom}
          usersToBeAdded={usersToBeAdded}
          handleClose={handleClose}
          handlePrevStep={handlePrevStep}
          addUsers={addUsersToRoom}
        />
      </StepContent>

      <StepContent step={ROOM_CREATION_STEPS.ADD_USERS_RESULT} currentStep={currentStep}>
        <ResultModal
          handleNextStep={handleNextStep}
          handleClose={handleClose}
          currentStep={currentStep}
          hasError={isActionFailed}
        />
      </StepContent>
    </div>
  );
};
