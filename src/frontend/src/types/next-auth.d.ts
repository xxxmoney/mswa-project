import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            name?: string;
            role?: 'admin' | 'user';
        };
    }

    interface User {
        id: string;
        email: string;
        name?: string;
        role?: 'admin' | 'user';
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
    }
}
