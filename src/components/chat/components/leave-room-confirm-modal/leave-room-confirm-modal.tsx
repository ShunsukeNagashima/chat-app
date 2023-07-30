import { FC } from 'react';

import { Modal, Button } from '@/components/ui';

type LeaveRoomConfirmModalProps = {
  roomName: string;
  handleClose: () => void;
  handleLeaveRoom: () => void;
};

export const LeaveRoomConfirmModal: FC<LeaveRoomConfirmModalProps> = (props) => {
  const { roomName, handleClose, handleLeaveRoom } = props;

  return (
    <Modal title='Confirm Exit' handleClose={handleClose}>
      <div className='flex flex-col items-center justify-center gap-6'>
        <p>
          Are you sure you want to leave from <span className='font-bold'>{roomName}</span>? This
          action cannot be undone.
        </p>
        <div className='flex gap-2'>
          <Button className='mr-2' color='primary' onClick={handleLeaveRoom}>
            Leave Room
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
};
