import { useEffect, useCallback } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { roomClient } from '@/infra/room/room-client';
import { useChatStore } from '@/store/chat-store';

export const useChatRooms = () => {
  const { user } = useAuth();
  const { clearMessages, setSelectedRoomId, setRooms, selectedRoomId } = useChatStore();

  const selectChatRoom = useCallback(
    (roomId: string) => {
      if (selectedRoomId === roomId) return;
      setSelectedRoomId(roomId);
      clearMessages();
    },
    [selectedRoomId, clearMessages, setSelectedRoomId],
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

  return { selectChatRoom };
};
