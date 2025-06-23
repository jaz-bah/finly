import { ITransaction } from "@/types/transaction.type";
import { Schema, model, models } from "mongoose";


const transactionSchema = new Schema<ITransaction>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["income", "expense", "savings"],
        },
        amount: {
            type: Number,
            required: true,
        },
        note: {
            type: String,
            default: "",
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);


const Transaction = models.Transaction || model<ITransaction>("Transaction", transactionSchema);
export default Transaction;