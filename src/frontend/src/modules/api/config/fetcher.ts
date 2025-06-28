import { up } from 'up-fetch';

const upfetch = up(fetch, () => ({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
}));

export const fetcher = async <T>(props: Request): Promise<T> => {
    const { url, data, ...rest } = props;

    return upfetch<T>(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        ...rest,
        ...(data ? { body: data } : {}),
    });
};
