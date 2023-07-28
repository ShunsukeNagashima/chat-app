import { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { getAuth, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';

import { SignupSchema, SignupFormInput } from './type';

import { useBoolean } from '@/hooks/useBoolean';
import { useErrorHandler } from '@/hooks/useErrorHandler/useErrorHandler';
import { firebaseApp } from '@/lib/firebase-client';
import { userRepository } from '@/repository/user/user-repository';
import { useAuthStore } from '@/store/auth-store';
import { useToastMessageStore } from '@/store/toast-message-store';

const auth = getAuth(firebaseApp);

export const useSignup = () => {
  const router = useRouter();
  const [isLoading, { on: startLoading, off: finishLoading }] = useBoolean(false);
  const { setUser } = useAuthStore();
  const { resetError, handleError } = useErrorHandler();
  const { setSuccessToastMessage } = useToastMessageStore();
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInput>({
    resolver: zodResolver(SignupSchema),
  });

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const reader = new FileReader();
    const file = e.target.files ? e.target.files[0] : null;

    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
    };

    file && reader.readAsDataURL(file);
  }, []);

  const uploadImage = useCallback(async (file: File) => {
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, 'images/' + file.name);

    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);
    return imageUrl;
  }, []);

  const registerUser = useCallback(
    async (userId: string, name: string, email: string, imageUrl: string, idToken: string) => {
      const req = {
        userId,
        name,
        email,
        imageUrl,
        idToken,
      };
      return await userRepository.create(req);
    },
    [],
  );

  const handleSignup: SubmitHandler<SignupFormInput> = useCallback(
    async (data) => {
      const { userName, email, password, profileImage } = data;
      let firebaseUser: User | null = null;
      try {
        startLoading();
        const imageUrl = await uploadImage(profileImage);
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const idToken = await result.user.getIdToken();
        firebaseUser = result.user;
        const user = await registerUser(
          result.user.uid,
          userName,
          result.user.email as string,
          imageUrl,
          idToken,
        );
        setUser(user);
        setSuccessToastMessage('Successfully signed up!');
        router.push('/');
        resetError();
      } catch (err) {
        handleError(err);
        await firebaseUser?.delete();
      } finally {
        finishLoading();
      }
    },
    [
      router,
      registerUser,
      setUser,
      startLoading,
      finishLoading,
      handleError,
      resetError,
      setSuccessToastMessage,
      uploadImage,
    ],
  );

  return {
    errors,
    isLoading,
    imagePreviewUrl,
    handleSubmit,
    handleSignup,
    register,
    handleImageChange,
  };
};
