import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { db } from '../_lib/prisma';
import { authOptions } from '../_lib/auth';
import Header from '../_components/header';
import BookingItem from '../_components/booking-item';

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  const [confirmedBookings, finishedBookings] = await Promise.all([
    db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          gte: new Date()
        }
      },
      include: {
        service: true,
        barbershop: true,
      }
    }),
    db.booking.findMany({
      where: {
        userId: (session.user as any).id,
        date: {
          lte: new Date()
        }
      },
      include: {
        service: true,
        barbershop: true,
      }
    })
  ]);

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h1 className='text-xl font-bold'>Agendamentos</h1>

        {confirmedBookings.length > 0 &&
          <>
            <h2 className='text-gray-400 uppercase text-sm mt-6 mb-3'>Confirmados</h2>

            <div className="flex flex-col gap-3">
              {confirmedBookings.reverse().map(booking => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        }

        {finishedBookings.length > 0 &&
          <>
            <h2 className='text-gray-400 uppercase text-sm mt-6 mb-3'>Finalizados</h2>

            <div className="flex flex-col gap-3">
              {finishedBookings.reverse().map(booking => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        }

        {confirmedBookings.length === 0 && finishedBookings.length === 0 &&
          <p className='text-center text-gray-400 mt-6'>Você ainda não possui agendamentos.</p>
        }
      </div>
    </>
  )
}
