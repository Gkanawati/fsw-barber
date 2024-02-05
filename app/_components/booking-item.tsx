import { Booking, Prisma } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { format, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

  return (
    <Card className='min-w-full'>
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
  );
}

export default BookingItem;