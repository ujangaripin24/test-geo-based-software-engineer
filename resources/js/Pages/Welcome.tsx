import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card } from 'flowbite-react';
import { MapContainer, TileLayer } from 'react-leaflet';

export default function Welcome({
  auth,
}: PageProps) {
  const position: [number, number] = [-6.200000, 106.816666];
  return (
    <>
      <Head title="Welcome" />``
      <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
        <div className="relative flex min-h-screen flex-col items-center selection:bg-[#FF2D20] selection:text-white">
          <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
            <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
              <div className="flex lg:col-start-2 lg:justify-center">
                <svg className="h-12 w-auto text-[#FF2D20]" viewBox="0 0 62 65" fill="none">
                  <path d="M61.8548 14.6253..." fill="currentColor" />
                </svg>
              </div>

              <nav className="-mx-3 flex flex-1 justify-end gap-2 sm:gap-4">
                {auth.user ? (
                  <Link href={route('dashboard')} className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 dark:text-white">
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href={route('login')} className="rounded-md px-3 py-2 text-sm sm:text-base text-black ring-1 ring-transparent transition hover:text-black/70 dark:text-white">
                      Log in
                    </Link>
                    <Link href={route('register')} className="rounded-md px-3 py-2 text-sm sm:text-base text-black ring-1 ring-transparent transition hover:text-black/70 dark:text-white">
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </header>

            <main className="mt-6">
              <div className='flex items-center justify-center py-12 px-4'>
                <Card href="#" className="max-w-sm w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
                  <h5 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Noteworthy technology acquisitions 2021
                  </h5>
                  <p className="font-normal text-sm sm:text-base text-gray-700 dark:text-gray-400">
                    Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
                  </p>
                </Card>
              </div>
            </main>

            <footer className="py-16 text-center text-sm text-black dark:text-white/70">
              Laravel v
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
