import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { AddCurrencyDialog } from '../AddCurrencyDialog';
import { CurrenciesTable } from '../CurrenciesTable';

export const CurrenciesTab = () => (
    <Card className='bg-slate-800/90 border-slate-700'>
        <CardHeader>
            <div className='flex items-center justify-between'>
                <div>
                    <CardTitle className='text-white'>Currency Reference Data</CardTitle>
                    <CardDescription className='text-slate-300'>
                        Complete list of countries with ISO codes, currency codes, and names
                    </CardDescription>
                </div>
                <div className='flex items-center gap-4'>
                    <AddCurrencyDialog />
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <CurrenciesTable />
        </CardContent>
    </Card>
);
