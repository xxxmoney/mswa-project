import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import z from 'zod';

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
import { getGetCurrenciesQueryKey, postCurrencies } from '@/modules/api/codegen';

const createCurrencySchema = z.object({
    isoCode: z.string().min(1),
    name: z.string().min(1),
    symbol: z.string().min(1),
    validFrom: z.string().min(1),
});

export type CreateCurrencySchema = z.infer<typeof createCurrencySchema>;

export const AddCurrencyDialog = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { register, handleSubmit, reset } = useForm<CreateCurrencySchema>({
        resolver: zodResolver(createCurrencySchema),
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: CreateCurrencySchema) => {
            return postCurrencies(data);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: getGetCurrenciesQueryKey() });
            setIsCreateModalOpen(false);
            reset();
        },
    });

    const onSubmit = (data: CreateCurrencySchema) => {
        mutation.mutate(data);
    };

    return (
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
                <Button className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'>
                    <Plus className='w-4 h-4 mr-2' />
                    Add Currency
                </Button>
            </DialogTrigger>
            <DialogContent className='bg-slate-800 border-slate-700 text-white max-w-2xl'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle className='text-xl font-bold text-white'>Create New Currency</DialogTitle>
                        <DialogDescription className='text-slate-300'>
                            Add a new currency to the reference data system.
                        </DialogDescription>
                    </DialogHeader>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='isoCode' className='text-slate-200'>
                                ISO Currency Code
                            </Label>
                            <Input
                                {...register('isoCode')}
                                placeholder='e.g., USD'
                                maxLength={3}
                                className='bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400'
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='currencyName' className='text-slate-200'>
                                Currency Name
                            </Label>
                            <Input
                                {...register('name')}
                                placeholder='e.g., US Dollar'
                                className='bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400'
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='symbol' className='text-slate-200'>
                                Currency Symbol
                            </Label>
                            <Input
                                {...register('symbol')}
                                placeholder='e.g., $'
                                className='bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400'
                            />
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
                                        {/* @ts-expect-error Invalid type */}
                                        {mutation.error.data?.error || mutation.error.error}
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
                            className='bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50'
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                        >
                            Create Currency
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
