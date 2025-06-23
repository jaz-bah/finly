import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

import { ITransaction } from "@/types/transaction.type";

import { useEffect, useMemo, useState } from "react";

import { sumExpensesByDate } from "@/helper/filter";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { moneyFormatter } from "@/helper/formater";

export const description = "A bar chart of daily expenses for this week";

const chartConfig = {
    amount: {
        label: "Amount",
        color: "var(--color-red-400)", // fallback color
    },
} satisfies ChartConfig;

interface Props {
    allTransactions: ITransaction[];
}

export function WeeklyChart({ allTransactions }: Props) {
    const month = new Date().toLocaleDateString("default", { month: "long" });
    const year = new Date().getFullYear();

    // Memoize the summed data
    const getChartData = useMemo(
        () => sumExpensesByDate(allTransactions),
        [allTransactions]
    );

    // Store it in state
    const [allChartData, setAllChartData] = useState(getChartData);
    const [chartData, setChartData] = useState(getChartData.slice(0, 7));

    const [week, setWeek] = useState(1);

    // Update when getChartData or week change
    useEffect(() => {
        setAllChartData(getChartData);
        setChartData(getChartData.slice((week - 1) * 7, week * 7));
    }, [getChartData, week]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Weekly Expense Chart</CardTitle>
                <CardDescription>
                    {month} {year}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }} maxBarSize={40}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="amount" fill="var(--color-amount)" radius={8}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                                formatter={(value : number) => moneyFormatter(value)}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex items-center gap-2 w-full overflow-y-scroll">
                    <ToggleGroup
                        variant="outline"
                        type="single"
                        value={String(week)}
                        onValueChange={(value) => {
                            if (value) setWeek(Number(value)); // converts back to number
                        }}>
                        {Array.from({ length: Math.ceil(allChartData.length / 7) }, (_, i) => i + 1).map((i) => (
                            <ToggleGroupItem key={i} value={String(i)} aria-label={`Week ${i}`}>
                                Week {i}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>
            </CardFooter>
        </Card>
    )
}

