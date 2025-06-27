import { LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const UserAvatar = () => {
    const { data: session } = useSession();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    className='relative h-10 w-10 rounded-full bg-slate-700/50 border border-slate-600 hover:bg-slate-600/50'
                >
                    <Avatar className='h-9 w-9'>
                        <AvatarImage src='/placeholder.svg?height=36&width=36' alt='User' />
                        <AvatarFallback className='bg-gradient-to-r from-blue-600 to-cyan-600 text-white'>
                            {session?.user?.name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 bg-slate-800 border-slate-700' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                        <p className='text-sm font-medium leading-none text-white'>{session?.user?.name}</p>
                        <p className='text-xs leading-none text-slate-400'>{session?.user?.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className='bg-slate-700' />
                <DropdownMenuItem
                    className='text-slate-200 hover:bg-slate-700 hover:text-slate-200 focus:bg-slate-700'
                    onClick={() => signOut()}
                >
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
