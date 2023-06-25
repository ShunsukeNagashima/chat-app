import { FC } from 'react';

import { useChatMessages } from '../hooks/useChatMessages';
import { useChatRooms } from '../hooks/useChatRooms';

import { ChatPresenter } from '@/components/chat/presenter/chat-presenter';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { useBoolean } from '@/hooks/useBoolean';
import { useChatStore } from '@/store/chat-store';

export const ChatContainer: FC = () => {
  const { messages, rooms, selectedRoomId } = useChatStore();
  const [isOpenDropdown, { toggle: toggleDropdown }] = useBoolean(false);
  const { user, logout } = useAuth();
  const { selectChatRoom } = useChatRooms();
  const { sendMessage, handleChange, messageContent } = useChatMessages();

  return (
    <ChatPresenter
      sendMessage={sendMessage}
      handleChange={handleChange}
      handleLogout={logout}
      toggleDropdown={toggleDropdown}
      selectChatRoom={selectChatRoom}
      messages={messages}
      messageContent={messageContent}
      user={user}
      isOpen={isOpenDropdown}
      chatRooms={rooms}
      selectedChatRoomId={selectedRoomId}
    />
  );
};
