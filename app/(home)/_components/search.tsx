"use client"

import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { SearchIcon } from 'lucide-react';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/_components/ui/form"
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  search: z.string({
    required_error: 'Campo obrigatório',
  }).trim().min(1, 'Campo obrigatório'),
})

interface SearchProps {
  defaultValues?: z.infer<typeof formSchema>
}

const Search = ({ defaultValues }: SearchProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  function handleSubmitSearchForm(values: z.infer<typeof formSchema>) {
    router.push(`/barbershops?search=${values.search}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitSearchForm)} className='flex items-center gap-2'>
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <Input placeholder='Busque por uma barbearia...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant='default' type="submit">
          <SearchIcon size={20} />
        </Button>
      </form>
    </Form>
  );
}

export default Search;