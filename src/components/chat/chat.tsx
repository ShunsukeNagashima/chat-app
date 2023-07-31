import { FC } from 'react';

import { BsPersonPlusFill } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';
import { ImExit } from 'react-icons/im';

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

import { LeaveRoomConfirmModal } from '@/components/chat/components/leave-room-confirm-modal';
import { Sidebar } from '@/components/chat/components/sidebar';
import { StepContent } from '@/components/ui/step-content';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { useBoolean } from '@/hooks/useBoolean';
import { ROOM_CREATION_STEPS } from '@/lib/enum';
import { useChatStore } from '@/store/chat-store';

export const Chat: FC = () => {
  const { messages, selectedRoom } = useChatStore();
  const [isOpenDropdown, { toggle: toggleDropdown }] = useBoolean(false);
  const { logout } = useAuth();
  const {
    rooms,
    formState,
    currentStep,
    isActionFailed,
    loading,
    searchedUsers,
    usersToBeAdded,
    createdRoom,
    nextKey: nextKeyForUsers,
    isOpenLeaveConfirmation,
    isSidebarOpen,
    createRoom,
    selectRoom,
    handleNextStep,
    handlePrevStep,
    handleClose,
    register,
    handleSubmit,
    searchUsers,
    searchMoreUsers,
    addUserToList,
    removeUserFromList,
    addUsersToRoom,
    handleOpenAddUsers,
    openLeaveConfirmation,
    closeLeaveConfirmation,
    leaveFromRoom,
    toggleSidebar,
  } = useChatRooms();
  const {
    messageContent,
    nextKey: nextKeyForMessages,
    sendMessage,
    handleChange,
    fetchMoreMessages,
  } = useChatMessages();

  return (
    <div className='flex h-screen bg-gray-800'>
      <Sidebar
        isOpen={isOpenDropdown}
        selectedRoomId={selectedRoom?.id ?? ''}
        isSidebarOpen={isSidebarOpen}
        handleLogout={logout}
        toggleDropdown={toggleDropdown}
        selectRoom={selectRoom}
        chatRooms={rooms}
        openCreateRoomModal={handleNextStep}
        toggleSidebar={toggleSidebar}
      />
      <main className='flex h-screen flex-1 flex-col justify-between text-white'>
        <div className='flex h-[60px] items-center justify-between border-b border-gray-700 px-4 text-xl font-bold'>
          <GiHamburgerMenu className='md:hidden' onClick={toggleSidebar} />
          <span>{selectedRoom?.name}</span>
          {selectedRoom && (
            <div className='flex items-center justify-between'>
              <div className='flex gap-x-6'>
                <div className='group relative flex h-8 w-8 items-center justify-center rounded p-2 hover:bg-gray-500/20'>
                  <BsPersonPlusFill size={20} onClick={handleOpenAddUsers} />
                  <span className='absolute left-1/2 top-full mt-2 min-w-[90px] -translate-x-1/2 rounded bg-gray-700 px-2 py-1 text-center text-sm text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                    Add Users
                  </span>
                </div>
                <div className='group relative flex h-8 w-8 items-center justify-center rounded p-2 hover:bg-gray-500/20'>
                  <ImExit size={20} onClick={openLeaveConfirmation} />
                  <span className='absolute right-0 top-full mt-2 w-auto min-w-[100px] rounded bg-gray-700 px-2 py-1 text-sm text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                    Leave Room
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <MessageList
          messages={messages}
          selectedRoomId={selectedRoom?.id ?? ''}
          nextKey={nextKeyForMessages}
          fetchMoreMessages={fetchMoreMessages}
        />
        <MessageForm
          sendMessage={sendMessage}
          handleChange={handleChange}
          messageContent={messageContent}
          selectedRoomId={selectedRoom?.id ?? ''}
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
          nextKey={nextKeyForUsers}
          handleClose={handleClose}
          searchUsers={searchUsers}
          searchMoreUsers={searchMoreUsers}
          addUserToList={addUserToList}
          removeUserFromList={removeUserFromList}
          handleNextStep={handleNextStep}
        />
      </StepContent>

      <StepContent step={ROOM_CREATION_STEPS.ADD_USERS_CONFIRM} currentStep={currentStep}>
        <AddUsersConfirmModal
          room={createdRoom ?? selectedRoom}
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

      {isOpenLeaveConfirmation && (
        <LeaveRoomConfirmModal
          roomName={selectedRoom?.name ?? ''}
          handleLeaveRoom={leaveFromRoom}
          handleClose={closeLeaveConfirmation}
        />
      )}
    </div>
  );
};
