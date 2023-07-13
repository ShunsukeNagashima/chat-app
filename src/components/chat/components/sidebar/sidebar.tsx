import { FC } from 'react';

import { AiFillPlusSquare, AiFillLock } from 'react-icons/ai';
import { BiConversation } from 'react-icons/bi';
import { RiArrowDropDownLine } from 'react-icons/ri';

import { Room } from '@/domain/models/room';

type SidebarProps = {
  isOpen: boolean;
  chatRooms: Room[];
  selectedRoomId: string;
  handleLogout: () => Promise<void>;
  toggleDropdown: () => void;
  selectRoom: (id: string) => void;
  openCreateRoomModal: () => void;
};

export const Sidebar: FC<SidebarProps> = (props) => {
  const {
    isOpen,
    chatRooms,
    selectedRoomId,
    handleLogout,
    toggleDropdown,
    selectRoom,
    openCreateRoomModal,
  } = props;
  return (
    <aside className='w-64 border-r border-gray-700 p-4 text-white'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-xl font-bold'>Chat App</h1>
        <button onClick={toggleDropdown} className='relative'>
          <RiArrowDropDownLine size={40} />
          {isOpen && (
            <ul className='absolute right-0 z-10 mt-2 w-48 rounded bg-gray-700 py-2 shadow-lg'>
              <li>
                <button onClick={handleLogout} className='block w-full px-4 py-2 hover:bg-blue-400'>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </button>
      </div>
      <div className='px-2'>
        <div className='flex flex-col items-start gap-y-4 text-gray-400 '>
          {chatRooms.length > 0 &&
            chatRooms.map((room) => {
              return (
                <button
                  className={`flex w-full items-center gap-1 rounded-md p-2 text-start hover:bg-gray-700 ${
                    room.id === selectedRoomId && 'font-bold text-white'
                  }`}
                  onClick={() => selectRoom(room.id)}
                  key={room.id}
                >
                  {room.roomType === 'public' ? <BiConversation /> : <AiFillLock />}
                  {room.name}
                </button>
              );
            })}
          <button
            className='flex w-full items-center gap-x-1 rounded-md p-2 text-start hover:bg-gray-700'
            onClick={openCreateRoomModal}
          >
            <AiFillPlusSquare size={20} />
            Create New Room
          </button>
        </div>
      </div>
    </aside>
  );
};
