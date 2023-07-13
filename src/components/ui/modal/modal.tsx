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
    <div className='fixed inset-0 z-10 overflow-y-auto text-white'>
      <div className='flex min-h-screen items-center justify-center'>
        <div
          onClick={closeOnOverlayClick && !loading ? handleClose : undefined}
          className='fixed inset-0 bg-gray-500/75 transition-opacity'
        />

        <div className='translate-y-[-50%] overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 shadow-xl transition-all sm:w-full sm:max-w-lg sm:p-6'>
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
