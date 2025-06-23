import { Leaf } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function Logo() {
    return (
        <Link href="/">
            <div className="flex items-center gap-2">
                <Leaf className='w-8 h-8 fill-primary'/>
                <span className="text-2xl font-bold">Finly</span>
            </div>
        </Link>
    )
}
