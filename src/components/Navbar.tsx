import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { FiBell } from 'react-icons/fi';
import SecondaryButton from './SecondaryButton';
// import { FiDownloadCloud } from 'react-icons/fi';

export default function Navbar() {
  return (
    <div className="flex items-center justify-between w-screen py-4 pl-2 pr-8 lg:w-full bg-Base-white">
      <div className="flex items-center text-xl font-semibold">Dashboard</div>
      <div className="flex items-center gap-5 text-4xl font-semibold">
        <FiSearch />
        <FiBell />
        <SecondaryButton btnClassName="h-[40px] text-sm">Export</SecondaryButton>
      </div>
    </div>
  );
}
