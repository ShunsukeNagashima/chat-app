import { FC } from 'react';

import { UseFormRegister, UseFormHandleSubmit, SubmitHandler, FormState } from 'react-hook-form';

import { ChatRoomFormInput } from '../../type';

import { Button, Modal } from '@/components/ui';
import { ROOM_TYPE } from '@/lib/enum';

type CreateRoomModalProps = {
  formState: FormState<ChatRoomFormInput>;
  loading: boolean;
  handleClose: () => void;
  createRoom: SubmitHandler<ChatRoomFormInput>;
  register: UseFormRegister<ChatRoomFormInput>;
  handleSubmit: UseFormHandleSubmit<ChatRoomFormInput>;
};

export const CreateRoomModal: FC<CreateRoomModalProps> = (props) => {
  const { formState, loading, handleClose, createRoom, register, handleSubmit } = props;
  const { errors } = formState;

  return (
    <Modal title='Create a Room' handleClose={handleClose} loading={loading}>
      <form onSubmit={handleSubmit(createRoom)}>
        <div className='mb-6'>
          <label htmlFor='room-name' className='block text-sm font-medium text-gray-700'>
            Room Name
          </label>
          <input
            id='room-name'
            type='text'
            className='mt-1 block w-full rounded-md border border-gray-700 bg-gray-700 px-4 py-2 text-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200/50'
            {...register('name')}
          />
          {errors.name && <p className='mt-1 text-xs text-red-500'>{errors.name.message}</p>}
        </div>
        <div className='mb-8'>
          <label htmlFor='room-type' className='block text-sm font-medium text-gray-700'>
            Room Type
          </label>
          <select
            id='room-type'
            className='mt-1 block w-full rounded-md border border-gray-700 bg-gray-700 px-4 py-2 text-gray-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200/50'
            {...register('roomType')}
          >
            {Object.entries(ROOM_TYPE).map(([key, value], i) => {
              return (
                <option key={i} value={value}>
                  {key}
                </option>
              );
            })}
          </select>
        </div>
        <div className='flex justify-end'>
          <Button type='submit' color='primary' loading={loading}>
            Create Room
          </Button>
        </div>
      </form>
    </Modal>
  );
};
