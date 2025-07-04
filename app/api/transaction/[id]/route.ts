import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Transaction from "@/models/transaction.model";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        await connectToDatabase();

        const deletedTransaction = await Transaction.findByIdAndDelete(id);

        if (!deletedTransaction) {
            return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Transaction deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: (error as Error).message }, { status: 500 });
    }
}



export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const userId: string = session.user.id as string;
        const { type, amount, note, date } = await req.json();

        if (!userId || !type || !amount) {
            return NextResponse.json(
                {
                    message: "userId, type and amount are required"
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

        

        await connectToDatabase();

        const response = await Transaction.findByIdAndUpdate(id, { userId, type, amount, note, date }, { new: true });

        if (!response) {
            return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Transaction updated successfully", data: response }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}