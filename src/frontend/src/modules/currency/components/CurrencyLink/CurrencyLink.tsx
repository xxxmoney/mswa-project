import Link from 'next/link';

export interface CurrencyLinkProps {
    isoCode: string | undefined;
    name: string | undefined;
}

export const CurrencyLink = ({ isoCode, name }: CurrencyLinkProps) => {
    return (
        <Link href={`/currencies/${isoCode}/history`} className='font-medium text-blue-400 hover:underline'>
            {name} ({isoCode})
        </Link>
    );
};
