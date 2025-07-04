import { ObjectId } from "@/types/mongoose.types";
import { ICreateRecurringPayload } from "@/types/recurring.types";


interface getQuery {
    type?: string;
    frequency?: string;
    page?: number;
    limit?: number;
}

export const getUserAllRecurrings = async ({ type, frequency, page, limit }: getQuery) => {
    let baseUrl = `/api/recurring`;

    if (type || frequency || page || limit) {
        baseUrl += `?page=${page}&limit=${limit}`;

        type !== "all" ? baseUrl += `&type=${type}` : null;
        frequency !== "all" ? baseUrl += `&frequency=${frequency}` : null;
    }
    const res = await fetch(baseUrl);

    if (!res.ok) {
        throw new Error((await res.json()).message);
    }

    return res.json();
}


export const deleteRecurring = async (id: ObjectId) => {
    const res = await fetch(`/api/recurring/${id}`, { method: "DELETE" });

    if (!res.ok) {
        throw new Error((await res.json()).message);
    }

    return res.json();
}


export const createRecurring = async (payload: ICreateRecurringPayload) => {
    const { type, amount, note, frequency } = payload;

    if (!type || !amount || !frequency) {
        throw new Error("userId, type and amount are required");
    }

    const res = await fetch("/api/recurring", {
        method: "POST",
        body: JSON.stringify({ type, amount, note, frequency }),
    });

    if (!res.ok) {
        throw new Error((await res.json()).message);
    }

    return res.json();
}


export const updateRecurring = async (id: ObjectId, updateRecurring: ICreateRecurringPayload) => {
    const { type, amount, note, last_updated, frequency } = updateRecurring;
    const res = await fetch(`/api/recurring/${id}`, {
        method: "PUT",
        body: JSON.stringify({ type, amount, note, last_updated, frequency }),
    });

    if (!res.ok) {
        throw new Error((await res.json()).message);
    }

    return res.json();
}