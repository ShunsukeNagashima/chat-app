import { FC } from 'react';

import { Modal } from '@/components/ui';
import { Button } from '@/components/ui';
import { Room } from '@/domain/models/room';
import { User } from '@/domain/models/user';

type AddUsersConfirmModalProps = {
  room: Room | undefined;
  usersToBeAdded: User[];
  handleClose: () => void;
  handlePrevStep: () => void;
  addUsers: (room: Room) => Promise<void>;
};

export const AddUsersConfirmModal: FC<AddUsersConfirmModalProps> = (props) => {
  const { room, usersToBeAdded, handleClose, handlePrevStep, addUsers } = props;

  if (!room) {
    return null;
  }

  return (
    <Modal title='Confirmation' handleClose={handleClose} closeOnOverlayClick={false}>
      <p className='mb-2'>{`These users will be added to ${room.name}`}</p>
      <div>
        <ul className='mb-4 h-64 overflow-y-auto border border-gray-700 p-2'>
          {usersToBeAdded.map((user, index) => (
            <li key={index} className='mb-2 flex items-center justify-between'>
              <span>{user.name}</span>
            </li>
          ))}
        </ul>

        <div className='flex justify-end space-x-4'>
          <Button color='primary' disabled={!usersToBeAdded.length} onClick={() => addUsers(room)}>
            Add Users
          </Button>
          <Button onClick={handlePrevStep}>Back</Button>
        </div>
      </div>
    </Modal>
  );
};
