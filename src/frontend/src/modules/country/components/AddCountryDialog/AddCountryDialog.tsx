import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getGetCountriesQueryKey, usePostCountries } from '@/modules/api/codegen';

import { CurrencySelect } from './CurrencySelect';

const createCountrySchema = z.object({
    name: z.string().min(1),
    isoCode: z.string().min(1),
    currencyIsoCode: z.string().min(1),
    validFrom: z.string().min(1),
});

export type CreateCountrySchema = z.infer<typeof createCountrySchema>;

export const AddCountryDialog = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const form = useForm<CreateCountrySchema>({
        resolver: zodResolver(createCountrySchema),
    });

    const { register, handleSubmit, reset } = form;

    const queryClient = useQueryClient();

    const mutation = usePostCountries({
        mutation: {
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: [getGetCountriesQueryKey()] });

                setIsCreateModalOpen(false);
                reset();
            },
        },
    });

    const onSubmit = (data: CreateCountrySchema) => {
        mutation.mutate({ data });
    };

    return (
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
                <Button className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'>
                    <Plus className='w-4 h-4 mr-2' />
                    Add Country
                </Button>
            </DialogTrigger>
            <DialogContent className='bg-slate-800 border-slate-700 text-white max-w-2xl'>
                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle className='text-xl font-bold text-white'>Create New Country</DialogTitle>
                            <DialogDescription className='text-slate-300'>
                                Add a new country to the reference data system.
                            </DialogDescription>
                        </DialogHeader>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-4'>
                            <div className='space-y-2'>
                                <Label htmlFor='name' className='text-slate-200'>
                                    Country Name
                                </Label>
                                <Input
                                    {...register('name')}
                                    placeholder='e.g., United States'
                                    className='bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400'
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='currencyName' className='text-slate-200'>
                                    Country ISO Code
                                </Label>
                                <Input
                                    {...register('isoCode')}
                                    placeholder='e.g., US'
                                    className='bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400'
                                />
                            </div>

                            <div className='space-y-2'>
                                <CurrencySelect />
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='validFrom' className='text-slate-200'>
                                    Valid From
                                </Label>
                                <Input
                                    type='date'
                                    {...register('validFrom')}
                                    className='bg-slate-700/50 border-slate-600 text-white'
                                />
                            </div>
                            {mutation.isError && (
                                <div className='col-span-2'>
                                    <div className='flex items-center justify-between'>
                                        <p className='text-red-500 text-sm'>
                                            An error occurred while creating the country: {mutation.error.message}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                variant='outline'
                                onClick={() => {
                                    setIsCreateModalOpen(false);
                                    reset();
                                }}
                                disabled={mutation.isPending}
                                className='bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50'
                            >
                                Cancel
                            </Button>
                            <Button
                                type='submit'
                                className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                                disabled={mutation.isPending}
                            >
                                Create Country
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
};
