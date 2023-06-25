import { FC } from 'react';

import { RiArrowDropDownLine } from 'react-icons/ri';

import { Room } from '@/infra/room/entity/room';

type SidebarProps = {
  isOpen: boolean;
  chatRooms: Room[];
  selectedChatRoomId: string;
  handleLogout: () => Promise<void>;
  toggleDropdown: () => void;
  selectChatRoom: (id: string) => void;
};

export const Sidebar: FC<SidebarProps> = (props) => {
  const { isOpen, chatRooms, selectedChatRoomId, handleLogout, toggleDropdown, selectChatRoom } =
    props;
  return (
    <aside className='w-64 text-white p-4 border-r border-gray-700'>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-xl font-bold'>Chat App</h1>
        <button onClick={toggleDropdown} className='relative'>
          <RiArrowDropDownLine size={40} />
          {isOpen && (
            <ul className='absolute right-0 mt-2 w-48 bg-gray-700 rounded shadow-lg py-2 z-10'>
              <li>
                <button onClick={handleLogout} className='w-full block px-4 py-2 hover:bg-blue-400'>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </button>
      </div>
      <div className='text-gray-400 px-2'>
        {chatRooms.length > 0 &&
          chatRooms.map((room) => {
            return (
              <button
                className={`py-2 hover:opacity-80 ${
                  room.roomId === selectedChatRoomId && 'font-bold text-white'
                }`}
                onClick={() => selectChatRoom(room.roomId)}
                key={room.roomId}
              >
                {room.name}
              </button>
            );
          })}
      </div>
    </aside>
  );
};
