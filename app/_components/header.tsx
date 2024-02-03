"use client";

import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon, MenuIcon, UserIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarImage } from './ui/avatar';
import Link from 'next/link';

const Header = () => {
  const { data, status } = useSession();

  function handleSignOut() {
    signOut();
  }

  function handleSignIn() {
    signIn("google");
  }

  return (
    <Card>
      <CardContent className='py-3 px-5 justify-between flex flex-row items-center'>
        <Image src="/logo.png" alt="FSW Barber" width={120} height={22} />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline' size='icon' className='w-8 h-8'>
              <MenuIcon size={18} />
            </Button>
          </SheetTrigger>

          <SheetContent className='p-0'>
            <SheetHeader className='text-left p-5 border-b border-solid border-secondary'>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            {data?.user ? (
              <div className="flex justify-between items-center py-6 px-5">
                <div className='flex items-center gap-3'>
                  <Avatar>
                    <AvatarImage src={data.user?.image ?? ""} alt={data.user?.name ?? ""} />
                  </Avatar>

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
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
}

export default Header;