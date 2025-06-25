import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
    return format(date, 'dd.MM.yyyy HH:mm');
}

export function formatValidityEndDate(date?: Date) {
    if (!date) return 'Present';

    return formatDate(date);
}
