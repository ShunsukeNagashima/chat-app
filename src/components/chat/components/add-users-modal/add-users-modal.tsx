import { FC } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';

import { Modal } from '@/components/ui';
import { Button } from '@/components/ui';
import { Spinner } from '@/components/ui';
import { User } from '@/domain/models/user';

type AddUsersModalProps = {
  users: User[];
  usersToBeAdded: User[];
  nextKey: string;
  handleClose: () => void;
  searchUsers: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  searchMoreUsers: () => Promise<void>;
  addUserToList: (user: User) => void;
  removeUserFromList: (userId: string) => void;
  handleNextStep: () => void;
};

export const AddUsersModal: FC<AddUsersModalProps> = (props) => {
  const {
    users,
    usersToBeAdded,
    nextKey,
    handleClose,
    searchUsers,
    searchMoreUsers,
    addUserToList,
    removeUserFromList,
    handleNextStep,
  } = props;

  console.log(nextKey);
  console.log(users.length);
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

        <div
          className='mb-4 h-[200px] overflow-y-auto border border-gray-700 p-2'
          id='scrollableModalDiv'
        >
          <InfiniteScroll
            dataLength={users.length}
            next={searchMoreUsers}
            hasMore={!!nextKey}
            loader={<Spinner />}
            endMessage={<p className='text-center font-bold'>No more users by given keyword</p>}
            scrollableTarget='scrollableModalDiv'
          >
            {users.map((user, index) => (
              <div key={index} className='mb-2 flex items-center justify-between'>
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
              </div>
            ))}
          </InfiniteScroll>
        </div>

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
