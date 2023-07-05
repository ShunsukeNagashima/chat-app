import { FC } from 'react';

import { User as FirebaseUser } from 'firebase/auth';
import { UseFormRegister, UseFormHandleSubmit, FormState, SubmitHandler } from 'react-hook-form';

import { AddUsersConfirmModal } from '../components/add-users-confirm-modal';
import { AddUsersModal } from '../components/add-users-modal';
import { CreateRoomModal } from '../components/create-room-modal';
import { MessageForm } from '../components/message-form';
import { MessageList } from '../components/message-list';
import { ResultModal } from '../components/result-modal';
import { ChatRoomFormInput } from '../type';

import { Sidebar } from '@/components/chat/components/sidebar';
import { StepContent } from '@/components/ui/step-content';
import { Message } from '@/domain/models/message';
import { Room } from '@/infra/room/entity/room';
import { User } from '@/infra/user/entity/user';
import { ROOM_CREATION_STEPS, RoomCreationStepsEnum } from '@/lib/enum';

type ChatPresenterProps = {
  messages: Message[];
  messageContent: string;
  user: FirebaseUser | null;
  isOpen: boolean;
  chatRooms: Room[];
  selectedRoomId: string;
  formState: FormState<ChatRoomFormInput>;
  currentStep: RoomCreationStepsEnum;
  isActionFailed: boolean;
  loading: boolean;
  searchedUsers: User[];
  usersToBeAdded: User[];
  createdRoom: Room | undefined;
  sendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleDropdown: () => void;
  handleLogout: () => Promise<void>;
  selectRoom: (id: string) => void;
  handleNextStep: () => void;
  handlePrevStep: () => void;
  handleCloseModal: () => void;
  createRoom: SubmitHandler<ChatRoomFormInput>;
  register: UseFormRegister<ChatRoomFormInput>;
  handleSubmit: UseFormHandleSubmit<ChatRoomFormInput>;
  searchUsers: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  addUserToList: (user: User) => void;
  removeUserFromList: (id: string) => void;
  addUsersToRoom: () => Promise<void>;
};

export const ChatPresenter: FC<ChatPresenterProps> = (props) => {
  const {
    messages,
    messageContent,
    user,
    isOpen,
    chatRooms,
    selectedRoomId,
    formState,
    currentStep,
    isActionFailed,
    loading,
    searchedUsers,
    usersToBeAdded,
    createdRoom,
    sendMessage,
    handleChange,
    toggleDropdown,
    handleLogout,
    selectRoom,
    handleNextStep,
    handlePrevStep,
    handleCloseModal,
    createRoom,
    register,
    handleSubmit,
    searchUsers,
    addUserToList,
    removeUserFromList,
    addUsersToRoom,
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
        openCreateRoomModal={handleNextStep}
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

      <StepContent step={ROOM_CREATION_STEPS.CREATE_ROOM} currentStep={currentStep}>
        <CreateRoomModal
          formState={formState}
          loading={loading}
          handleClose={handleCloseModal}
          register={register}
          handleSubmit={handleSubmit}
          createRoom={createRoom}
        />
      </StepContent>

      <StepContent step={ROOM_CREATION_STEPS.CREATE_ROOM_RESULT} currentStep={currentStep}>
        <ResultModal
          handleNextStep={handleNextStep}
          handleClose={handleCloseModal}
          currentStep={currentStep}
          hasError={isActionFailed}
        />
      </StepContent>

      <StepContent step={ROOM_CREATION_STEPS.ADD_USERS} currentStep={currentStep}>
        <AddUsersModal
          users={searchedUsers}
          usersToBeAdded={usersToBeAdded}
          handleClose={handleCloseModal}
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
          handleClose={handleCloseModal}
          handlePrevStep={handlePrevStep}
          addUsers={addUsersToRoom}
        />
      </StepContent>

      <StepContent step={ROOM_CREATION_STEPS.ADD_USERS_RESULT} currentStep={currentStep}>
        <ResultModal
          handleNextStep={handleNextStep}
          handleClose={handleCloseModal}
          currentStep={currentStep}
          hasError={isActionFailed}
        />
      </StepContent>
    </div>
  );
};
