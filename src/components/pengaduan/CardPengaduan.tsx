import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import moment from 'moment';

import clsxm from '@/lib/clsxm';

type CardPengaduanProps = {
  className?: string;
  nama: string;
  judul: string;
  waktu: string;
  isiPengaduan: string;
  onDelete: () => void; // Function to handle delete
  onEdit?: () => void; // Function to handle edit
};

export default function CardPengaduan({ className, nama, judul, waktu, isiPengaduan, onDelete, onEdit, ...rest }: CardPengaduanProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const time = moment(waktu).startOf('s').fromNow();
  return (
    <div className={clsxm('w-full h-fit border rounded-xl border-Gray-200 p-4', className)} {...rest}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={`https://ui-avatars.com/api/?name=${nama}`} alt="Avatar" width={40} height={40} className="rounded-full" />
          <div>
            <div className="font-semibold text-Gray-900">{nama}</div>
            <div className="text-sm text-Gray-500">{time}</div>
          </div>
        </div>
        <div className="relative" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="text-Gray-500 hover:text-Gray-700">
            <BsThreeDotsVertical />
          </button>
          {showDropdown && (
            <div className="absolute right-0 z-10 w-32 py-2 mt-2 bg-white border rounded-lg shadow-xl bg-Base-white">
              <button onClick={onEdit} className="block w-full px-4 py-2 text-left text-Gray-700 hover:bg-Gray-100">
                Edit
              </button>
              <button onClick={onDelete} className="block w-full px-4 py-2 text-left text-Gray-700 hover:bg-Gray-100">
                Hapus
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 text-Gray-900">
        <h1 className="text-lg font-semibold">{judul}</h1>
        <p className="text-md font-medium text-Gray-500">{isiPengaduan}</p>
      </div>
    </div>
  );
}
