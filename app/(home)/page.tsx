import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Header from '../_components/header';
import Search from './_components/search';

export default function Home() {
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
    </div>
  );
}
