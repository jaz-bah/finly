import { connectToDatabase } from "@/lib/db";
import Transaction from "@/models/transaction.model";
import { NextRequest, NextResponse } from "next/server";

type Params = {
    params: {
        id: string;
    };
};

export async function DELETE(request: NextRequest, response: NextResponse, { params }: Params) {

    const { id } = params;

    console.log(response, request);

    try {
        await connectToDatabase();
        
        const response = await Transaction.findByIdAndDelete(id);

        if (!response) {
            return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Transaction deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}


export async function PUT(request: NextRequest, response: NextResponse, { params }: Params, ) {

    const { id } = params;

    console.log(response);

    if(!id) {
        return NextResponse.json({ message: "Transaction id is required" }, { status: 400 });
    }

    try {
        const { userId, type, amount, note, date } = await request.json();

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