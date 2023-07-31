import { useCallback, useState, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ChatRoomFormInput } from '@/components/chat/type';
import { Room } from '@/domain/models/room';
import { User } from '@/domain/models/user';
import { useBoolean } from '@/hooks/useBoolean';
import { useErrorHandler } from '@/hooks/useErrorHandler/useErrorHandler';
import { RoomCreationStepsEnum, ROOM_CREATION_STEPS, EVENT_TYPES } from '@/lib/enum';
import { RoomUserEvent } from '@/lib/websocket-event';
import { roomRepository } from '@/repository/room/room-repository';
import { userRepository } from '@/repository/user/user-repository';
import { useAuthStore } from '@/store/auth-store';
import { useChatStore } from '@/store/chat-store';
import { useWebSocketStore } from '@/store/websocket-store';

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
  const [fetchedRooms, setFetchedRooms] = useState<Room[]>([]);
  const [nextKey, setNextKey] = useState('');
  const [previousSearchQuery, setPreviousSearchQuery] = useState('');
  const [isSidebarOpen, { toggle: toggleSidebar, off: closeSidebar }] = useBoolean(false);
  const [isOpenLeaveConfirmation, { on: openLeaveConfirmation, off: closeLeaveConfirmation }] =
    useBoolean(false);
  const [loading, { on: startLoading, off: finishLoading }] = useBoolean(false);
  const { user: authUser } = useAuthStore();
  const { error, resetError, handleError } = useErrorHandler();
  const { selectedRoom, clearMessages, setSelectedRoom, resetSelectedRoom } = useChatStore();
  const { wsInstance } = useWebSocketStore();
  const { register, handleSubmit, formState, reset } = useForm<ChatRoomFormInput>({
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

  const handleOpenAddUsers = useCallback(() => {
    setCurrentStep(ROOM_CREATION_STEPS.ADD_USERS);
  }, []);

  const handleClose = useCallback(() => {
    setCurrentStep(ROOM_CREATION_STEPS.CLOSED);
    resetError();
    setUsersToBeAdded([]);
    setSearchedUsers([]);
    setNextKey('');
    setPreviousSearchQuery('');
    setCreatedRoom(undefined);
  }, [resetError, setUsersToBeAdded, setSearchedUsers]);

  const selectRoom = useCallback(
    (room: Room) => {
      if (selectedRoom?.id === room.id) return;
      setSelectedRoom(room);
      clearMessages();
      isSidebarOpen && closeSidebar();
    },
    [selectedRoom, isSidebarOpen, clearMessages, setSelectedRoom, closeSidebar],
  );

  const createRoom: SubmitHandler<ChatRoomFormInput> = useCallback(
    async (data) => {
      if (!authUser) return;
      startLoading();
      try {
        const room = await roomRepository.create({ ...data, ownerId: authUser.id });
        setCreatedRoom(room);
        const eventData: RoomUserEvent = {
          type: EVENT_TYPES.ROOM_USER_CHANGE,
          data: {
            userId: authUser.id,
            roomId: room.id,
          },
        };
        wsInstance?.send(JSON.stringify(eventData));
        handleNextStep();
        resetError();
        reset();
      } catch (err) {
        handleError(err);
      } finally {
        finishLoading();
      }
    },
    [
      authUser,
      wsInstance,
      handleNextStep,
      startLoading,
      finishLoading,
      handleError,
      resetError,
      reset,
    ],
  );

  const searchUsers = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      const req = {
        query,
        nextKey: '',
        size: 20,
      };
      startLoading();
      try {
        const { users, nextKey: fetchedNextKey } = await userRepository.search(req);
        const usersWithoutOwner = users.filter((user) => user.id !== authUser?.id);
        setSearchedUsers(usersWithoutOwner);
        setNextKey(fetchedNextKey);
        setPreviousSearchQuery(query);
        resetError();
      } catch (err) {
        handleError(err);
      } finally {
        finishLoading();
      }
    },
    [authUser, startLoading, finishLoading, handleError, resetError],
  );

  const searchMoreUsers = useCallback(async () => {
    if (!previousSearchQuery) return;
    const req = {
      query: previousSearchQuery,
      nextKey,
      size: 20,
    };
    startLoading();
    try {
      const { users, nextKey: fetchedNextKey } = await userRepository.search(req);
      const usersWithoutOwner = users.filter((user) => user.id !== authUser?.id);
      setSearchedUsers((prevUsers) => [...prevUsers, ...usersWithoutOwner]);
      setNextKey(fetchedNextKey);
      resetError();
    } catch (err) {
      handleError(err);
    } finally {
      finishLoading();
    }
  }, [
    authUser,
    nextKey,
    previousSearchQuery,
    startLoading,
    finishLoading,
    handleError,
    resetError,
  ]);

  const addUserToList = useCallback(
    (user: User) => {
      const updatedUsers = [...usersToBeAdded, user];
      setUsersToBeAdded(updatedUsers);
    },
    [setUsersToBeAdded, usersToBeAdded],
  );

  const removeUserFromList = useCallback(
    (userId: string) => {
      const updatedUserIds = usersToBeAdded.filter((user) => user.id !== userId);
      setUsersToBeAdded(updatedUserIds);
    },
    [setUsersToBeAdded, usersToBeAdded],
  );

  const addUsersToRoom = useCallback(
    async (room: Room) => {
      const userIds = usersToBeAdded.map((user) => user.id);
      const req = {
        roomId: room.id,
        userIds: userIds,
      };
      try {
        startLoading();
        await roomRepository.addUsers(req);
        for (const userId of userIds) {
          const eventData: RoomUserEvent = {
            type: EVENT_TYPES.ROOM_USER_CHANGE,
            data: {
              userId,
              roomId: room.id,
            },
          };
          wsInstance?.send(JSON.stringify(eventData));
        }
        handleNextStep();
        resetError();
        setUsersToBeAdded([]);
        setSearchedUsers([]);
      } catch (err) {
        handleError(err);
      } finally {
        finishLoading();
      }
    },
    [
      usersToBeAdded,
      wsInstance,
      startLoading,
      finishLoading,
      handleError,
      handleNextStep,
      resetError,
    ],
  );

  const leaveFromRoom = useCallback(async () => {
    if (!authUser || !selectedRoom) return;

    const userId = authUser.id;
    const roomId = selectedRoom.id;

    await roomRepository.removeUser({
      roomId,
      userId,
    });

    resetSelectedRoom();
    closeLeaveConfirmation();

    const eventData: RoomUserEvent = {
      type: EVENT_TYPES.ROOM_USER_CHANGE,
      data: {
        userId,
        roomId,
      },
    };

    wsInstance?.send(JSON.stringify(eventData));
  }, [authUser, selectedRoom, wsInstance, resetSelectedRoom, closeLeaveConfirmation]);

  const fetchRooms = useCallback(async () => {
    if (!authUser) return;

    try {
      const rooms = await roomRepository.fetchAllByUserId({ userId: authUser.id });
      resetError();
      return rooms;
    } catch (err) {
      handleError(err);
    }
  }, [authUser, handleError, resetError]);

  useEffect(() => {
    (async () => {
      const rooms = await fetchRooms();
      rooms && setFetchedRooms(rooms);
    })();
  }, [authUser, handleError, resetError, fetchRooms]);

  useEffect(() => {
    if (!wsInstance) return;

    wsInstance.onmessage = async (event) => {
      const eventData = JSON.parse(event.data) as RoomUserEvent;
      if (eventData.type === EVENT_TYPES.ROOM_USER_CHANGE) {
        if (eventData.data.userId !== authUser?.id) return;

        const rooms = await fetchRooms();
        rooms && setFetchedRooms(rooms);
      }
    };
  }, [wsInstance, authUser?.id, fetchRooms, handleError]);

  return {
    rooms: fetchedRooms,
    formState,
    currentStep,
    isActionFailed: !!error,
    loading,
    searchedUsers,
    usersToBeAdded,
    createdRoom,
    nextKey,
    isOpenLeaveConfirmation,
    isSidebarOpen,
    createRoom,
    selectRoom,
    register,
    handleSubmit,
    handleNextStep,
    handlePrevStep,
    handleClose,
    searchUsers,
    searchMoreUsers,
    addUserToList,
    removeUserFromList,
    addUsersToRoom,
    handleOpenAddUsers,
    openLeaveConfirmation,
    closeLeaveConfirmation,
    leaveFromRoom,
    toggleSidebar,
  };
};
