"use client"

import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { sumExpensesByDate } from "@/helper/filter"
import { moneyFormatter } from "@/helper/formater"
import { ITransaction } from "@/types/transaction.type"
import { useMemo } from "react"

export const description = "A line chart of daily total amounts"

const chartConfig = {
  amount: {
    label: "Amount",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface Props {
  allTransactions: ITransaction[]
}

export function MonthlyChart({ allTransactions }: Props) {
  const chartData = useMemo(
    () => sumExpensesByDate(allTransactions, "date"),
    [allTransactions]
  );

  const month = new Date().toLocaleDateString("default", { month: "long" });
  const year = new Date().getFullYear();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
        <CardDescription>{month} {year} Overview</CardDescription>
      </CardHeader>
      <CardContent >
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={value => value}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="line" />}
              labelFormatter={(value) => value + " " + new Date().toLocaleDateString("default", { month: "long" })}
            />
            <Line
              dataKey="amount"
              type="natural"
              stroke="var(--color-amount)"
              strokeWidth={2}
              dot={{ fill: "var(--color-amount)" }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground hidden md:block"
                fontSize={12}
                formatter={(value: number) => moneyFormatter(value)}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
