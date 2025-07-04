"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteRecurring, getUserAllRecurrings } from '@/requests/recurring.request';
import { ObjectId } from '@/types/mongoose.types';
import { IRecurring } from '@/types/recurring.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Loader2, Search, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import BarLoader from '../loader/BarLoader';
import { AddRecurringModal } from '../modal/AddRecurringModal';
import { EditRecurringModal } from '../modal/EditRecurringModal';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

const ITEMS_PER_PAGE = 20;

export default function RecurringTable() {
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<ObjectId[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [type, setType] = useState("all");
    // const [frequency, setFrequency] = useState("all")

    // Query for transactions
    const query = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        type,
        frequency: "all"
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ['recurring', currentPage],
        queryFn: () => getUserAllRecurrings(query),
        enabled: !!session?.user?.id,
        staleTime: 5000 * 5,
    });

    const recurrings = data?.data || [];
    const total = data?.total ?? 0;
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

    // Filter by search
    const filtered = recurrings.filter((tx: IRecurring) =>
        `${tx.type} ${tx.amount} ${tx.note}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );


    //========= handle delete ===========
    const [deletingItem, setDeletingItem] = useState<ObjectId | null>(null);

    const deleteRecurringMutation = useMutation({
        mutationFn: (id: ObjectId) => deleteRecurring(id),
        onSuccess: () => {
            toast.success("Recurring deleted successfully.");

            queryClient.invalidateQueries({ queryKey: ['recurring'] });

            setDeletingItem(null);
        },
        onError: () => {
            toast.error("Failed to delete recurring.");
            setDeletingItem(null);
        },
    });


    const handleDelete = (id: ObjectId) => {
        setDeletingItem(id);
        deleteRecurringMutation.mutate(id);
    };


    const handleBulkDelete = () => {
        selected.forEach((id) => handleDelete(id));
        setSelected([]);
    };


    // ========= handle edit ==========
    const [editModalStatus, setEditModalStatus] = useState(false);
    const [editRecurring, seteditRecurring] = useState<IRecurring | null>(null);
    const handleEdit = (recurring: IRecurring) => {
        seteditRecurring(recurring);
        setEditModalStatus(true);
    };

    useEffect(() => {
        const typeParam = searchParams.get("type");

        if (typeParam) {
            setType(typeParam);
        } else {
            setType("all");
        }
    }, [searchParams]);

    return (
        <>
            <Card className="p-4 mt-6">
                <CardContent>
                    <div className="mb-4 flex flex-col md:flex-row gap-2 items-center justify-between">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-semibold">Transactions</h2>
                            <ToggleGroup variant="outline" type="single" value={type} onValueChange={(value) => {
                                setType(value);
                                setCurrentPage(1);
                            }}>
                                <ToggleGroupItem value="all">All</ToggleGroupItem>
                                <ToggleGroupItem value="income">Income</ToggleGroupItem>
                                <ToggleGroupItem value="expense">Expense</ToggleGroupItem>
                                <ToggleGroupItem value="savings">Savings</ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className='relative md:w-60 lg:w-100'>
                                <Input
                                    type="text"
                                    placeholder="Search by type, amount, or note..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pr-10"
                                />
                                <Search className='absolute right-2 top-1/2 -translate-y-1/2 p-1' />
                            </div>

                            <AddRecurringModal />

                            {selected.length > 0 &&
                                <Button variant='destructive' onClick={handleBulkDelete}>
                                    Delete {selected.length}
                                </Button>
                            }
                        </div>
                    </div>

                    {isLoading && (
                        <BarLoader />
                    )}

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Note</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length > 0 && !error ? (
                                filtered.map((tx: IRecurring) => (
                                    <TableRow
                                        key={`${tx._id}`}
                                    >
                                        <TableCell>
                                            <Input
                                                className='w-4 h-4 cursor-pointer'
                                                type='checkbox'
                                                checked={selected.includes(tx._id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelected([...selected, tx._id]);
                                                    } else {
                                                        setSelected(selected.filter((id) => id !== tx._id));
                                                    }
                                                }}
                                            />
                                        </TableCell>
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
                                        <TableCell className='capitalize'>
                                            {tx.frequency == "weekly" ? (
                                                <Badge variant='default' className='bg-blue-500'>{tx.frequency}</Badge>
                                            ) : (
                                                <Badge variant='default' className='bg-amber-500'>{tx.frequency}</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className='flex gap-2'>
                                                <Button
                                                    className='cursor-pointer user-select-none'
                                                    variant='default'
                                                    size='icon'
                                                    onClick={() => handleEdit(tx)}
                                                >
                                                    <Edit />
                                                </Button>
                                                <Button
                                                    className='cursor-pointer user-select-none'
                                                    variant='destructive'
                                                    size='icon'
                                                    onClick={() => handleDelete(tx._id)}
                                                    disabled={deletingItem === tx._id}
                                                >
                                                    {deletingItem === tx._id ? <Loader2 className='animate-spin' /> : <Trash2 />}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className='text-center'>No transactions found.</TableCell>
                                </TableRow>
                            )}

                        </TableBody>
                    </Table>

                    {/* Pagination controls */}
                    {filtered.length > 0 && filtered.length < total && (
                        <div className='flex justify-center gap-2 mt-4'>
                            <Button
                                className='cursor-pointer user-select-none'
                                disabled={currentPage <= 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                                size={'sm'}
                            >
                                Previous
                            </Button>

                            <span>Page {currentPage} of {totalPages}</span>

                            <Button
                                className='cursor-pointer user-select-none'
                                disabled={currentPage >= totalPages}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                size={'sm'}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {editRecurring &&
                <EditRecurringModal
                    isOpen={editModalStatus}
                    setIsOpen={setEditModalStatus}
                    recurring={editRecurring}
                />
            }
        </>
    )
}

