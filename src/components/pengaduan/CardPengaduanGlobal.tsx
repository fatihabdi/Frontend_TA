import * as React from 'react';
import moment from 'moment';

import clsxm from '@/lib/clsxm';

type CardPengaduanProps = {
  className?: string;
  nama: string;
  judul: string;
  waktu: string;
  isiPengaduan: string;
};

export default function CardPengaduan({ className, nama, judul, waktu, isiPengaduan, ...rest }: CardPengaduanProps) {
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
      </div>
      <div className="mt-4 text-Gray-900">
        <h1 className="text-lg font-semibold">{judul}</h1>
        <p className="text-md font-medium text-Gray-500">{isiPengaduan}</p>
      </div>
    </div>
  );
}
