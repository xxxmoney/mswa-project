import { ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';

export interface StatCardProps {
    icon: ReactNode;
    title: ReactNode;
    value: ReactNode;
    textSize?: 'xl' | '2xl';
}

export const StatCard = ({ icon, title, value, textSize = '2xl' }: StatCardProps) => (
    <Card className='bg-slate-800/90 border-slate-700 py-0'>
        <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
                <div>
                    <p className='text-slate-400 text-sm'>{title}</p>
                    <div className='h-[32px]'>
                        <p className={`text-${textSize} font-bold text-white`}>{value}</p>
                    </div>
                </div>
                {icon}
            </div>
        </CardContent>
    </Card>
);
