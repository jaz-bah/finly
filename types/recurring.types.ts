import mongoose from "mongoose";


export interface IRecurring {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    type: "income" | "expense" | "savings";
    amount: number;
    note: string;
    last_updated?: Date;
    frequency: "weekly" | "monthly";
    createdAt?: Date;
    updatedAt?: Date;
}


export interface ICreateRecurringPayload {
    type: "income" | "expense" | "savings";
    amount: number;
    note: string;
    last_updated?: Date;
    frequency: "weekly" | "monthly";
}