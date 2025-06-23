"use client";

import BalanceCard from "@/components/card/BalanceCard";
import TransactionCard from "@/components/card/TransactionCard";
import { MonthlyChart } from "@/components/chart/MonthlyChart";
import { MonthlySavings } from "@/components/chart/MonthlySavings";
import { SavingsChart } from "@/components/chart/SavingsChart";
import { WeeklyChart } from "@/components/chart/WeeklyChart";
import { caculateTransaction } from "@/helper/calculation";
import {
  getAllSavingsTransactions,
  getCurrentMonthTransactions,
  getPreviousMonthTransactions
} from "@/requests/transaction.request";
import { ITransaction } from "@/types/transaction.type";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();

  const { data: thisMonthTransactions, isLoading, error } = useQuery({
    queryKey: ['transactions-this-month'],
    queryFn: () => getCurrentMonthTransactions(session?.user.id),
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 60 * 24
  });


  const { data: prevMonthTransactions } = useQuery({
    queryKey: ['transactions-previous-month'],
    queryFn: () => getPreviousMonthTransactions(session?.user.id),
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 60 * 24
  });


  const { data: allSavings, isLoading: allSavingsLoading } = useQuery({
    queryKey: ['transactions-all-savings'],
    queryFn: () => getAllSavingsTransactions(session?.user.id),
    enabled: !!session?.user?.id,
    staleTime: 1000 * 60 * 60 * 24
  });

  // cureent month states
  const [thisMonthAllTransactions, setThisMonthAllTransactions] = useState<ITransaction[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [totalSavings, setTotalSavings] = useState<number>(0);
  
  // previous month states
  const [prevTotalBalance, setPrevTotalBalance] = useState<number>(0);
  const [prevTotalIncome, setPrevTotalIncome] = useState<number>(0);
  const [prevTotalExpense, setPrevTotalExpense] = useState<number>(0);
  const [prevTotalSavings, setPrevTotalSavings] = useState<number>(0);
  
  
  // savings states
  const [allSavingsTransactions, setAllSavingsTransactions] = useState<ITransaction[]>([]);
  const [allSavingsTotal, setAllSavingsTotal] = useState<number>(0);
  


  useEffect(() => {
    if (thisMonthTransactions?.data?.transactions) {
      const {
        totalBalance,
        totalIncome,
        totalExpense,
        totalSavings
      } = caculateTransaction(thisMonthTransactions.data.transactions);

      setThisMonthAllTransactions(thisMonthTransactions.data.transactions);
      setTotalBalance(totalBalance);
      setTotalIncome(totalIncome);
      setTotalExpense(totalExpense);
      setTotalSavings(totalSavings);
    }
  }, [thisMonthTransactions]);


  useEffect(() => {
    if (allSavings?.data?.transactions) {
      const {
        totalSavings: allSavingsTotal
      } = caculateTransaction(allSavings.data.transactions);

      setAllSavingsTransactions(allSavings.data.transactions);
      setAllSavingsTotal(allSavingsTotal);
    }
  }, [allSavings]);


  useEffect(() => {
    if (prevMonthTransactions?.data?.transactions) {
      const {
        totalBalance: prevTotalBalance,
        totalIncome: prevTotalIncome,
        totalExpense: prevTotalExpense,
        totalSavings: prevTotalSavings
      } = caculateTransaction(prevMonthTransactions.data.transactions);

      setPrevTotalBalance(prevTotalBalance);
      setPrevTotalIncome(prevTotalIncome);
      setPrevTotalExpense(prevTotalExpense);
      setPrevTotalSavings(prevTotalSavings);
    }
  }, [prevMonthTransactions]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-x-0 2xl:gap-x-4 gap-y-4 py-4">
        <div className="col-span-2">
          {!error &&
            <BalanceCard
              totalBalance={totalBalance}
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              isLoading={isLoading}
            />
          }
        </div>

        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <TransactionCard
            type={"income"}
            total={totalIncome}
            prevTotal={prevTotalIncome}
            isLoading={isLoading}
          />

          <TransactionCard
            type={"expense"}
            total={totalExpense}
            prevTotal={prevTotalExpense}
            isLoading={isLoading}
          />

          <TransactionCard
            type={"saving"}
            total={totalSavings}
            prevTotal={prevTotalSavings}
            isLoading={isLoading}
          />

          <TransactionCard
            type={"total savings"}
            total={allSavingsTotal}
            isLoading={allSavingsLoading}
          />
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <WeeklyChart allTransactions={thisMonthAllTransactions} />
        <SavingsChart allSavings={allSavingsTotal} />
        <MonthlySavings allSavingsTransactions={allSavingsTransactions} />
      </div>

      <MonthlyChart allTransactions={thisMonthAllTransactions} />

      <span className="hidden">{prevTotalBalance}</span>
    </>
  );
}
