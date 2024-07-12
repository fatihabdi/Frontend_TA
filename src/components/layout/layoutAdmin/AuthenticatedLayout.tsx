import * as React from 'react';
import Navbar from '@/components/Navbar';

import Sidebar from '@/components/sidebar/sidebarAdmin/Sidebar';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  return (
    <div className="lg:flex">
      <Sidebar />
      <div className="flex-auto">
        <main className="flex w-screen h-screen bg-Gray-50 lg:w-full">
          <div className="flex flex-col flex-auto">
            <Navbar />
            <div className="flex flex-col h-screen gap-8 overflow-x-auto lg:p-10">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
