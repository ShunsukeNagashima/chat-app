import Link from 'next/link';

import { Button } from '../ui';

import { useSignup } from './hooks/useSignup';

export const Signup = () => {
  const { errors, isLoading, handleSubmit, handleSignup, register } = useSignup();

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
                {...register('userName', { required: 'Username is required' })}
                type='text'
                className='mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500'
                placeholder='Username'
              />
              {errors.userName && <p className='mt-1 text-red-500'>{errors.userName.message}</p>}
            </div>

            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Email address <span className='text-red-500'>*</span>
              </label>
              <input
                id='email'
                {...register('email', { required: 'Email is required' })}
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
                {...register('password', { required: 'Password is required' })}
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
