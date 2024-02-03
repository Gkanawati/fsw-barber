"use client";

import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import SideMenu from './side-menu';

const Header = () => {
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
            <SideMenu />
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
}

export default Header;