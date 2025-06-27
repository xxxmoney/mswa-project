import type { PropsWithChildren } from 'react';
import { useSession } from 'next-auth/react';

export const AdminComponent = ({ children }: PropsWithChildren) => {
    const { data: session } = useSession();

    console.log('session', session);

    if (session?.user?.role !== 'admin') return null;

    return <>{children}</>;
};
