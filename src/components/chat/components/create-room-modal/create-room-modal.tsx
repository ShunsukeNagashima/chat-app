import { FC } from 'react';

import { UseFormRegister, UseFormHandleSubmit, SubmitHandler, FormState } from 'react-hook-form';
import { RxCross2 } from 'react-icons/rx';

import { ChatRoomFormInput } from '../../type';

import { roomType } from '@/infra/room/entity/room';

type CreateRoomModalProps = {
  formState: FormState<ChatRoomFormInput>;
  handleClose: () => void;
  createRoom: SubmitHandler<ChatRoomFormInput>;
  register: UseFormRegister<ChatRoomFormInput>;
  handleSubmit: UseFormHandleSubmit<ChatRoomFormInput>;
};

export const CreateRoomModal: FC<CreateRoomModalProps> = (props) => {
  const { formState, handleClose, createRoom, register, handleSubmit } = props;
  const { errors } = formState;

  return (
    <div className='fixed z-10 inset-0 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen'>
        <div
          onClick={handleClose}
          className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
        />

        <div className='bg-gray-800 rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform translate-y-[-50%] transition-all sm:max-w-lg sm:w-full sm:p-6 '>
          <form onSubmit={handleSubmit(createRoom)}>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='font-bold'>Create a Room</h2>
              <RxCross2
                size={25}
                className='cursor-pointer hover:opacity-75'
                onClick={handleClose}
              />
            </div>

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
              <button
                type='submit'
                className='w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm'
              >
                Create Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
