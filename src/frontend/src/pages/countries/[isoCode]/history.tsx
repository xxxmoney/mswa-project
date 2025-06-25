'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowLeft, Clock } from 'lucide-react';
import { useRouter } from 'next/router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserAvatar } from '@/components/UserAvatar';
import { formatDate, formatValidityEndDate } from '@/lib/utils';
import { getCountriesIsoCodeHistory, getGetCountriesIsoCodeHistoryQueryKey } from '@/modules/api/codegen';
import { QueryLoader } from '@/modules/api/components';
import { CurrencyLink } from '@/modules/currency/components';

export default function CurrencyVersionHistory() {
    const {
        query: { isoCode },
        back,
    } = useRouter();

    const stringIsoCode = isoCode as string;

    // const query = useGetCountriesIsoCodeHistory({ isoCode: isoCode as string }, {}, { query: { enabled: !!isoCode } });

    const query = useQuery({
        queryKey: [getGetCountriesIsoCodeHistoryQueryKey({ isoCode: stringIsoCode })],
        queryFn: async () => {
            const response = await getCountriesIsoCodeHistory({ isoCode: stringIsoCode });

            const newestVersion = response.data?.itemList?.[0];

            if (!newestVersion) {
                throw new Error("Country doesn't exist");
            }

            return { versions: response.data?.itemList, newestVersion };
        },
        enabled: !!isoCode,
    });

    return (
        <QueryLoader query={query}>
            {data => (
                <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'>
                    <div
                        className={
                            'absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23334155" fillOpacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/svg%3E")] opacity-20'
                        }
                    />

                    <div className='relative z-10 p-6'>
                        {/* Header */}
                        <div className='mb-8'>
                            <div className='flex items-center justify-between mb-6'>
                                <div className='flex items-center gap-4'>
                                    <Button
                                        variant='outline'
                                        className='bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50'
                                        onClick={() => back()}
                                    >
                                        <ArrowLeft className='w-4 h-4 mr-2' />
                                        Back
                                    </Button>
                                    <div>
                                        <h1 className='text-3xl font-bold text-white mb-2'>Version History</h1>
                                        <p className='text-slate-300'>
                                            {data.newestVersion?.name} ({data.newestVersion?.isoCode}) - Complete change
                                            history
                                        </p>
                                    </div>
                                </div>

                                {/* User Avatar Dropdown */}
                                <UserAvatar />
                            </div>

                            {/* Current Status Card */}
                            <Card className='bg-slate-800/90 border-slate-700 mb-6'>
                                <CardContent className='px-6'>
                                    <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
                                        <div>
                                            <p className='text-slate-400 text-sm mb-1'>Name</p>
                                            <p className='text-white font-semibold'>{data.newestVersion.name}</p>
                                        </div>
                                        <div>
                                            <p className='text-slate-400 text-sm mb-1'>ISO Code</p>
                                            <p className='text-white font-semibold'>{data.newestVersion.isoCode}</p>
                                        </div>
                                        <div>
                                            <p className='text-slate-400 text-sm mb-1'>Currency</p>
                                            <CurrencyLink
                                                isoCode={data.newestVersion.currencyIsoCode}
                                                name={data.newestVersion.currencyName}
                                            />
                                        </div>
                                        <div>
                                            <p className='text-slate-400 text-sm mb-1'>Current Version</p>
                                            <Badge className='bg-gradient-to-r from-blue-600 to-cyan-600'>
                                                v{data.newestVersion.version}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className='text-slate-400 text-sm mb-1'>Status</p>
                                            <Badge
                                                className={data.newestVersion.isCurrent ? 'bg-green-600' : 'bg-red-600'}
                                            >
                                                {data.newestVersion.isCurrent ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content */}
                        <div className='space-y-6'>
                            {data.versions?.map(version => (
                                <Card key={version.id} className='bg-slate-800/90 border-slate-700'>
                                    <CardContent className='px-6'>
                                        <div className='flex items-center justify-between mb-4'>
                                            <div className='flex items-center gap-4'>
                                                <div className='relative'>
                                                    <div
                                                        className={`w-4 h-4 rounded-full ${version.isCurrent ? 'bg-green-400' : 'bg-slate-600'}`}
                                                    ></div>
                                                </div>
                                                <div>
                                                    <div className='flex items-center gap-3 mb-1'>
                                                        <Badge
                                                            className={`${
                                                                version.isCurrent
                                                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
                                                                    : 'bg-slate-600'
                                                            }`}
                                                        >
                                                            v{version.version}
                                                        </Badge>
                                                        {version.isCurrent && (
                                                            <Badge className='bg-green-600'>Current</Badge>
                                                        )}
                                                    </div>
                                                    <div className='flex items-center gap-2 text-slate-400 text-sm'>
                                                        <Clock className='w-4 h-4' />
                                                        {format(version.updatedAt, 'dd.MM.yyyy HH:mm:ss')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600'>
                                            <div>
                                                <p className='text-slate-400 text-sm mb-1'>Currency Name</p>
                                                <p className='text-white font-semibold'>{version.name}</p>
                                            </div>
                                            <div>
                                                <p className='text-slate-400 text-sm mb-1'>ISO Code</p>
                                                <p className='text-blue-400 font-mono font-semibold'>
                                                    {version.isoCode}
                                                </p>
                                            </div>
                                            <div>
                                                <p className='text-slate-400 text-sm mb-1'>Currency</p>
                                                <CurrencyLink
                                                    isoCode={version.currencyIsoCode}
                                                    name={version.currencyName}
                                                />
                                            </div>
                                            <div>
                                                <p className='text-slate-400 text-sm mb-1'>Valid From</p>
                                                <p className='text-slate-300'>
                                                    {formatDate(new Date(version.validFrom))}
                                                </p>
                                            </div>
                                            <div>
                                                <p className='text-slate-400 text-sm mb-1'>Valid To</p>
                                                <p className='text-slate-300'>
                                                    {formatValidityEndDate(
                                                        version.validTo ? new Date(version.validTo) : undefined,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </QueryLoader>
    );
}
