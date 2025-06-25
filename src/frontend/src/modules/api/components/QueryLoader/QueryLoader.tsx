import type { ReactNode } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';

import { Spinner } from '@/components/ui/spinner';

interface QueryLoaderProps<T> {
    query: UseQueryResult<T>;
    children: (data: T) => ReactNode;
}

export const isLoading = (result: UseQueryResult) => result.status === 'pending';

export const QueryLoader = <T,>({ query, children }: QueryLoaderProps<T>) => {
    if (isLoading(query)) {
        return <Spinner show />;
    }

    if (!query.data) {
        return null;
    }

    return <>{children(query.data)}</>;
};
