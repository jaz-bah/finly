import React from 'react'
import { useSidebar } from '../ui/sidebar';
import useScroll from '@/hooks/use-scroll';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';

export default function AddTransactionBtn() {
    const { isMobile } = useSidebar();
    const scrolled = useScroll();

    return (
        <Button
            className={`
                        ${scrolled ? "fixed bottom-5 right-5 z-50" : ""} 
                        ${isMobile ? "w-12 h-12 rounded-full bottom-20" : "bottom-5"}
                    `}
        >
            {isMobile ? <Plus /> : (
                <>
                    Transaction <Plus />
                </>
            )}

        </Button>
    )
}
