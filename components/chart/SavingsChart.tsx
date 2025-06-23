"use client"

import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartStyle,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { moneyFormatter } from "@/helper/formater"
import { useMemo } from "react"

const chartConfig = {
    saved: {
        label: "Saved",
        color: "var(--color-yellow-400)",
    },
    target: {
        label: "Target",
        color: "var(--color-neutral-700)",
    },
} satisfies ChartConfig


interface Props {
    allSavings: number
}

export function SavingsChart({ allSavings }: Props) {
    const id = "pie-finance"
    const chartData = [
        { label: "Saved", value: allSavings, fill: "var(--color-yellow-400)" },
        { label: "Target", value: 100000 - allSavings, fill: "var(--color-neutral-700)" },
    ]

    const activeLabel = chartData[0].label;

    const activeIndex = useMemo(
        () => chartData.findIndex((item) => item.label === activeLabel),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [activeLabel]
    )

    return (
        <Card data-chart={id} className="flex flex-col">
            <ChartStyle id={id} config={chartConfig} />
            <CardHeader className="flex flex-row justify-between  items-start space-y-0 pb-0">
                <CardTitle>Savings Target</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 justify-center pb-0">
                <ChartContainer
                    id={id}
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="label"
                            innerRadius={80}
                            strokeWidth={2}
                            activeIndex={activeIndex}
                            activeShape={(props: PieSectorDataItem) => {
                                const outerRadius = props.outerRadius || 0
                                return (
                                    <g>
                                        <Sector {...props} outerRadius={outerRadius + 10} />
                                        <Sector
                                            {...props}
                                            outerRadius={outerRadius + 25}
                                            innerRadius={outerRadius + 12}
                                        />
                                    </g>
                                )
                            }}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-xl font-bold"
                                                >
                                                    {moneyFormatter(allSavings)}
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
