import { useState } from 'react';
import { useRouter } from 'next/router';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CountriesTab } from '@/modules/country/components';
import { CurrenciesTab } from '@/modules/currency/components';
import { NotificationsTab } from '@/modules/notification/components';

export const DashboardTabs = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string>((router.query.tab as string) || 'currencies');

    function handleTabChange(value: string) {
        setActiveTab(value);
        router.push({ query: { tab: value } }, undefined, { shallow: true });
    }

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className='space-y-6'>
            <TabsList className='bg-slate-800/90 border-slate-700'>
                <TabsTrigger value='currencies' className='data-[state=active]:bg-blue-600 hover:bg-blue-600/20'>
                    Currencies
                </TabsTrigger>
                <TabsTrigger value='countries' className='data-[state=active]:bg-blue-600 hover:bg-blue-600/20'>
                    Countries
                </TabsTrigger>
                <TabsTrigger value='notifications' className='data-[state=active]:bg-blue-600 hover:bg-blue-600/20'>
                    Change Notifications
                </TabsTrigger>
            </TabsList>

            <TabsContent value='currencies'>
                <CurrenciesTab />
            </TabsContent>

            <TabsContent value='countries'>
                <CountriesTab />
            </TabsContent>

            <TabsContent value='notifications'>
                <NotificationsTab />
            </TabsContent>
        </Tabs>
    );
};
