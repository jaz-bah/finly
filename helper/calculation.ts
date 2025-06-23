import { ITransaction } from "@/types/transaction.type";


export const caculateTransaction = (transaction: ITransaction[]) => {
    const totalBalance : number = transaction.reduce((acc: number, tx: ITransaction) => {
        const amount = Number(tx.amount);
        if(tx.type === "income") return acc + amount;
        if(tx.type === "expense") return acc - amount;
        if(tx.type === "savings") return acc - amount;
        
        return acc;
    }, 0);

    const totalIncome = transaction.reduce((acc: number, tx: ITransaction) => {
        const amount = Number(tx.amount);
        if(tx.type === "income") return acc + amount;
        return acc;
    }, 0);

    const totalExpense = transaction.reduce((acc: number, tx: ITransaction) => {
        const amount = Number(tx.amount);
        if(tx.type === "expense") return acc + amount;
        return acc;
    }, 0);

    const totalSavings = transaction.reduce((acc: number, tx: ITransaction) => {
        const amount = Number(tx.amount);
        if(tx.type === "savings") return acc + amount;
        return acc;
    }, 0);

    return {
        totalBalance,
        totalIncome,
        totalExpense,
        totalSavings
    };
}