import React, { useState } from 'react';
import Logo from '~/logo-smp.png';
import Image from 'next/image';
import { SidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { LuLifeBuoy } from 'react-icons/lu';
import { useRouter } from 'next/router';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import { RiMenu2Line } from 'react-icons/ri';
import axios from 'axios';

export default function Sidebar() {
  const router = useRouter();
  const [username, setUsername] = useState(''); // Add this line
  const handleClick = () => {
    router.push('/support');
  };

  // State to manage sidebar visibility
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  React.useEffect(() => {
    const username = localStorage.getItem('username') || '';
    setUsername(username);
  }, []);

  const handleLogout = () => {
    axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/profile/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div className="h-screen lg:w-[272px] lg:sticky">
      <div className="lg:w-[272px] flex flex-col lg:items-center h-screen py-8 bg-white">
        <div className="flex justify-between px-7 lg:items-center lg:justify-center">
          <div className="flex gap-2 lg:items-center lg:justify-center">
            <Image src={Logo} alt="Logo" width={32} />
            <h1 className="font-semibold">SMPN 1 Magetan</h1>
          </div>
          <button className="lg:hidden" onClick={toggleSidebar}>
            <RiMenu2Line className="text-3xl" />
          </button>
        </div>
        <div
          id="sidebar"
          className={`lg:flex lg:h-full lg:flex-col lg:justify-between place-content-between ${sidebarVisible ? 'block' : 'hidden'}`}
        >
          <div className="flex flex-col items-start flex-auto w-full gap-2 px-4 py-10">
            {SidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            })}
          </div>
          <div>
            <div className="flex flex-col items-center w-full gap-4 px-4 font-medium text-md">
              <div className="mx-auto border-t w-full border-[#BBBBBB]">
                <div className="flex items-center gap-4 mt-6">
                  <button className="flex items-center gap-4" onClick={() => router.push('/siswa/profile')}>
                    <Image
                      src={`https://ui-avatars.com/api/?name=${username}`}
                      alt="Logo"
                      width={40}
                      height={24}
                      className="rounded-full"
                    />
                    <div>
                      <p className="hidden text-sm font-semibold lg:block">{username}</p>
                    </div>
                  </button>
                  <button onClick={handleLogout}>
                    <FiLogOut className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
