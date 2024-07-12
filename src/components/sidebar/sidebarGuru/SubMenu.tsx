import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

type SubMenuProps = {
  item: {
    title: string;
    path: string;
    icon: React.ReactNode;
    iconClosed?: React.ReactNode;
    iconOpened?: React.ReactNode;
    subNav?: {
      title: string;
      path: string;
      icon: React.ReactNode;
    }[];
  };
};

const SubMenu: React.FC<SubMenuProps> = ({ item }) => {
  const [subnav, setSubnav] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      setSubnav(false); // Reset subnav when route changes if needed
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  const handleClick = () => {
    if (item.title === 'Dashboard') {
      router.push(item.path);
    } else if (item.title === 'Information Center') {
      router.push(item.path);
    } else {
      setSubnav(!subnav);
    }
  };

  const handleClickSub = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <div className="flex items-center w-full gap-4 font-medium text-md">
        <button className="flex items-center w-full gap-4 rounded-md hover:bg-Gray-50 h-[40px]" onClick={handleClick}>
          <div>{item.icon}</div>
          <div className="text-md">{item.title}</div>
          <div>{item.subNav && (subnav ? item.iconOpened : item.iconClosed)}</div>
        </button>
      </div>
      {subnav &&
        item.subNav?.map((subItem, index) => (
          <button
            key={index}
            className="flex items-center w-full gap-4 font-medium rounded-md hover:bg-Gray-50 text-md h-[40px]"
            onClick={() => handleClickSub(subItem.path)}
          >
            <div>{subItem.icon}</div>
            <div>{subItem.title}</div>
          </button>
        ))}
    </>
  );
};

export default SubMenu;
