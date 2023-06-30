import { FC } from 'react';

import { User } from 'firebase/auth';
import { UseFormRegister, UseFormHandleSubmit, FormState, SubmitHandler } from 'react-hook-form';

import { CreateRoomModal } from '../components/create-room-modal';
import { MessageForm } from '../components/message-form';
import { MessageList } from '../components/message-list';
import { ResultModal } from '../components/result-modal';
import { ROOM_CREATION_STEPS, RoomCreationStepsEnum } from '../enum';
import { ChatRoomFormInput } from '../type';

import { Sidebar } from '@/components/chat/components/sidebar';
import { StepContent } from '@/components/ui/step-content';
import { Message } from '@/domain/models/message';
import { Room } from '@/infra/room/entity/room';

type ChatPresenterProps = {
  messages: Message[];
  messageContent: string;
  user: User | null;
  isOpen: boolean;
  chatRooms: Room[];
  selectedRoomId: string;
  formState: FormState<ChatRoomFormInput>;
  currentStep: RoomCreationStepsEnum;
  roomCreationError: string;
  loading: boolean;
  sendMessage: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleDropdown: () => void;
  handleLogout: () => Promise<void>;
  selectRoom: (id: string) => void;
  handleNextStep: () => void;
  handleCloseModal: () => void;
  createRoom: SubmitHandler<ChatRoomFormInput>;
  register: UseFormRegister<ChatRoomFormInput>;
  handleSubmit: UseFormHandleSubmit<ChatRoomFormInput>;
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
    roomCreationError,
    loading,
    sendMessage,
    handleChange,
    toggleDropdown,
    handleLogout,
    selectRoom,
    handleNextStep,
    handleCloseModal,
    createRoom,
    register,
    handleSubmit,
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
          error={roomCreationError}
        />
      </StepContent>
    </div>
  );
};
