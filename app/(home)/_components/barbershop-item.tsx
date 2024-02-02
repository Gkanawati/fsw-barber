"use client";

import { Badge } from '@/app/_components/ui/badge';
import { Button } from '@/app/_components/ui/button';
import { Card, CardContent } from '@/app/_components/ui/card';
import { Barbershop } from '@prisma/client';
import { StarIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface BarbershopItemProps {
  barbershop: Barbershop;
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  const router = useRouter();

  function handleBookingClick() {
    console.log('Booking clicked');
    router.push(`/barbershops/${barbershop.id}`)
  }

  return (
    <Card className='min-w-[167px] max-w-[167px] rounded-2xl'>
      <CardContent className='p-0'>
        <div className="p-1 pb-0">
          <div className='relative w-full h-[159px]'>
            <div className='absolute top-2 left-2 z-50'>
              <Badge variant='secondary' className='flex items-center gap-1 opacity-90'>
                <StarIcon size={12} className='fill-primary text-primary' />
                <span className='text-xs'>5,0</span>
              </Badge>
            </div>
            <Image
              src={barbershop.imageUrl}
              width={0}
              height={0}
              sizes='100vw'
              fill
              style={{ objectFit: 'cover' }}
              className='rounded-2xl'
              alt={barbershop.name}
            />
          </div>
        </div>

        <div className='px-3 pb-3'>
          <h2 className='font-bold mt-2 overflow-hidden text-ellipsis text-nowrap'>{barbershop.name}</h2>
          <p className='text-sm text-gray-400 overflow-hidden text-ellipsis text-nowrap'>{barbershop.address}</p>

          <Button
            onClick={handleBookingClick}
            className='w-full mt-3'
            variant='secondary'
          >
            Reservar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default BarbershopItem;