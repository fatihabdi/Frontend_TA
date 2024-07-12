import * as React from 'react';
import AuthenticatedLayout from '@/components/layout/layoutAdmin/AuthenticatedLayout';
// import Navbar from '@/components/Navbar';
// import { useRouter } from 'next/router';
import Seo from '@/components/Seo';
import AgendaCalendar from '@/components/AgendaCalendar2';

export default function Agenda() {
  return (
    <div>
      <AuthenticatedLayout>
        <Seo templateTitle="Home" />
        <div className="w-full overflow-y-auto h-full p-3 rounded-md shadow-lg bg-Base-white">
          <AgendaCalendar />
        </div>
      </AuthenticatedLayout>
    </div>
  );
}
