

// get user all transactions

import { ObjectId } from "@/types/mongoose.types";
import { ICreateTransactionPayload } from "@/types/transaction.type";

interface getQuery {
    userId: String | undefined;
    type?: string;
    page?: Number;
    limit?: number;
}

export const getUserAllTransactions = async ({ userId, type, page, limit }: getQuery) => {
    if (!userId) {
        throw new Error("userId is required");
    }

    let baseUrl = `/api/transaction?user=${userId}`;

    if (type || page || limit) {
        baseUrl += `&page=${page}&limit=${limit}`;

        type !== "all" ? baseUrl += `&type=${type}` : null;
    }
    const res = await fetch(baseUrl);

    if (!res.ok) {
        throw new Error((await res.json()).message);
    }

    return res.json();
}


// get current month transactions

export const getCurrentMonthTransactions = async (userId: String | undefined) => {
    if (!userId) {
        throw new Error("userId is required");
    }

    const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const res = await fetch(`/api/transaction?user=${userId}&startdate=${startDate}&enddate=${endDate}`);

    if (!res.ok) {
        throw new Error((await res.json()).message);
    }

    return res.json();
}


// get all transactions previous month

export const getPreviousMonthTransactions = async (userId: String | undefined) => {
    if (!userId) {
        throw new Error("userId is required");
    }

    const startDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    const endDate = new Date(new Date().getFullYear(), new Date().getMonth(), 0);

    const res = await fetch(`/api/transaction?user=${userId}&startdate=${startDate}&enddate=${endDate}`);

    if (!res.ok) {
        throw new Error((await res.json()).message);
    }

    return res.json();
}


// get all savings transactions

export const getAllSavingsTransactions = async (userId: String | undefined) => {
    if (!userId) {
        throw new Error("userId is required");
    }

    const res = await fetch(`/api/transaction?user=${userId}&type=savings`);

    if (!res.ok) {
        throw new Error((await res.json()).message);
    }

    return res.json();
}


// create transaction

export const createTransaction = async (payload: ICreateTransactionPayload) => {
    const { userId, type, amount, note, date } = payload;

    if (!userId || !type || !amount) {
        throw new Error("userId, type and amount are required");
    }

    const res = await fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify({ userId, type, amount, note, date }),
    });

    if (!res.ok) {
        throw new Error((await res.json()).message);
    }

    return res.json();
}



// update transaction

export const updateTransaction = async (id: ObjectId, updateTransaction: ICreateTransactionPayload) => {
    const { userId, type, amount, note, date } = updateTransaction;
    const res = await fetch(`/api/transaction/${id}`, {
        method: "PUT",
        body: JSON.stringify({ userId, type, amount, note, date }),
    });

    if (!res.ok) {
        throw new Error((await res.json()).message);
    }

    return res.json();
}






// delete transaction

export const deleteTransaction = async (id: ObjectId) => {
    const res = await fetch(`/api/transaction/${id}`, { method: "DELETE" });

    if (!res.ok) {
        throw new Error((await res.json()).message);
    }

    return res.json();
}