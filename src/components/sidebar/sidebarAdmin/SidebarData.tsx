import React from 'react';
import { HiOutlineChartSquareBar, HiOutlinePresentationChartBar } from 'react-icons/hi';
import { FiBook, FiCalendar } from 'react-icons/fi';
import { RiArrowDownSLine } from 'react-icons/ri';
import { RiArrowUpSLine } from 'react-icons/ri';
import { LuUserSquare2 } from 'react-icons/lu';
import { GoDotFill } from 'react-icons/go';
import { BsPeople } from 'react-icons/bs';
import { TbUserShare } from 'react-icons/tb';
import { IoReorderThreeOutline } from 'react-icons/io5';

export const SidebarData = [
  {
    title: 'Dashboard',
    path: '/admin/home',
    icon: <HiOutlineChartSquareBar />
  },
  {
    title: 'Mata Pelajaran',
    path: '/materi',
    icon: <FiBook />,
    iconClosed: <RiArrowDownSLine />,
    iconOpened: <RiArrowUpSLine />,
    subNav: [
      {
        title: 'Buat Mata Pelajaran',
        path: '/admin/mata-pelajaran/list',
        icon: <GoDotFill />
      },
      {
        title: 'Assign Guru Pengajar',
        path: '/admin/mata-pelajaran/assign',
        icon: <GoDotFill />
      },
      {
        title: 'List Guru Pengajar',
        path: '/admin/mata-pelajaran/listguru',
        icon: <GoDotFill />
      }
    ]
  },
  {
    title: 'Guru',
    path: '/guru',
    icon: <LuUserSquare2 />,
    iconClosed: <RiArrowDownSLine />,
    iconOpened: <RiArrowUpSLine />,
    subNav: [
      {
        title: 'Akun Guru',
        path: '/admin/guru/akun',
        icon: <GoDotFill />
      }
    ]
  },
  {
    title: 'Kelas',
    path: '/kelas',
    icon: <HiOutlinePresentationChartBar />,
    iconClosed: <RiArrowDownSLine />,
    iconOpened: <RiArrowUpSLine />,
    subNav: [
      {
        title: 'List Kelas',
        path: '/admin/kelas/list',
        icon: <GoDotFill />
      },
      {
        title: 'Assign Mata Pelajaran',
        path: '/admin/kelas/assign',
        icon: <GoDotFill />
      }
    ]
  },
  {
    title: 'Siswa',
    path: '/siswa',
    icon: <BsPeople />,
    iconClosed: <RiArrowDownSLine />,
    iconOpened: <RiArrowUpSLine />,
    subNav: [
      {
        title: 'List Akun Siswa',
        path: '/admin/siswa/list',
        icon: <GoDotFill />
      },
      {
        title: 'Assign ke Kelas',
        path: '/admin/siswa/assign',
        icon: <GoDotFill />
      }
    ]
  },
  {
    title: 'Jadwal & Agenda',
    path: '/jadwal',
    icon: <FiCalendar />,
    iconClosed: <RiArrowDownSLine />,
    iconOpened: <RiArrowUpSLine />,
    subNav: [
      {
        title: 'Buat Jadwal',
        path: '/admin/jadwal/create',
        icon: <GoDotFill />
      },
      {
        title: 'Buat Agenda',
        path: '/admin/agenda/create',
        icon: <GoDotFill />
      }
    ]
  },
  {
    title: 'Wali Murid',
    path: '/wali',
    icon: <TbUserShare />,
    iconClosed: <RiArrowDownSLine />,
    iconOpened: <RiArrowUpSLine />,
    subNav: [
      {
        title: 'Buat Akun',
        path: '/admin/wali/create',
        icon: <GoDotFill />
      },
      {
        title: 'Assign ke Siswa',
        path: '/admin/wali/assign',
        icon: <GoDotFill />
      }
    ]
  },
  {
    title: 'Information Center',
    path: '/admin/pengaduan/list',
    icon: <IoReorderThreeOutline />
  }
];
