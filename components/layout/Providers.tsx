"use client"

import React from 'react'
import { ThemeProvider } from './ThemeProvider'
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { usePathname } from 'next/navigation'
import Layout from './Layout'

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {pathname !== "/signin" && pathname !== "/signup" ? (
                        <Layout>
                            { children }
                        </Layout>
                    ): (
                        <main>
                            { children }
                        </main>
                    )}
                <Toaster />
            </ThemeProvider>
        </QueryClientProvider>
        </SessionProvider >
    )
}
