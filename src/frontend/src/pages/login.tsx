import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'admin@admin.com',
            password: 'AdminPassword123',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError('root', { message: 'Invalid email or password' });
            } else {
                // Redirect to dashboard or home page after successful login
                router.push('/');
            }
        } catch {
            setError('root', { message: 'An error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8'>
            <div
                className={
                    'absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fillRule=\"evenodd\"%3E%3Cg fill=\"%23334155\" fillOpacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-20'
                }
            ></div>

            <Card className='w-full max-w-md bg-slate-800/90 border-slate-700 backdrop-blur-sm shadow-2xl'>
                <CardHeader className='space-y-1'>
                    <CardTitle className='text-2xl font-bold text-center text-white'>Welcome Back</CardTitle>
                    <CardDescription className='text-center text-slate-300'>
                        Sign in to continue to your account
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                    <CardContent className='space-y-4'>
                        {errors.root && (
                            <div className='p-3 bg-red-500/10 border border-red-500/20 rounded-md'>
                                <p className='text-red-400 text-sm'>{errors.root.message}</p>
                            </div>
                        )}

                        <div className='space-y-2'>
                            <Label htmlFor='email' className='text-slate-200'>
                                Email
                            </Label>
                            <Input
                                id='email'
                                type='email'
                                placeholder='Enter your email'
                                {...register('email')}
                                className={`bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 ${
                                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                                }`}
                            />
                            {errors.email && <p className='text-red-400 text-sm'>{errors.email.message}</p>}
                        </div>

                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <Label htmlFor='password' className='text-slate-200'>
                                    Password
                                </Label>
                            </div>
                            <Input
                                id='password'
                                type='password'
                                placeholder='Enter your password'
                                {...register('password')}
                                className={`bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 ${
                                    errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                                }`}
                            />
                            {errors.password && <p className='text-red-400 text-sm'>{errors.password.message}</p>}
                        </div>
                    </CardContent>

                    <CardFooter className='flex flex-col space-y-4'>
                        <Button
                            type='submit'
                            disabled={isLoading}
                            className='w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-200'
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Button>

                        <div className='text-center text-sm text-slate-400'>
                            {"Don't have an account? "}
                            <Link
                                href='/signup'
                                className='text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors'
                            >
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

// export const getServerSideProps: GetServerSideProps = async context => {
//     const session = await getSession(context);

//     // If user is already logged in, redirect to home page
//     if (session) {
//         return {
//             redirect: {
//                 destination: '/',
//                 permanent: false,
//             },
//         };
//     }

//     return {
//         props: {},
//     };
// };
