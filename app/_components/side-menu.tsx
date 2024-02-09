"use client";

import Link from 'next/link';
import { Button } from './ui/button';
import { Avatar, AvatarImage } from './ui/avatar';
import { SheetHeader, SheetTitle } from './ui/sheet';
import { useSession, signOut, signIn } from 'next-auth/react';
import { LogOutIcon, UserIcon, LogInIcon, HomeIcon, CalendarIcon } from 'lucide-react';

const SideMenu = () => {
  const { data } = useSession();
  console.log('SideMenu ~ data:', data);

  function handleSignOut() {
    signOut();
  }

  function handleSignIn() {
    signIn();
  }

  return (
    <>
      <SheetHeader className='text-left p-5 border-b border-solid border-secondary'>
        <SheetTitle>Menu</SheetTitle>
      </SheetHeader>

      {data?.user ? (
        <div className="flex justify-between items-center py-6 px-5">
          <div className='flex items-center gap-3'>
            {data.user.image && (
              <Avatar>
                <AvatarImage src={data.user.image} alt={data.user.name || ""} />
              </Avatar>
            )}

            <h2 className="font-bold">
              {data.user?.name}
            </h2>
          </div>

          <Button variant="secondary" size='icon'>
            <LogOutIcon onClick={handleSignOut} size={18} />
          </Button>
        </div>
      ) : (
        <div className='flex flex-col gap-3 px-5 py-6'>
          <div className="flex items-center gap-3">
            <UserIcon />
            <h2 className='font-bold'>Olá, faça seu login!</h2>
          </div>

          <Button onClick={handleSignIn} variant='secondary' className='w-full justify-start'>
            <LogInIcon size={18} className='mr-2' />
            Fazer login
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3 px-5">
        <Button variant='outline' className='justify-start' asChild>
          <Link href="/">
            <HomeIcon size={18} className='mr-2' />
            Início
          </Link>
        </Button>

        {data?.user && (
          <Button variant='outline' className='justify-start' asChild>
            <Link href="/bookings">
              <CalendarIcon size={18} className='mr-2' />
              Agendamentos
            </Link>
          </Button>
        )}
      </div>
    </>
  );
}

export default SideMenu;