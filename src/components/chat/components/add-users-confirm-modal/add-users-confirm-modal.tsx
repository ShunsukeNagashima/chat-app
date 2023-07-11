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
        <ul className='overflow-y-auto h-64 border border-gray-700 p-2 mb-4'>
          {usersToBeAdded.map((user, index) => (
            <li key={index} className='flex justify-between items-center mb-2'>
              <span>{user.name}</span>
            </li>
          ))}
        </ul>

        <div className='action-btns flex justify-end space-x-4'>
          <Button color='primary' disabled={!usersToBeAdded.length} onClick={() => addUsers(room)}>
            Add Users
          </Button>
          <Button onClick={handlePrevStep}>Back</Button>
        </div>
      </div>
    </Modal>
  );
};
