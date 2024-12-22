import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from './ui/button';
import { Input } from './ui/input';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from './ui/label';
import { PlusIcon } from 'lucide-react';

const addTeamToLobby = async (lobbyId: string, name: string) => {
  try {
    const response = await fetch(`/api/lobbies/lobby/${lobbyId}/teams`, {
      method: 'POST',
      body: JSON.stringify({ newTeam: { name } }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add team.');
    }

    const result = await response.json();
    console.log(result.message);
  } catch (error) {
    console.error('Error adding team:', error);
  }
};

export default function AddNewTeam({ lobbyId }: { lobbyId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addTeamToLobby(lobbyId, values.name);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Label>
                  Add new team
                  <Input {...field} placeholder='Enter team name...' />
                </Label>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-fit'>
          <PlusIcon />
          Create team
        </Button>
      </form>
    </Form>
  );
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'name must be at least 2 characters.',
  }),
});
