"use client"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateRecurring } from "@/requests/recurring.request";
import { ObjectId } from "@/types/mongoose.types";
import { ICreateRecurringPayload, IRecurring } from "@/types/recurring.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
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
    frequency: z.enum(['weekly', 'monthly'], {
        invalid_type_error: "Please select a valid frequency.",
    })
});

interface Props {
    recurring: IRecurring
}

export default function EditRecurringForm({ recurring }: Props) {
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
            type: recurring.type,
            amount: recurring.amount.toString(),
            note: recurring.note,
            frequency: recurring.frequency
        },
    });

    // create recurring mutation
    const editRecurringMutation = useMutation({
        mutationFn: async ({ id, payload }: { id: ObjectId; payload: ICreateRecurringPayload }) => updateRecurring(id, payload),
        onSuccess: () => {
            form.reset();

            queryClient.invalidateQueries({ queryKey: ['recurring'] });

            toast.success("Recurring updated successfully.");
            onClose();
            setIsSubmitting(false);
        },
        onError: () => {
            toast.error("Failed to update recurring.");
            setIsSubmitting(false);
        }
    });


    // submit handler
    function onSubmit(values: z.infer<typeof formSchema>) {
        const { type, amount, note, frequency } = values;

        setIsSubmitting(true);

        if (!session?.user?.id) {
            toast.error("User not found.");
            setIsSubmitting(false);
            return;
        }


        const updateTransaction = {
            type,
            amount: Number(amount),
            note,
            frequency
        }

        editRecurringMutation.mutate({ id: recurring._id, payload: updateTransaction });
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
                        name="frequency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Frequency</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={(value) => field.onChange(value)}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a Frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="weekly">Weekly</SelectItem>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
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
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    )
}
