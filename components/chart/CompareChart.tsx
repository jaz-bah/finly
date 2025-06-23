"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { moneyFormatter } from "@/helper/formater"

export const description = "A radial chart with stacked income and expense"


const chartConfig = {
  income: {
    label: "Income",
    color: "var(--color-green-500)",
  },
  expense: {
    label: "Expense",
    color: "var(--color-red-400)",
  },
} satisfies ChartConfig

interface Props {
  totalIncome: number,
  totalExpense: number
}

export function CompareChart({ totalIncome, totalExpense }: Props) {
  const chartData = [{ 
    month: new Date().getMonth().toLocaleString(), 
    income: totalIncome - totalExpense, 
    expense: totalExpense,
  }];
  const total = chartData[0].income;

  return (
    <div className="block w-50 max-w-full h-25">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-full max-w-[250px]"
      >
        <RadialBarChart
          data={chartData}
          endAngle={180}
          startAngle={0}
          innerRadius={80}
          outerRadius={130}
        >
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 16}
                        className="fill-foreground text-sm font-bold"
                      >
                        {moneyFormatter(total)}
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </PolarRadiusAxis>

          <RadialBar
            dataKey="income"
            stackId="a"
            cornerRadius={5}
            fill="var(--color-income)"
            className="stroke-transparent stroke-1"
          />
          <RadialBar
            dataKey="expense"
            stackId="a"
            cornerRadius={5}
            fill="var(--color-expense)"
            className="stroke-transparent stroke-1"
          />
        </RadialBarChart>
      </ChartContainer>
    </div>
  )
}
