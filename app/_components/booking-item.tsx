"use client"

import { useState } from 'react';
import Image from 'next/image';
import { format, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Prisma } from '@prisma/client';
import { cancelBooking } from '../_actions/cancel-booking';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from './ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from './ui/alert-dialog';
import { Loader2 } from 'lucide-react';

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true;
      barbershop: true;
    };
  }>;
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const isBookingFinished = isPast(booking.date);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  async function handleCancelClick() {
    setIsDeleteLoading(true);

    try {
      await cancelBooking(booking.id);
      toast.success('Reserva cancelada com sucesso!');
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleteLoading(false);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className='min-w-[99%]'>
          <CardContent className='flex p-0'>
            <div className='pl-5 py-5 flex flex-col flex-[3] gap-2'>
              <Badge variant={isBookingFinished ? 'secondary' : 'default'} className='w-fit'>
                {isBookingFinished ? 'Finalizado' : 'Confirmado'}
              </Badge>
              <h2 className='font-bold'>{booking.service.name}</h2>

              <div className="flex items-center gap-2">
                <Avatar className='h-6 w-6'>
                  <AvatarImage src={booking.barbershop.imageUrl} />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>

                <h3 className='text-md'>{booking.barbershop.name}</h3>
              </div>
            </div>

            <div className='flex flex-1 flex-col items-center justify-center border-l border-solid border-secondary'>
              <p className='text-sm capitalize'>{format(booking.date, "MMMM", { locale: ptBR })}</p>
              <p className="text-2xl">{format(booking.date, "dd", { locale: ptBR })}</p>
              <p className='text-sm capitalize'>{format(booking.date, "iii", { locale: ptBR })}</p>
              <p className='text-sm'>{format(booking.date, "HH:mm", { locale: ptBR })}</p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>

      <SheetContent className='px-0'>
        <SheetHeader className='px-5 text-left pb-6 border-b border-solid border-secondary'>
          <SheetTitle>
            Informações da Reserva
          </SheetTitle>
        </SheetHeader>

        <div className="px-5">
          <div className="relative w-full h-[180px] mt-6">
            <Image
              src="/barbershop-map.png"
              fill
              className='rounded-md'
              alt={booking.barbershop.name}
            />

            <div className="w-full mx-auto absolute bottom-4 left-0 px-5">
              <Card>
                <CardContent className='p-3 flex gap-2'>
                  <Avatar>
                    <AvatarImage src={booking.barbershop.imageUrl} />
                  </Avatar>

                  <div>
                    <h2 className='font-bold'>{booking.barbershop.name}</h2>
                    <h3 className='text-xs overflow-hidden text-nowrap text-ellipsis'>
                      {booking.barbershop.address}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Badge variant={isBookingFinished ? 'secondary' : 'default'} className='w-fit my-3'>
            {isBookingFinished ? 'Finalizado' : 'Confirmado'}
          </Badge>

          <div className="py-3 border-t border-solid border-secondary">
            <Card>
              <CardContent className='p-3 flex flex-col gap-3'>
                <div className="flex justify-between items-center">
                  <h2 className='font-bold'>{booking.service.name}</h2>
                  <h3 className="font-bold text-sm">
                    {Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(Number(booking.service.price))}
                  </h3>
                </div>

                <div className="flex justify-between">
                  <h3 className="text-gray-400 text-sm">Data</h3>
                  <h4 className={`text-sm ${booking.date ? '' : 'text-gray-400'}`}>
                    {booking.date ? format(booking.date, "dd 'de' MMMM", { locale: ptBR }) : "-"}
                  </h4>
                </div>

                <div className="flex justify-between">
                  <h3 className="text-gray-400 text-sm">Horário</h3>
                  <h4 className={`text-sm ${booking.date ? '' : 'text-gray-400'}`}>
                    {format(booking.date, 'HH:mm') ?? "-"}
                  </h4>
                </div>

                <div className="flex justify-between">
                  <h3 className="text-gray-400 text-sm">Barbearia</h3>
                  <h4 className="text-sm">{booking.barbershop.name}</h4>
                </div>
              </CardContent>
            </Card>
          </div>

          <SheetFooter className='flex-row w-full gap-3 mt-6'>
            <SheetClose asChild>
              <Button className='w-full' variant='secondary'>
                Voltar
              </Button>
            </SheetClose>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={isBookingFinished || isDeleteLoading} className='w-full' variant='destructive'>
                  Cancelar Reserva
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className='w-[90%]'>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancelar Reserva</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja cancelar esse agendamento?
                    <br /> Essa ação não poderá ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='flex-row gap-3'>
                  <AlertDialogCancel className='w-full mt-0'>Voltar</AlertDialogCancel>
                  <AlertDialogAction className='w-full' disabled={isDeleteLoading} onClick={handleCancelClick}>
                    {isDeleteLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default BookingItem;