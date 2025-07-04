import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Recurring from "@/models/recurring.model";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }){
    const { id } = await params;

    try {
        await connectToDatabase();

        const deletedRecurring = await Recurring.findByIdAndDelete(id);

        if (!deletedRecurring) {
            return NextResponse.json({ message: "Recurring not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Recurring deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: (error as Error).message }, { status: 500 });
    }
}


export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const userId: string = session.user.id as string;

        const { type, amount, note, last_updated, frequency } = await request.json();

        if (!type || !amount || !frequency) {
            return NextResponse.json(
                {
                    message: "type, amount and frequency are required"
                },
                {
                    status: 400
                }
            )
        }


        if (type !== "income" && type !== "expense" && type !== "savings") {
            return NextResponse.json(
                {
                    message: "type must be income, expense or savings"
                },
                {
                    status: 400
                }
            )
        }


        if (frequency !== "weekly" && frequency !== "monthly") {
            return NextResponse.json(
                {
                    message: "frequency must be weekly or monthly"
                },
                {
                    status: 400
                }
            )
        }

        await connectToDatabase();

        const newRecurring = {
            userId,
            type,
            amount,
            note,
            last_updated,
            frequency
        };

        const updatedRecurring = await Recurring.findByIdAndUpdate(id, newRecurring, { new: true });
        
        if (!updatedRecurring) {
            return NextResponse.json({ message: "Recurring not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Recurring updated successfully", data: updatedRecurring }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }

}