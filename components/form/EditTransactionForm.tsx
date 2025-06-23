"use client"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateTransaction } from "@/requests/transaction.request";
import { ObjectId } from "@/types/mongoose.types";
import { ICreateTransactionPayload, ITransaction } from "@/types/transaction.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { DatePicker } from "../DatePicker";
import { Button } from "../ui/button";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
    type: z.enum(['expense', 'income', 'savings'], {
        invalid_type_error: "Please select a valid transaction type.",
    }),
    amount: z.string(),
    note: z.string(),
    date: z.date(),
});

interface Props {
    transaction: ITransaction
}

export default function AddTransactionForm({ transaction }: Props) {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const closeBtnRef = useRef<HTMLButtonElement>(null);

    // states
    const [isSubmitting, setIsSubmitting] = useState(false)

    // close form
    function onClose() {
        if (closeBtnRef.current) {
            closeBtnRef.current.click();
        }
    }

    // form initial value
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: transaction.type,
            amount: transaction.amount.toString(),
            note: transaction.note,
            date: new Date(transaction.date),
        },
    });

    // create transaction mutation
    const editTransactionMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: ObjectId; payload: ICreateTransactionPayload }) => updateTransaction(id, payload),
        onSuccess: () => {
            form.reset();

            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['transactions-this-month'] });
            queryClient.invalidateQueries({ queryKey: ['transactions-previous-month'] });
            queryClient.invalidateQueries({ queryKey: ['transactions-all-savings'] });

            toast.success("Transaction updated successfully.");
            onClose();
            setIsSubmitting(false);
        },
        onError: () => {
            toast.error("Failed to update transaction.");
            setIsSubmitting(false);
        }
    });


    // submit handler
    function onSubmit(values: z.infer<typeof formSchema>) {
        const { type, amount, note, date } = values;

        setIsSubmitting(true);

        if (!session?.user?.id) {
            toast.error("User not found.");
            setIsSubmitting(false);
            return;
        }

        date.setHours(7, 0, 0, 0);

        const updateTransaction = {
            userId: session.user.id,
            type,
            amount: Number(amount),
            note,
            date
        }

        editTransactionMutation.mutate({ id: transaction._id, payload: updateTransaction });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(value) => field.onChange(value)}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="income">Income</SelectItem>
                                                <SelectItem value="expense">Expense</SelectItem>
                                                <SelectItem value="savings">Savings</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}

                    />

                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter amount"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Note</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter note" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                    <DatePicker field={field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" ref={closeBtnRef}>Cancel</Button>
                    </DialogClose>
                    <Button type="submit">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )
}
