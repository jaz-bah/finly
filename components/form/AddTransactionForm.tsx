"use client"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createTransaction } from "@/requests/transaction.request";
import { ICreateTransactionPayload } from "@/types/transaction.type";
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


export default function AddTransactionForm() {
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
            amount: "",
            note: "",
            date: new Date(),
        },
    });

    // create transaction mutation
    const createTransactionMutation = useMutation({
        mutationFn: async (payload: ICreateTransactionPayload) => createTransaction(payload),
        onSuccess: () => {
            form.reset();
            
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            
            toast.success("Transaction created successfully.");
            onClose();
            setIsSubmitting(false);
        },
        onError: () => {
            toast.error("Failed to create transaction.");
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

        const newTransaction = {
            userId: session.user.id,
            type,
            amount: Number(amount),
            note,
            date
        }

        createTransactionMutation.mutate(newTransaction);
    }


    // random expense creator

    // const createExpense = (count: number) => {
    //     for (let i = 0; i < count; i++) {
    //         if (!session?.user?.id) return;
    
    //         // Set the day to i + 1
    //         const newDate = new Date();
    //         newDate.setMonth(newDate.getMonth() - 1); // go to previous month
    //         newDate.setDate(i + 1);
    //         newDate.setHours(0, 0, 0, 0);
    
    //         const newTransaction = {
    //             userId: session?.user?.id,
    //             type: 'expense' as const,
    //             amount: Math.floor(Math.random() * 1000),
    //             note: `Expense ${i + 1}`,
    //             date: newDate,
    //         }
    
    //         createTransactionMutation.mutate(newTransaction);
    //     }
    // }
    

    // useEffect(() => {
    //     createExpense(30);
    // },[session?.user?.id])

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
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add"}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )
}
