import { db } from '@/app/_lib/prisma';
import { Service } from '@prisma/client';
import BarbershopInfo from './_components/barbershop-info';
import ServiceItem from './_components/service-item';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/_lib/auth';

interface BarbershopDetailsPageProps {
  params: {
    id?: string;
  }
}

const BarbershopDetailsPage = async ({ params }: BarbershopDetailsPageProps) => {
  const session = await getServerSession(authOptions);

  if (!params.id) {
    // TODO: Redirect to home page
    return null
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id
    },
    include: {
      services: true
    }
  });

  if (!barbershop) {
    // TODO: Redirect to home page
    return null
  }

  return (
    <>
      <BarbershopInfo barbershop={barbershop} />

      <div className="flex flex-col gap-4 px-5 py-6">
        {barbershop.services.map((service: Service) => (
          <ServiceItem key={service.id} service={service} barbershop={barbershop} isAuthenticated={!!session?.user} />
        ))}
      </div>
    </>
  );
}

export default BarbershopDetailsPage;