"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { recurringsFilter } from '@/helper/filter';
import { getUserAllRecurrings, updateRecurring } from '@/requests/recurring.request';
import { createTransaction } from '@/requests/transaction.request';
import { ObjectId } from '@/types/mongoose.types';
import { ICreateRecurringPayload, IRecurring } from '@/types/recurring.types';
import { ICreateTransactionPayload } from '@/types/transaction.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import BarLoader from '../loader/BarLoader';

const ITEMS_PER_PAGE = 200;

export default function RecurringUpdateTable() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const currentPage = 1;

    // Query for transactions
    const query = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        type: 'all',
        frequency: 'all'
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ['recurring', currentPage],
        queryFn: () => getUserAllRecurrings(query),
        enabled: !!session?.user?.id,
        staleTime: 5000 * 5,
    });

    const recurrings = data?.data || [];
    // const total = data?.total ?? 0;
    // const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    const filtered = recurringsFilter(recurrings);


    // update recurring mutation
    const editRecurringMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: ObjectId; payload: ICreateRecurringPayload }) => updateRecurring(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recurring'] });
            setCurrentRecurring(null);
            toast.success("Transaction create successfully.");
        },
        onError: () => {
            toast.error("Failed to create Transaction.");
        }
    });


    // create transaction  mutation
    const createTransactionMutation = useMutation({
        mutationFn: async (payload: ICreateTransactionPayload) => createTransaction(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['transactions-current-month'] });
            queryClient.invalidateQueries({ queryKey: ['transactions-previous-month'] });
            queryClient.invalidateQueries({ queryKey: ['transactions-all-savings'] });

            const date = new Date();

            date.setHours(7, 0, 0, 0);

            if (currentRecurring) {
                const newRecurring = {
                    type: currentRecurring.type,
                    amount: currentRecurring.amount,
                    note: currentRecurring.note,
                    last_updated: date,
                    frequency: currentRecurring.frequency
                }

                editRecurringMutation.mutate({ id: currentRecurring._id, payload: newRecurring });
            }
        },
        onError: () => {
            toast.error("Failed to create transaction.");
        }
    });



    // handle add
    const [currentRecurring, setCurrentRecurring] = useState<IRecurring | null>();

    const handleAdd = (recurring: IRecurring) => {
        setCurrentRecurring(recurring);

        const date = new Date();

        date.setHours(7, 0, 0, 0);

        const newTransaction = {
            type: recurring.type,
            amount: recurring.amount,
            note: recurring.note,
            date
        }

        createTransactionMutation.mutate(newTransaction);
    }

    return (
        <>
            <Card className="p-4 h-full">
                <CardContent>
                    <div className="mb-4 flex flex-col md:flex-row gap-2 items-center justify-between">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">Pending Trasactions</h2>
                        </div>
                    </div>

                    {isLoading && (
                        <BarLoader />
                    )}

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Amount</TableHead>
                                <TableHead>Note</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length > 0 && !error ? (
                                filtered.map((tx: IRecurring) => (
                                    <TableRow
                                        key={`${tx._id}`}
                                    >
                                        <TableCell>${`${tx.amount}`}</TableCell>
                                        <TableCell>{tx.note}</TableCell>
                                        <TableCell className='uppercase'>
                                            {tx.type === 'income' ? (
                                                <Badge variant='default' className='bg-green-500'>{tx.type}</Badge>
                                            ) : tx.type === 'expense' ? (
                                                <Badge variant='default' className='bg-red-400'>{tx.type}</Badge>
                                            ) : (
                                                <Badge variant='default' className='bg-yellow-400'>{tx.type}</Badge>
                                            )}

                                        </TableCell>
                                        <TableCell>
                                            <div className='flex gap-2'>
                                                <Button
                                                    className='cursor-pointer user-select-none'
                                                    variant='default'
                                                    size='icon'
                                                    disabled={currentRecurring ? true : false}
                                                    onClick={() => handleAdd(tx)}
                                                >
                                                    {currentRecurring && currentRecurring._id === tx._id ? (
                                                        <Loader2 className='animate-spin' />
                                                    ) : (
                                                        <Plus />
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className='text-center'>No pending transactions found.</TableCell>
                                </TableRow>
                            )}

                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}

