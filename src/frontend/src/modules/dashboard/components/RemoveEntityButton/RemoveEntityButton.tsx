import { useState } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { Archive } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { AdminComponent } from '@/modules/auth/components';

export interface RemoveEntityButtonProps<T extends UseMutationResult<unknown, Error, unknown>> {
    isPending: boolean;
    onSuccess: () => void;
}

export const RemoveEntityButton = <T extends UseMutationResult<unknown, Error, unknown>>({
    isPending,
    onSuccess,
}: RemoveEntityButtonProps<T>) => {
    const [isModalOpened, setIsModalOpened] = useState(false);

    return (
        <Dialog
            open={isModalOpened}
            onOpenChange={open => {
                if (!isPending) {
                    setIsModalOpened(open);
                }
            }}
        >
            <DialogTrigger asChild>
                <AdminComponent>
                    <Button
                        size='sm'
                        variant='ghost'
                        className='text-red-400 hover:bg-red-400'
                        onClick={() => setIsModalOpened(true)}
                    >
                        <Archive className='w-4 h-4' />
                    </Button>
                </AdminComponent>
            </DialogTrigger>
            <DialogContent className='bg-slate-800 border-slate-700 text-white max-w-2xl'>
                <DialogHeader>
                    <DialogTitle className='text-xl font-bold text-white'>
                        You are about to archive an entity
                    </DialogTitle>
                    <DialogDescription className='text-slate-300'>
                        This action is irreversible. Are you sure you want to proceed?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant='outline' onClick={() => setIsModalOpened(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button
                        variant='destructive'
                        onClick={() => {
                            onSuccess();
                            setIsModalOpened(false);
                        }}
                        disabled={isPending}
                    >
                        Archive
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
