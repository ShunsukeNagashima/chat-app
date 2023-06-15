import { FC } from 'react';

import { RiArrowDropDownLine } from 'react-icons/ri';

type SidebarProps = {
  isOpen: boolean;
  handleLogout: () => Promise<void>;
  toggleDropdown: () => void;
};

export const Sidebar: FC<SidebarProps> = (props) => {
  const { isOpen, handleLogout, toggleDropdown } = props;
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
    </aside>
  );
};
