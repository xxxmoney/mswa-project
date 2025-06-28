import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { AddCountryDialog } from '../AddCountryDialog';
import { CountriesTable } from '../CountriesTable';
import { AdminComponent } from '@/modules/auth/components';

export const CountriesTab = () => {
    return (
        <Card className='bg-slate-800/90 border-slate-700'>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <div>
                        <CardTitle className='text-white'>Country Reference Data</CardTitle>
                        <CardDescription className='text-slate-300'>
                            Complete list of countries with names, ISO codes, and active currencies
                        </CardDescription>
                    </div>
                    <div className='flex items-center gap-4'>
                        <AdminComponent>
                            <AddCountryDialog />
                        </AdminComponent>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <CountriesTable />
            </CardContent>
        </Card>
    );
};
