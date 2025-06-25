import { History } from 'lucide-react';
import { useRouter } from 'next/router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { useGetCountries } from '@/modules/api/codegen';
import { QueryLoader } from '@/modules/api/components';
import { CurrencyLink } from '@/modules/currency/components';

export const CountriesTable = () => {
    const query = useGetCountries();

    const router = useRouter();

    return (
        // @ts-expect-error QueryLoader is not typed correctly
        <QueryLoader query={query}>
            {data => (
                <Table>
                    <TableHeader>
                        <TableRow className='border-slate-700'>
                            <TableHead className='text-slate-300'>Country</TableHead>
                            <TableHead className='text-slate-300'>ISO Code</TableHead>
                            <TableHead className='text-slate-300'>Currency</TableHead>
                            <TableHead className='text-slate-300'>Version</TableHead>
                            <TableHead className='text-slate-300'>Valid Period</TableHead>
                            <TableHead className='text-slate-300'>Status</TableHead>
                            <TableHead className='text-slate-300'>Changes</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {(data?.data?.itemList || []).map(country => (
                            <TableRow key={country.id} className='border-slate-700 hover:bg-slate-700/30'>
                                <TableCell className='text-white font-medium'>{country.name}</TableCell>
                                <TableCell className='text-slate-300'>{country.isoCode}</TableCell>
                                <TableCell>
                                    <CurrencyLink isoCode={country.currency?.isoCode} name={country.currency?.name} />
                                </TableCell>
                                <TableCell className='text-slate-300'>
                                    <Badge variant='outline' className='border-slate-600 text-slate-300'>
                                        v{country.version}
                                    </Badge>
                                </TableCell>
                                <TableCell className='text-slate-300 text-sm'>
                                    {formatDate(new Date(country.validFrom))} -{' '}
                                    {country.validTo ? formatDate(new Date(country.validTo)) : 'Present'}
                                </TableCell>
                                <TableCell>
                                    <Badge className={country.isCurrent ? 'bg-green-600' : 'bg-red-600'}>
                                        {country.isCurrent ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className='flex items-center gap-2'>
                                        <Button
                                            size='sm'
                                            variant='ghost'
                                            className='text-slate-400 hover:text-white'
                                            onClick={() => router.push(`/countries/${country.isoCode}/history`)}
                                        >
                                            <History className='w-4 h-4' />
                                        </Button>
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
