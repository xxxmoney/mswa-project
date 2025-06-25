import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetCurrencies } from '@/modules/api/codegen';
import { QueryLoader } from '@/modules/api/components/QueryLoader';
import { useController, useFormContext } from 'react-hook-form';

import type { CreateCountrySchema } from '../AddCountryDialog';

export const CurrencySelect = () => {
    const { control } = useFormContext<CreateCountrySchema>();

    const { field } = useController<CreateCountrySchema>({
        control,
        name: 'currencyIsoCode',
    });

    const currenciesQuery = useGetCurrencies();

    return (
        <>
            <Label htmlFor='symbol' className='text-slate-200'>
                Currency
            </Label>

            {/* @ts-expect-error - TODO: fix this */}
            <QueryLoader query={currenciesQuery}>
                {({ data }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className='w-full bg-slate-700/50 border-slate-600 text-white'>
                            <SelectValue placeholder='Select a currency' />
                        </SelectTrigger>
                        <SelectContent className='bg-slate-800 border-slate-700'>
                            {data?.itemList?.map(currency => (
                                <SelectItem key={currency.id} value={currency.isoCode}>
                                    {currency.name} ({currency.isoCode})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </QueryLoader>
        </>
    );
};
