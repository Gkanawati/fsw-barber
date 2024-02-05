import { format } from 'date-fns';
import Header from '../_components/header';
import { da, ptBR } from 'date-fns/locale';
import Search from './_components/search';
import BookingItem from '../_components/booking-item';
import BarbershopItem from './_components/barbershop-item';
import { db } from '../_lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function Home() {

  const session = await getServerSession(authOptions);

  const [barbershops, confirmedBookings] = await Promise.all([
    db.barbershop.findMany({}),

    session?.user ? db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          gte: new Date()
        }
      },
      include: {
        service: true,
        barbershop: true
      },
      orderBy: {
        date: 'asc'
      }
    })
      : Promise.resolve([])
  ])

  return (
    <div>
      <Header />

      <div className='pt-5 px-5'>
        <h2 className='text-xl font-bold'>Olá, Miguel!</h2>
        <p className='capitalize text-sm'>{format(new Date(), "EEEE',' d 'de' MMMM", { locale: ptBR })}</p>
      </div>

      <div className='px-5 mt-4'>
        <Search />
      </div>

      {confirmedBookings.length > 0 && (
        <div className="px-5 mt-6 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          <h2 className='text-sm uppercase text-gray-400 font-bold mb-3'>AGENDAMENTOS</h2>
          <div className="flex gap-3">
            {confirmedBookings.map(booking => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      <div className='mt-6'>
        <h2 className='px-5 text-sm uppercase text-gray-400 font-bold mb-3'>Recomendados</h2>

        <div className='px-5 flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden'>
          {barbershops.map((barbershop: any) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>

      <div className='mt-6 mb-[4.5rem]'>
        <h2 className='px-5 text-sm uppercase text-gray-400 font-bold mb-3'>Populares</h2>

        <div className='px-5 flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden'>
          {barbershops.map((barbershop: any) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  );
}
