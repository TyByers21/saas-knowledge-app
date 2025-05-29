"use client"

import { usePathname } from 'next/navigation';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { useEffect } from 'react';
import { formUrlQuery } from '@jsmastery/utils';
import { removeKeysFromUrlQuery } from '@jsmastery/utils';
import { cn } from '@/lib/utils';

const SearchInput = () => {

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('topic') || '';
const [searchQuery, setSearchQuery] = useState('');

useEffect(() => {

    const delayDebounceFN = setTimeout(() => {
        if (searchQuery) {
            const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "topic",
                value: searchQuery,
            });

            router.push(newUrl, {scroll: false});
        } else {
            if(pathname === '/companions') {
                const newUrl = removeKeysFromUrlQuery({
                    params: searchParams.toString(),
                    keysToRemove: ["topic"],
                });

                router.push(newUrl, { scroll: false });
            }
        }
    }, 600);
}, [searchQuery, router, searchParams, pathname])

    return (
        <div className='relative border border-black rounded-lg items-center flex gap-2 py-1 px-2 h-fit'>
            <Image src="/icons/search.svg" alt="search" width={15} height={15}/>
            <input
                type="text"
                placeholder="Search Companions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='outline-none w-full'/>
        </div>
    )
}

export default SearchInput