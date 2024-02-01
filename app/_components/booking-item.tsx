import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

const BookingItem = () => {
  return (
    <Card>
      <CardContent className='flex justify-between py-0'>
        <div className='py-5 flex flex-col gap-2'>
          <Badge className='w-fit text-primary bg-[#221c3d] hover:bg-[#221c3d]'>
            Confirmado
          </Badge>
          <h2 className='font-bold'>Corte de Cabelo</h2>

          <div className="flex items-center gap-2">
            <Avatar className='h-6 w-6'>
              <AvatarImage src='https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png' />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>

            <h3 className='text-md'>
              Vintage Barber
            </h3>
          </div>
        </div>

        <div className='pl-5 flex flex-col items-center justify-center border-l border-solid border-secondary'>
          <p className='text-sm'>Fevereiro</p>
          <p className="text-2xl">06</p>
          <p className='text-sm'>09:45</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default BookingItem;