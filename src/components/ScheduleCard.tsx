import React from 'react';
import clsxm from '@/lib/clsxm';
import { MdAccessTime } from 'react-icons/md';
import { LuCheckCircle2 } from 'react-icons/lu';

type ScheduleCardProps = {
  className?: string;
  title: string;
  status: string;
  startTime: string;
  endTime: string;
  day: boolean;
};

export default function ScheduleCard({ className, title, status, startTime, endTime, day }: ScheduleCardProps) {
  return (
    <div
      className={clsxm(
        'flex p-4 bg-Base-white rounded-xl border-2 justify-between items-center w-full',
        status === 'done' ? 'border-Success-500 bg-Success-50' : status === 'ongoing' ? 'border-[#F9F546] bg-[#FFFFF1]' : 'border-Gray-300',
        day ? '' : 'hidden',
        className
      )}
    >
      <div className="flex flex-col">
        <h1 className="font-semibold">{title}</h1>
        <p className="text-sm flex mt-2 text-Gray-500">
          <MdAccessTime className="inline-block mr-1 text-xl" />
          {startTime} - {endTime}
        </p>
      </div>
      <LuCheckCircle2
        className={clsxm('text-2xl', status === 'done' ? 'text-Success-600 bg-Success-50' : status === 'ongoing' ? 'hidden' : 'hidden')}
      />
    </div>
  );
}
