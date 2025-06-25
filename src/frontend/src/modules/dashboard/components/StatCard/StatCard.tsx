import { ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';

export interface StatCardProps {
    icon: ReactNode;
    title: ReactNode;
    value: ReactNode;
}

export const StatCard = ({ icon, title, value }: StatCardProps) => (
    <Card className='bg-slate-800/90 border-slate-700 py-0'>
        <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
                <div>
                    <p className='text-slate-400 text-sm'>{title}</p>
                    <p className='text-2xl font-bold text-white'>{value}</p>
                </div>
                {icon}
            </div>
        </CardContent>
    </Card>
);
