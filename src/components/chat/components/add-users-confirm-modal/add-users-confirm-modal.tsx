import { FC } from 'react';

import { Modal } from '@/components/ui';
import { Button } from '@/components/ui';
import { Room } from '@/infra/room/entity/room';
import { User } from '@/infra/user/entity/user';

type AddUsersConfirmModalProps = {
  room: Room | undefined;
  usersToBeAdded: User[];
  handleClose: () => void;
  handlePrevStep: () => void;
  addUsers: () => Promise<void>;
};

export const AddUsersConfirmModal: FC<AddUsersConfirmModalProps> = (props) => {
  const { room, usersToBeAdded, handleClose, handlePrevStep, addUsers } = props;

  return (
    <Modal title='Confirmation' handleClose={handleClose} closeOnOverlayClick={false}>
      <p className='mb-2'>{`These users will be added to ${room?.name ?? 'the room'}`}</p>
      <div>
        <ul className='overflow-y-auto h-64 border border-gray-700 p-2 mb-4'>
          {usersToBeAdded.map((user, index) => (
            <li key={index} className='flex justify-between items-center mb-2'>
              <span>{user.userName}</span>
            </li>
          ))}
        </ul>

        <div className='action-btns flex justify-end space-x-4'>
          <Button color='primary' disabled={!usersToBeAdded.length} onClick={addUsers}>
            Add Users
          </Button>
          <Button onClick={handlePrevStep}>Back</Button>
        </div>
      </div>
    </Modal>
  );
};