"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

type Filed = {
    value: Date,
    onChange: (value: Date) => void
}

interface Props {
    field: Filed;
}

export function DatePicker({ field }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={(open) => setOpen(open)}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!field.value}
                    className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal">
                    <CalendarIcon />
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(value) => {
                        if (value) {
                            field.onChange(value);
                            setOpen(false);
                        }
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}