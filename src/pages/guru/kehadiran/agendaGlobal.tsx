import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutGuru/AuthenticatedLayout';
// import Navbar from '@/components/Navbar';
// import { useRouter } from 'next/router';
import Seo from '@/components/Seo';
import AgendaCalendar from '@/components/AgendaCalendarGlobal';

export default function Agenda() {
  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="w-full h-full p-3 overflow-y-auto rounded-md shadow-lg bg-Base-white">
          <AgendaCalendar />
        </div>
      </AuthenticatedLayout>
    </div>
  );
}
