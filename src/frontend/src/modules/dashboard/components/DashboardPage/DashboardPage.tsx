'use client';

import { AlertCircle, CheckCircle, Globe, TrendingUp } from 'lucide-react';

import { UserAvatar } from '@/components';
import { useGetCountries, useGetCurrencies } from '@/modules/api/codegen';
import { QueryLoader } from '@/modules/api/components';

import { StatCard } from '../StatCard/StatCard';
import { DashboardTabs } from './DashboardTabs';

export const DashboardPage = () => {
    const countries = useGetCountries();
    const currencies = useGetCurrencies();

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'>
            <div
                className={
                    'absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23334155" fillOpacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-20'
                }
            ></div>

            <div className='relative z-10 p-6'>
                {/* Header */}
                <div className='mb-8'>
                    <div className='flex items-center justify-between mb-4'>
                        <div>
                            <h1 className='text-3xl font-bold text-white mb-2'>Currency Reference Data</h1>
                            <p className='text-slate-300'>
                                Manage countries, ISO codes, and currency information with versioning
                            </p>
                        </div>
                        <div className='flex items-center gap-4'>
                            <UserAvatar />
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
                        <StatCard
                            icon={<Globe className='w-8 h-8 text-blue-400' />}
                            title='Total Currencies'
                            value={
                                // @ts-expect-error QueryLoader is not typed correctly
                                <QueryLoader query={currencies}>{data => data.data?.itemList?.length || 0}</QueryLoader>
                            }
                        />

                        <StatCard
                            icon={<TrendingUp className='w-8 h-8 text-cyan-400' />}
                            title='Active Currencies'
                            // TODO: get total countries from API
                            value={
                                // @ts-expect-error QueryLoader is not typed correctly
                                <QueryLoader query={currencies}>
                                    {data => data.data?.itemList?.filter(c => c.isCurrent).length || 0}
                                </QueryLoader>
                            }
                        />

                        <StatCard
                            icon={<CheckCircle className='w-8 h-8 text-green-400' />}
                            title='Total Countries'
                            // TODO: get total countries from API
                            value={
                                // @ts-expect-error QueryLoader is not typed correctly
                                <QueryLoader query={countries}>{data => data.data?.itemList?.length || 0}</QueryLoader>
                            }
                        />

                        <StatCard
                            icon={<AlertCircle className='w-8 h-8 text-yellow-400' />}
                            title='Active Countries'
                            // TODO: get total countries from API
                            value={
                                // @ts-expect-error QueryLoader is not typed correctly
                                <QueryLoader query={countries}>
                                    {data => data.data?.itemList?.filter(c => c.isCurrent).length || 0}
                                </QueryLoader>
                            }
                        />
                    </div>
                </div>

                <DashboardTabs />
            </div>
        </div>
    );
};
