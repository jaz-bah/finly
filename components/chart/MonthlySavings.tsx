"use client"

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { sumSavingsByDate } from "@/helper/filter"
import { moneyFormatter } from "@/helper/formater"
import { ITransaction } from "@/types/transaction.type"
import { useEffect, useMemo, useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"

export const description = "A horizontal bar chart"

const chartConfig = {
    amount: {
        label: "amount",
        color: "var(--color-yellow-500)",
    },
} satisfies ChartConfig

interface Props {
    allSavingsTransactions: ITransaction[]
}

export function MonthlySavings({ allSavingsTransactions }: Props) {
    // Memoize the summed data
    const getChartData = useMemo(
        () => sumSavingsByDate(allSavingsTransactions),
        [allSavingsTransactions]
    );

    // states
    const [chartData, setChartData] = useState(getChartData.slice(0, 6));
    const pageSize = 6;
    const [page, setPage] = useState(0);

    const canGoPrev = page > 0;
    const canGoNext = (page + 1) * pageSize < getChartData.length;

    useEffect(() => {
        const start = page * pageSize;
        const end = start + pageSize;
        setChartData(getChartData.slice(start, end));
    }, [getChartData, page]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Savings</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-full">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        maxBarSize={30}
                        margin={{
                            left: -20,
                        }}
                    >
                        <XAxis type="number" dataKey="amount" hide />
                        <YAxis
                            dataKey="date"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="amount" fill="var(--color-yellow-500)" radius={5} >
                            <LabelList
                                dataKey="amount"
                                position="right"
                                offset={8}
                                className="fill-(--color-yellow-500)"
                                fontSize={12}
                                formatter={(value: number) => moneyFormatter(value)}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>


            <CardFooter>
                <ToggleGroup type="single" variant="outline">
                    <ToggleGroupItem
                        className="user-select-none"
                        value="prev"
                        onClick={() => canGoPrev && setPage((prev) => prev - 1)}
                        disabled={!canGoPrev}
                        aria-label="Previous"
                    >
                        Prev
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        className="user-select-none"
                        value="next"
                        onClick={() => canGoNext && setPage((prev) => prev + 1)}
                        disabled={!canGoNext}
                        aria-label="Next"
                    >
                        Next
                    </ToggleGroupItem>
                </ToggleGroup>
            </CardFooter>
        </Card >
    )
}
