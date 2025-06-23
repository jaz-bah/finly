import React from 'react'

export default function BarLoader() {
    return (
        <div className="flex w-full justify-center items-center p-2">
            <div className="flex w-100 h-2 bg-neutral-800 rounded overflow-hidden relative">
                <div className="absolute left-0 h-full w-1/2 bg-neutral-300 animate-slideLeftToRight"></div>
            </div>
        </div>
    )
}
