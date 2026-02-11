import { usePage } from '@inertiajs/react';
import React from 'react'
import ResponsiveNavLink from './ResponsiveNavLink';
import { Button } from 'flowbite-react';

interface NavigationBarProps {
  toggleSidebar: () => void;
}

export const HeaderMenu: React.FC<NavigationBarProps> = ({toggleSidebar}) => {
  const user = usePage().props.auth.user;
  
  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-default">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <Button onClick={() => toggleSidebar()} data-drawer-target="top-bar-sidebar" data-drawer-toggle="top-bar-sidebar" aria-controls="top-bar-sidebar" type="button" className="sm:hidden text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm p-2 focus:outline-none">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h10" />
                </svg>
              </Button>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div>
                  <button type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                    <span className="sr-only">Open user menu</span>
                    <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
                  </button>
                </div>
                <div className="z-50 hidden bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44" id="dropdown-user">
                  <div className="px-4 py-3 border-b border-default-medium" role="none">
                    <p className="text-sm font-medium text-heading" role="none">
                      {user.name}
                    </p>
                    <p className="text-sm text-body truncate" role="none">
                      {user.email}
                    </p>
                  </div>
                  <ul className="p-2 text-sm text-body font-medium" role="none">
                    <ResponsiveNavLink href={route('profile.edit')}>
                      Profile
                    </ResponsiveNavLink>
                    <ResponsiveNavLink
                      method="post"
                      href={route('logout')}
                      as="button"
                    >
                      Log Out
                    </ResponsiveNavLink>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
