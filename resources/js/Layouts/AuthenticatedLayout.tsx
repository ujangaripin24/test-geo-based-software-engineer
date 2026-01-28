import { HeaderMenu } from '@/Components/HeaderMenu';
import { SidebarMenu } from '@/Components/SidebarMenu';
import { usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
  header,
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {
  const user = usePage().props.auth.user;
  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <HeaderMenu toggleSidebar={toggleSidebar} />

      <SidebarMenu isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setSidebarOpen} />

      <div className="p-4 sm:ml-64 mt-14">
        {header && (
          <header className="bg-white shadow dark:bg-gray-800">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              {header}
            </div>
          </header>
        )}
        <main>{children}</main>
      </div>
    </>
  );
}
