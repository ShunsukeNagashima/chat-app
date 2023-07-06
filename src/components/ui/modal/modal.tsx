import React, { FC } from 'react';

import { RxCross2 } from 'react-icons/rx';

type ModalProps = {
  title: string;
  children: React.ReactNode;
  handleClose: () => void;
  closeOnOverlayClick?: boolean;
  loading?: boolean;
};

export const Modal: FC<ModalProps> = (props) => {
  const { title, children, closeOnOverlayClick = true, loading = false, handleClose } = props;
  return (
    <div className='fixed z-10 inset-0 overflow-y-auto text-white'>
      <div className='flex items-center justify-center min-h-screen'>
        <div
          onClick={closeOnOverlayClick && !loading ? handleClose : undefined}
          className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
        />

        <div className='bg-gray-800 rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform translate-y-[-50%] transition-all sm:max-w-lg sm:w-full sm:p-6 '>
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='font-bold'>{title}</h2>
            {!loading && (
              <RxCross2
                size={25}
                className='cursor-pointer hover:opacity-75'
                onClick={handleClose}
              />
            )}
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};
