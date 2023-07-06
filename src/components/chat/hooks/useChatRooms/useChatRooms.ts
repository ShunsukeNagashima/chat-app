import { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, set, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ChatRoomFormInput } from '@/components/chat/type';
import { useAuth } from '@/hooks/useAuth';
import { useBoolean } from '@/hooks/useBoolean';
import { useErrorHandler } from '@/hooks/useErrorHandler/useErrorHandler';
import { useFetch } from '@/hooks/useFetch';
import { Room } from '@/infra/room/entity/room';
import { roomClient } from '@/infra/room/room-client';
import { roomUserClient } from '@/infra/room-user/room-user-client';
import { User } from '@/infra/user/entity/user';
import { userClient } from '@/infra/user/user-client';
import { RoomCreationStepsEnum, ROOM_CREATION_STEPS } from '@/lib/enum';
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
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [usersToBeAdded, setUsersToBeAdded] = useState<User[]>([]);
  const [createdRoom, setCreatedRoom] = useState<Room>();
  const [loading, { on: startLoading, off: finishLoading }] = useBoolean(false);
  const { user: firebaseUser } = useAuth();
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

  const handlePrevStep = useCallback(() => {
    setCurrentStep((prevStep) => {
      if (prevStep <= ROOM_CREATION_STEPS.CREATE_ROOM) {
        return ROOM_CREATION_STEPS.CLOSED;
      } else {
        return (prevStep - 1) as RoomCreationStepsEnum;
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
      if (!firebaseUser) return;
      startLoading();
      try {
        const room = await roomClient.create({ ...data, ownerId: firebaseUser.uid });
        setCreatedRoom(room);
        handleNextStep();
        resetError();
      } catch (err) {
        handleError(err);
      } finally {
        finishLoading();
      }
    },
    [firebaseUser, handleNextStep, startLoading, finishLoading, handleError, resetError],
  );

  const serachUsers = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      const req = {
        query,
        from: 0,
        size: 20,
      };
      startLoading();
      try {
        const users = await userClient.searchUsers(req);
        const usersWithoutOwner = users.filter((user) => user.userId !== firebaseUser?.uid);
        setSearchedUsers(usersWithoutOwner);
        resetError();
      } catch (err) {
        handleError(err);
      } finally {
        finishLoading();
      }
    },
    [startLoading, finishLoading, handleError, resetError, firebaseUser],
  );

  const addUserToList = useCallback(
    (user: User) => {
      const updatedUsers = [...usersToBeAdded, user];
      setUsersToBeAdded(updatedUsers);
    },
    [setUsersToBeAdded, usersToBeAdded],
  );

  const removeUserFromList = useCallback(
    (userId: string) => {
      const updatedUserIds = usersToBeAdded.filter((user) => user.userId !== userId);
      setUsersToBeAdded(updatedUserIds);
    },
    [setUsersToBeAdded, usersToBeAdded],
  );

  const addUsersToRoom = useCallback(async () => {
    const userIds = usersToBeAdded.map((user) => user.userId);
    const req = {
      roomId: createdRoom?.roomId ?? '',
      userIds: userIds,
    };
    try {
      await roomUserClient.addUsers(req);
      handleNextStep();
      resetError();
      setUsersToBeAdded([]);
    } catch (err) {
      handleError(err);
    } finally {
    }
  }, [handleError, handleNextStep, resetError, createdRoom, usersToBeAdded]);

  const { data: rooms } = useFetch(() => roomClient.fetchAllByUserID(firebaseUser?.uid ?? ''), {
    enabled: !!firebaseUser,
  });

  return {
    rooms: rooms ?? [],
    formState,
    currentStep,
    isActionFailed: hasError,
    loading,
    searchedUsers,
    usersToBeAdded,
    createdRoom,
    createRoom,
    selectRoom,
    register,
    handleSubmit,
    handleNextStep,
    handlePrevStep,
    handleClose,
    serachUsers,
    addUserToList,
    removeUserFromList,
    addUsersToRoom,
  };
};
