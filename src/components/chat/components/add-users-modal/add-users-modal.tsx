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
        <div className='search-box mb-4'>
          <input
            type='text'
            placeholder='Search users...'
            className='w-full px-3 py-2 border rounded shadow-sm text-gray-200 bg-gray-700 border border-gray-700'
            onChange={searchUsers}
          />
        </div>

        <ul className='overflow-y-auto h-64 border border-gray-700 p-2 mb-4'>
          {users.map((user, index) => (
            <li key={index} className='flex justify-between items-center mb-2'>
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

        <div className='action-btns flex justify-end space-x-4'>
          <Button color='primary' disabled={!usersToBeAdded.length} onClick={handleNextStep}>
            Confirm
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
};
