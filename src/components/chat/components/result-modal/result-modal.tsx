import { FC, ReactNode } from 'react';

import { Button } from '@/components/ui/button/button';
import { Modal } from '@/components/ui/modal';
import { RoomCreationStepsEnum, ROOM_CREATION_STEPS } from '@/lib/enum';

type ResultModalProps = {
  hasError: boolean;
  currentStep: RoomCreationStepsEnum;
  handleNextStep: () => void;
  handleClose: () => void;
};

const stepMessages = {
  [ROOM_CREATION_STEPS.CREATE_ROOM_RESULT]: {
    success: {
      title: 'Room Created!',
      message:
        'Chat room creation was successful. You can now add members to the room. This operation can also be performed later.',
      actionText: 'Add members',
      handleAction: 'handleNextStep',
    },
    failure: {
      title: 'Room Creation Failed',
      message:
        'Chat room creation failed. Please try again later. If the same error occurs repeatedly, please contact support.',
      actionText: '',
      handleAction: '',
    },
  },
  [ROOM_CREATION_STEPS.ADD_USERS_RESULT]: {
    success: {
      title: 'Users Added!',
      message: 'Adding users was successful. Enjoy chat!',
      actionText: '',
      handleAction: '',
    },
    failure: {
      title: 'Adding Users Failed',
      message:
        'Adding users failed. Please try again later. If the same error occurs repeatedly, please contact support.',
      actionText: '',
      handleAction: '',
    },
  },
};

export const ResultModal: FC<ResultModalProps> = (props) => {
  const { hasError, currentStep, handleNextStep, handleClose } = props;

  if (
    currentStep !== ROOM_CREATION_STEPS.CREATE_ROOM_RESULT &&
    currentStep !== ROOM_CREATION_STEPS.ADD_USERS_RESULT
  ) {
    return null;
  }

  const stepInfo = stepMessages[currentStep];
  const resultInfo = hasError ? stepInfo.failure : stepInfo.success;

  const modalContent = (
    <div className='flex flex-col items-center justify-center gap-6'>
      <p>{resultInfo.message}</p>
      <div className='flex gap-2'>
        {resultInfo.actionText && (
          <Button
            className='mr-2'
            color='primary'
            onClick={resultInfo.handleAction ? handleNextStep : handleClose}
          >
            {resultInfo.actionText}
          </Button>
        )}
        <Button onClick={handleClose}>Close</Button>
      </div>
    </div>
  );

  return (
    <Modal title={resultInfo.title} handleClose={handleClose} closeOnOverlayClick={false}>
      {modalContent}
    </Modal>
  );
};
