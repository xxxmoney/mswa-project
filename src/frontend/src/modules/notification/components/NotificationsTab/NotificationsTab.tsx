import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetNotifications } from '@/modules/api/codegen';

import { NotificationCard } from '../NotificationCard';

export const NotificationsTab = () => {
    const { data: notifications } = useGetNotifications();

    return (
        <Card className='bg-slate-800/90 border-slate-700'>
            <CardHeader>
                <CardTitle className='text-white'>Change Notifications</CardTitle>
                <CardDescription className='text-slate-300'>
                    View notifications for currency and country data changes
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    {notifications?.data?.notifications?.map(notification => (
                        <NotificationCard key={notification.id} notification={notification} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
