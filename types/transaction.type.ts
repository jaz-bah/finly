import mongoose from "mongoose";

export interface ITransaction {
    _id: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,        // Reference to Account
    type: 'income' | 'expense' | 'savings',
    amount: Number,
    note: string,
    date: Date,
    createdAt?: Date;
    updatedAt?: Date;
}


export interface ICreateTransactionPayload {
    userId: String,
    type: 'income' | 'expense' | 'savings',
    amount: Number,
    note: string,
    date: Date,
}