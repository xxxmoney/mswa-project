import { formatDate } from 'date-fns';
import { History } from 'lucide-react';
import { useRouter } from 'next/router';

import { useDeleteCurrenciesIsoCode, useGetCurrencies } from '@/modules/api/codegen';
import { QueryLoader } from '@/modules/api/components';
import { RemoveEntityButton } from '@/modules/dashboard/components';

import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';

export const CurrenciesTable = () => {
    const query = useGetCurrencies();

    const router = useRouter();
    const archiveCurrency = useDeleteCurrenciesIsoCode();

    return (
        // @ts-expect-error QueryLoader is not typed correctly
        <QueryLoader query={query}>
            {data => (
                <Table>
                    <TableHeader>
                        <TableRow className='border-slate-700'>
                            <TableHead className='text-slate-300'>Name</TableHead>
                            <TableHead className='text-slate-300'>ISO Code</TableHead>
                            <TableHead className='text-slate-300'>Symbol</TableHead>
                            <TableHead className='text-slate-300'>Version</TableHead>
                            <TableHead className='text-slate-300'>Valid Period</TableHead>
                            <TableHead className='text-slate-300'>Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {(data?.data?.itemList || []).map(currency => (
                            <TableRow key={currency.id} className='border-slate-700 hover:bg-slate-700/30'>
                                <TableCell className='text-white font-medium'>{currency.name}</TableCell>
                                <TableCell className='text-slate-300'>{currency.isoCode}</TableCell>
                                <TableCell className='text-cyan-400 font-bold'>{currency.symbol}</TableCell>
                                <TableCell className='text-slate-300'>
                                    <Badge variant='outline' className='border-slate-600 text-slate-300'>
                                        v{currency.version}
                                    </Badge>
                                </TableCell>
                                <TableCell className='text-slate-300 text-sm'>
                                    {formatDate(new Date(currency.validFrom), 'dd.MM.yyyy HH:mm')} -{' '}
                                    {currency.validTo
                                        ? formatDate(new Date(currency.validTo), 'dd.MM.yyyy HH:mm')
                                        : 'Present'}
                                </TableCell>
                                <TableCell>
                                    <Badge className={currency.isCurrent ? 'bg-green-600' : 'bg-red-600'}>
                                        {currency.isCurrent ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className='items-center grid grid-cols-2 w-[80px] ml-auto'>
                                        <Button
                                            size='sm'
                                            variant='ghost'
                                            className='text-slate-400'
                                            onClick={() => router.push(`/currencies/${currency.isoCode}/history`)}
                                        >
                                            <History className='w-4 h-4' />
                                        </Button>
                                        {currency.isCurrent && (
                                            <RemoveEntityButton
                                                onSuccess={() => {
                                                    archiveCurrency.mutate({
                                                        pathParams: { isoCode: currency.isoCode },
                                                    });
                                                }}
                                                isPending={archiveCurrency.isPending}
                                            />
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </QueryLoader>
    );
};
