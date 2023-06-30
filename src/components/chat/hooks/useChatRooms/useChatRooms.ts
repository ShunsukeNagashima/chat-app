import { useEffect, useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { RoomCreationStepsEnum, ROOM_CREATION_STEPS } from '../../enum';

import { ChatRoomFormInput } from '@/components/chat/type';
import { useAuth } from '@/hooks/useAuth';
import { useBoolean } from '@/hooks/useBoolean';
import { useErrorHandler } from '@/hooks/useErrorHandler/useErrorHandler';
import { useFetch } from '@/hooks/useFetch';
import { roomClient } from '@/infra/room/room-client';
import { useChatStore } from '@/store/chat-store';

const schema = z.object({
  name: z
    .string()
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      'Room name can only contain alphanumeric characters, hyphens and underscores',
    ),
  roomType: z.enum(['public', 'private']),
});

export const useChatRooms = () => {
  const [currentStep, setCurrentStep] = useState<RoomCreationStepsEnum>(ROOM_CREATION_STEPS.CLOSED);
  const [loading, { on: startLoading, off: finishLoading }] = useBoolean(false);
  const { user } = useAuth();
  const { hasError, resetError, handleError } = useErrorHandler();
  const { clearMessages, setSelectedRoomId, selectedRoomId } = useChatStore();
  const { register, handleSubmit, formState } = useForm<ChatRoomFormInput>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const handleNextStep = useCallback(() => {
    setCurrentStep((prevStep) => {
      if (prevStep >= ROOM_CREATION_STEPS.ADD_USERS_RESULT) {
        return ROOM_CREATION_STEPS.CLOSED;
      } else {
        return (prevStep + 1) as RoomCreationStepsEnum;
      }
    });
  }, []);

  const handleClose = useCallback(() => {
    setCurrentStep(ROOM_CREATION_STEPS.CLOSED);
  }, []);

  const selectRoom = useCallback(
    (roomId: string) => {
      if (selectedRoomId === roomId) return;
      setSelectedRoomId(roomId);
      clearMessages();
    },
    [selectedRoomId, clearMessages, setSelectedRoomId],
  );

  const createRoom: SubmitHandler<ChatRoomFormInput> = useCallback(
    async (data) => {
      if (!user) return;
      startLoading();
      try {
        await roomClient.create({ ...data, ownerId: user.uid });
        handleNextStep();
        resetError();
      } catch (err) {
        handleError(err);
      } finally {
        finishLoading();
      }
    },
    [user, handleNextStep, startLoading, finishLoading, handleError, resetError],
  );

  const { data: rooms } = useFetch(() => roomClient.fetchAllByUserID(user?.uid ?? ''), {
    enabled: !!user,
  });

  return {
    rooms: rooms ?? [],
    formState,
    currentStep,
    isCreationFailed: hasError,
    loading,
    createRoom,
    selectRoom,
    register,
    handleSubmit,
    handleNextStep,
    handleClose,
  };
};
