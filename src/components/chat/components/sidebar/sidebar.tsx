import { FC } from 'react';

import { AiFillPlusSquare, AiFillLock } from 'react-icons/ai';
import { BiConversation } from 'react-icons/bi';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { RxCross2 } from 'react-icons/rx';

import { Room } from '@/domain/models/room';

type SidebarProps = {
  isOpen: boolean;
  chatRooms: Room[];
  selectedRoomId: string;
  isSidebarOpen: boolean;
  handleLogout: () => Promise<void>;
  toggleDropdown: () => void;
  selectRoom: (room: Room) => void;
  openCreateRoomModal: () => void;
  toggleSidebar: () => void;
};

export const Sidebar: FC<SidebarProps> = (props) => {
  const {
    isOpen,
    chatRooms,
    selectedRoomId,
    isSidebarOpen,
    handleLogout,
    toggleDropdown,
    selectRoom,
    openCreateRoomModal,
    toggleSidebar,
  } = props;
  return (
    <aside
      className={`
      fixed inset-y-0 left-0 z-10
      w-64
      bg-gray-900 p-4 text-white transition-transform duration-300 md:static
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'} md:translate-x-0
    `}
    >
      <div className='mb-8 flex items-center justify-between'>
        <div className='flex items-center gap-x-4'>
          {isSidebarOpen && <RxCross2 size={30} onClick={toggleSidebar} />}
          <h1 className='text-xl font-bold'>Chat App</h1>
        </div>
        <div onClick={toggleDropdown} className='relative' role='button' tabIndex={0}>
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
        </div>
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
                  onClick={() => selectRoom(room)}
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
