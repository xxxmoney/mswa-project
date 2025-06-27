import { ReactNode } from 'react';
import { format } from 'date-fns';
import { Archive, Clock, Pencil, Sparkles } from 'lucide-react';

import { Notification, NotificationType } from '@/modules/api/codegen';

const iconMap = {
    CREATE: <Sparkles className='text-green-500' />,
    UPDATE: <Pencil className='text-blue-500' />,
    ARCHIVE: <Archive className='text-red-500' />,
} as const satisfies Record<NotificationType, ReactNode>;

export interface NotificationCardProps {
    notification: Notification;
}

export const NotificationCard = ({ notification }: NotificationCardProps) => {
    return (
        <div
            className='flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600'
            key={notification.id}
        >
            <div className='flex items-center gap-3'>
                {iconMap[notification.type]}
                <div>
                    <div className='text-white font-medium'>{notification.message}</div>
                    <div className='text-sm text-slate-400'>{notification.message}</div>
                </div>
            </div>
            <div className='flex items-center gap-2 text-slate-400 text-sm'>
                <Clock className='w-4 h-4' />
                {format(notification.createdAt, 'dd.MM.yyyy HH:mm')}
            </div>
        </div>
    );
};
