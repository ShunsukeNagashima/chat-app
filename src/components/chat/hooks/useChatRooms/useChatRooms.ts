import { useEffect, useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ChatRoomFormInput } from '@/components/chat/type';
import { useAuth } from '@/hooks/useAuth';
import { useBoolean } from '@/hooks/useBoolean';
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
  const { user } = useAuth();
  const { clearMessages, setSelectedRoomId, setRooms, selectedRoomId } = useChatStore();
  const [isOpenCreateRoomModal, { on: openCreateRoomModal, off: closeCreateRoomModal }] =
    useBoolean(false);
  const { register, handleSubmit, formState } = useForm<ChatRoomFormInput>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

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
      console.log('user', user);
      if (!user) return;
      try {
        await roomClient.create({ ...data, ownerId: user.uid });
      } catch (err) {
        console.error(err);
      }
    },
    [user],
  );

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await roomClient.fetchAllByUserID(user.uid);
        const rooms = data.result;
        setRooms(rooms);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [user, setRooms]);

  return {
    isOpenCreateRoomModal,
    formState,
    createRoom,
    selectRoom,
    openCreateRoomModal,
    closeCreateRoomModal,
    register,
    handleSubmit,
  };
};
