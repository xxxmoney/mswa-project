import { AlertCircle, Badge, Bell, CheckCircle } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const NotificationsTab = () => {
    return (
        <Card className='bg-slate-800/90 border-slate-700'>
            <CardHeader>
                <CardTitle className='text-white'>Change Notifications</CardTitle>
                <CardDescription className='text-slate-300'>
                    Configure and view notifications for currency data changes
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    <div className='flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600'>
                        <div className='flex items-center gap-3'>
                            <Bell className='w-5 h-5 text-blue-400' />
                            <div>
                                <div className='text-white font-medium'>New Currency Added</div>
                                <div className='text-sm text-slate-400'>
                                    Turkish Lira (TRY) has been added to the system
                                </div>
                            </div>
                        </div>
                        <Badge className='bg-green-600'>New</Badge>
                    </div>

                    <div className='flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600'>
                        <div className='flex items-center gap-3'>
                            <AlertCircle className='w-5 h-5 text-yellow-400' />
                            <div>
                                <div className='text-white font-medium'>Validation Period Expiring</div>
                                <div className='text-sm text-slate-400'>USD validation period expires in 30 days</div>
                            </div>
                        </div>
                        <Badge className='bg-yellow-600'>Warning</Badge>
                    </div>

                    <div className='flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600'>
                        <div className='flex items-center gap-3'>
                            <CheckCircle className='w-5 h-5 text-green-400' />
                            <div>
                                <div className='text-white font-medium'>Version Update Completed</div>
                                <div className='text-sm text-slate-400'>JPY has been updated to version 2.0</div>
                            </div>
                        </div>
                        <Badge className='bg-blue-600'>Info</Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
