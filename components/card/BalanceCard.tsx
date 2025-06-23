"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { moneyFormatter } from "@/helper/formater";
import { CompareChart } from "../chart/CompareChart";
import BCardSkltn from "../skeleton/BCardSkltn";
import TimeAndDate from "../TimeAndDate";

interface Props {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  isLoading: boolean;
}

export default function BalanceCard({ isLoading, totalBalance, totalIncome, totalExpense }: Props) {

  if (isLoading) return <BCardSkltn />;

  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full">
        <div className="flex flex-col sm:flex-row w-full h-full justify-between">
          <div className="flex w-full sm:w-1/2 flex-col px-0 sm:px-2 py-2 sm:py-0 items-center justify-center">
            <div className="py-2 border-b-2 mb-2">
              <CompareChart totalIncome={totalIncome} totalExpense={totalExpense} />
            </div>
            <h1 className={`text-2xl lg:text-4xl xl:text-5xl font-bold ${totalBalance >= 5000 ? "text-green-500" : "text-red-500"}`}>{moneyFormatter(totalBalance)}</h1>
            <div className="flex items-center gap-2 text-lg font-bold">
              <p>Current Balance</p>
            </div>
          </div>
          <div className="flex w-full sm:w-1/2 flex-col px-0 sm:px-2 py-2 sm:py-0 items-center justify-center border-t-2 sm:border-t-0 sm:border-l-2 border-border gap-2">
            <TimeAndDate />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

