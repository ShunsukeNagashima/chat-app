import { FC, use } from 'react';

import { Modal } from '@/components/ui';
import { Button } from '@/components/ui';
import { User } from '@/domain/models/user';

type AddUsersModalProps = {
  users: User[];
  usersToBeAdded: User[];
  handleClose: () => void;
  searchUsers: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  addUserToList: (user: User) => void;
  removeUserFromList: (userId: string) => void;
  handleNextStep: () => void;
};

export const AddUsersModal: FC<AddUsersModalProps> = (props) => {
  const {
    users,
    usersToBeAdded,
    handleClose,
    searchUsers,
    addUserToList,
    removeUserFromList,
    handleNextStep,
  } = props;

  return (
    <Modal title='Add Users to Room' handleClose={handleClose} closeOnOverlayClick={false}>
      <div>
        <div className='mb-4'>
          <input
            type='text'
            placeholder='Search users...'
            className='w-full rounded border border-gray-700 bg-gray-700 px-3 py-2 text-gray-200 shadow-sm'
            onChange={searchUsers}
          />
        </div>

        <ul className='mb-4 h-64 overflow-y-auto border border-gray-700 p-2'>
          {users.map((user, index) => (
            <li key={index} className='mb-2 flex items-center justify-between'>
              <span>{user.name}</span>
              {usersToBeAdded.includes(user) ? (
                <Button color='dangerous' onClick={() => removeUserFromList(user.id)}>
                  Remove
                </Button>
              ) : (
                <Button color='primary' onClick={() => addUserToList(user)}>
                  Add
                </Button>
              )}
            </li>
          ))}
        </ul>

        <div className='flex justify-end space-x-4'>
          <Button color='primary' disabled={!usersToBeAdded.length} onClick={handleNextStep}>
            Confirm
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
};
