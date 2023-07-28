import Link from 'next/link';

import { Button } from '../ui';

import { SUPPORTED_FILE_TYPES } from './hooks/type';
import { useSignup } from './hooks/useSignup';

export const Signup = () => {
  const {
    errors,
    isLoading,
    imagePreviewUrl,
    handleSubmit,
    handleSignup,
    register,
    handleImageChange,
  } = useSignup();

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Sign up for an account
          </h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit(handleSignup)}>
          <div className='space-y-4'>
            <div>
              <label htmlFor='userName' className='block text-sm font-medium text-gray-700'>
                Username <span className='text-red-500'>*</span>
              </label>
              <input
                id='userName'
                {...register('userName')}
                type='text'
                className='mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500'
                placeholder='Username'
              />
              {errors.userName && <p className='mt-1 text-red-500'>{errors.userName.message}</p>}
            </div>

            <div>
              <div className='relative'>
                <label htmlFor='profileImage' className='block text-sm font-medium text-gray-700'>
                  Profile Image <span className='text-red-500'>*</span>
                </label>
                <div
                  className='mt-1 flex h-40 w-40 cursor-pointer items-center justify-center rounded-md border border-gray-300'
                  onClick={() => document.getElementById('profileImageInput')?.click()}
                >
                  {imagePreviewUrl ? (
                    <img
                      src={imagePreviewUrl}
                      alt='Profile Preview'
                      className='h-full w-full rounded-md object-cover'
                    />
                  ) : (
                    <span className='text-center text-gray-500'>Click to upload an image</span>
                  )}
                </div>
                <input
                  id='profileImageInput'
                  type='file'
                  className='hidden'
                  {...register('profileImage')}
                  onChange={(e) => {
                    handleImageChange(e);
                    register('profileImage').onChange(e);
                  }}
                  accept={SUPPORTED_FILE_TYPES.join(',')}
                />
              </div>
              {errors.profileImage && (
                <p className='mt-1 text-red-500'>{errors.profileImage.message}</p>
              )}
            </div>

            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Email address <span className='text-red-500'>*</span>
              </label>
              <input
                id='email'
                {...register('email')}
                type='email'
                className='mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500'
                placeholder='Email address'
              />
              {errors.email && <p className='mt-1 text-red-500'>{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                Password <span className='text-red-500'>*</span>
              </label>
              <input
                id='password'
                {...register('password')}
                type='password'
                className='mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500'
                placeholder='Password'
              />
              {errors.password && <p className='mt-1 text-red-500'>{errors.password.message}</p>}
            </div>
          </div>

          <div className='mt-6'>
            <Button type='submit' color='primary' className='w-full' loading={isLoading}>
              Sign Up
            </Button>
          </div>
        </form>
        <div className='mt-4 text-center text-sm'>
          <Link
            href='/signin'
            className='cursor-pointer font-medium text-indigo-600 hover:text-indigo-500'
          >
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
