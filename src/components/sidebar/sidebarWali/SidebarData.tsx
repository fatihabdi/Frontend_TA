import React from 'react';
import { HiOutlineChartSquareBar } from 'react-icons/hi';
import { FiLayers } from 'react-icons/fi';
import { RiArrowDownSLine } from 'react-icons/ri';
import { RiArrowUpSLine } from 'react-icons/ri';
import { LuCopyCheck } from 'react-icons/lu';
import { BiPieChartAlt2 } from 'react-icons/bi';
import { LuBookOpen } from 'react-icons/lu';
import { LuUserSquare2 } from 'react-icons/lu';
import { GoDotFill } from 'react-icons/go';
import { GrTrophy } from 'react-icons/gr';
import { IoReorderThreeOutline } from 'react-icons/io5';

export const SidebarData = [
  {
    title: 'Dashboard',
    path: '/wali/home',
    icon: <HiOutlineChartSquareBar />
  },
  {
    title: 'Kehadiran',
    path: '/kehadiran/',
    icon: <FiLayers />,
    iconClosed: <RiArrowDownSLine />,
    iconOpened: <RiArrowUpSLine />,
    subNav: [
      {
        title: 'List Kehadiran',
        path: '/wali/kehadiran/ListKehadiran',
        icon: <GoDotFill />
      },
      {
        title: 'Jadwal Hari Ini',
        path: '/wali/kehadiran/agenda',
        icon: <GoDotFill />
      },
      {
        title: 'Agenda',
        path: '/wali/kehadiran/agendaGlobal',
        icon: <GoDotFill />
      }
    ]
  },
  {
    title: 'Tugas',
    path: '/tugas',
    icon: <LuCopyCheck />,
    iconClosed: <RiArrowDownSLine />,
    iconOpened: <RiArrowUpSLine />,
    subNav: [
      {
        title: 'Preview Tugas',
        path: '/wali/tugas/preview',
        icon: <GoDotFill />
      },
      {
        title: 'Hasil Tugas',
        path: '/wali/tugas/hasil',
        icon: <GoDotFill />
      },
      {
        title: 'Literasi',
        path: '/wali/tugas/literasi',
        icon: <GoDotFill />
      }
    ]
  },
  {
    title: 'Nilai & Hasil Belajar',
    path: '/reports',
    icon: <BiPieChartAlt2 />,
    iconClosed: <RiArrowDownSLine />,
    iconOpened: <RiArrowUpSLine />,
    subNav: [
      {
        title: 'List Nilai',
        path: '/wali/nilai/list',
        icon: <GoDotFill />
      }
    ]
  },
  {
    title: 'Kuis',
    path: '/messages',
    icon: <LuBookOpen />,
    iconClosed: <RiArrowDownSLine />,
    iconOpened: <RiArrowUpSLine />,
    subNav: [
      {
        title: 'Hasil Kuis',
        path: '/wali/kuis/hasil',
        icon: <GoDotFill />
      }
    ]
  },
  {
    title: 'Prestasi',
    path: '/prestasi',
    icon: <GrTrophy />,
    iconClosed: <RiArrowDownSLine />,
    iconOpened: <RiArrowUpSLine />,
    subNav: [
      {
        title: 'Beranda Prestasi',
        path: '/wali/prestasi/beranda',
        icon: <GoDotFill />
      }
    ]
  },
  {
    title: 'Profil Siswa',
    path: '/support',
    icon: <LuUserSquare2 />,
    iconClosed: <RiArrowDownSLine />,
    iconOpened: <RiArrowUpSLine />,
    subNav: [
      {
        title: 'Data Diri Siswa',
        path: '/wali/profil/datadiri',
        icon: <GoDotFill />
      },
      {
        title: 'Perizinan',
        path: '/wali/profil/dispensasi',
        icon: <GoDotFill />
      },
      {
        title: 'Logbook Pelanggaran',
        path: '/wali/profil/logbookpelanggaran',
        icon: <GoDotFill />
      }
    ]
  },
  {
    title: 'Information Center',
    path: '/wali/profil/pengaduan',
    icon: <IoReorderThreeOutline />
  }
];
