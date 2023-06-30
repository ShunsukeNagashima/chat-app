import { FC } from 'react';

import { UseFormRegister, UseFormHandleSubmit, SubmitHandler, FormState } from 'react-hook-form';

import { ChatRoomFormInput } from '../../type';

import { Button, Modal } from '@/components/ui';
import { roomType } from '@/infra/room/entity/room';

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
            className='mt-1 block px-4 py-2 w-full rounded-md text-gray-200 bg-gray-700 border border-gray-700 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            {...register('name')}
          />
          {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>}
        </div>
        <div className='mb-8'>
          <label htmlFor='room-type' className='block text-sm font-medium text-gray-700'>
            Room Type
          </label>
          <select
            id='room-type'
            className='mt-1 block px-4 py-2 w-full rounded-md text-gray-200 bg-gray-700 border border-gray-700 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
            {...register('roomType')}
          >
            {Object.entries(roomType).map(([key, value], i) => {
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
