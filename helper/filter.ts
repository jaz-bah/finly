import { ITransaction } from "@/types/transaction.type";

const _ = require('underscore');

export function dateFormate(dateString: string, slug: string) {
    switch (slug) {
        case "date-day":
            return new Date(dateString).toLocaleDateString("default", { weekday: "short", day: "numeric" });

        case "date":
            return new Date(dateString).toLocaleDateString("default", { day: "numeric" });

        case "month":
            return new Date(dateString).toLocaleDateString("default", { month: "long" });
    }
}


export function sumExpensesByDate(data: ITransaction[], slug: string = "date-day") {
    // First filter for expenses
    const expenses = _.chain(data)
        .filter((item: { type: string }) => item.type === "expense")
        .sortBy((item: { date: string | number | Date; }) => new Date(item.date))
        .value();

    // Then group by their date
    const grouped = _.groupBy(expenses, (item: { date: string | number | Date; }) =>
        new Date(item.date).toLocaleDateString()
    );

    // Now sum the amounts within each group
    return _.map(grouped, (items: { amount: number }, dateString: string) => {
        return {
            date: dateFormate(dateString, slug),
            amount: _.reduce(items, (sum: number, item: { amount: number }) => sum + item.amount, 0),
        };
    });
}


export function sumSavingsByDate(data: ITransaction[], slug: string = "date-month") {
    // Filter and sort savings by date
    const savings = _.chain(data)
        .filter((item: { type: string }) => item.type === "savings")
        .sortBy((item: { date: string | number | Date }) => new Date(item.date))
        .value();

    // Group by YYYY-MM string (ex: "2025-06")
    const grouped = _.groupBy(savings, (item: { date: string | number | Date }) => {
        const date = new Date(item.date);
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 01-12
        return `${date.getFullYear()}-${month}`; // e.g. "2025-06"
    });

    // Sum all amounts within each month group
    return _.map(grouped, (items: { amount: number }[], monthKey: string) => {
        return {
            date: dateFormate(monthKey, "month"), // assumes your `dateFormate` handles "YYYY-MM"
            amount: _.reduce(items, (sum: any, item: { amount: any; }) => sum + item.amount, 0),
        };
    });
}
