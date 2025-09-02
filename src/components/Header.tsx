import React from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

// Define the props interface
interface HeaderProps {
  sideBarDis: boolean;
  setSideBarDis: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sideBarDis, setSideBarDis }) => {
  return (
    <div className='fixed w-full z-20 h-16 bg-[var(--mainCol)] text-white flex items-center ease-in-out'>
      <div className='flex items-center px-4'>
        {sideBarDis ? (
          <IoClose 
            className='mr-2 cursor-pointer' 
            onClick={() => setSideBarDis(!sideBarDis)} 
          />
        ) : (
          <GiHamburgerMenu 
            className='mr-2 cursor-pointer' 
            onClick={() => setSideBarDis(!sideBarDis)} 
          />
        )}
        <div>Product Dashboard</div>
      </div>
    </div>
  )
}

export default Header