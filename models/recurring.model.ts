import { IRecurring } from "@/types/recurring.types";
import { Schema, model, models } from "mongoose";


const recurringSchema = new Schema<IRecurring>(
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
        last_updated: {
            type: Date,
            default: Date.now,
        },
        frequency: {
            type: String,
            required: true,
            enum: ["weekly", "monthly"],
        },
    },
    {
        timestamps: true,
    }
);


const Recurring = models.Recurring || model<IRecurring>("Recurring", recurringSchema);
export default Recurring;