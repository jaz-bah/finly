import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Transaction from "@/models/transaction.model";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

interface getQuery {
    userId: string;
    type?: string;
    page?: string;
    limit?: string;
    date?: {
        $gte?: Date;
        $lte?: Date;
    }
}

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if(!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectToDatabase();

        const userId: string = session.user.id as string;

        const { searchParams } = request.nextUrl;
        const type = searchParams.get("type");
        const start = searchParams.get("startdate");
        const end = searchParams.get("enddate");
        const page = searchParams.get("page");
        const limit = searchParams.get("limit");

        if (!userId) {
            return NextResponse.json({ message: "userId is required" }, { status: 400 });
        }

        const query: getQuery = {
            userId
        };

        if (type) query.type = type;

        // Handle date range
        if (start && end) {
            const startOfPeriod = new Date(start);
            const endOfPeriod = new Date(end);
            endOfPeriod.setHours(29, 59, 59, 999);

            if (isNaN(startOfPeriod.getTime()) || isNaN(endOfPeriod.getTime())) {
                return NextResponse.json({ message: "Invalid date format" }, { status: 400 });
            }

            query.date = {
                $gte: startOfPeriod,
                $lte: endOfPeriod,
            };
        } else if (start) {
            const startOfPeriod = new Date(start);
            startOfPeriod.setHours(0, 0, 0, 0);

            if (isNaN(startOfPeriod.getTime())) {
                return NextResponse.json({ message: "Invalid date format" }, { status: 400 });
            }

            query.date = {
                $gte: startOfPeriod
            };
        } else if (end) {
            const endOfPeriod = new Date(end);
            endOfPeriod.setHours(29, 59, 59, 999);

            if (isNaN(endOfPeriod.getTime())) {
                return NextResponse.json({ message: "Invalid date format" }, { status: 400 });
            }

            query.date = {
                $lte: endOfPeriod
            };
        }

        const total = await Transaction.countDocuments(query);

        let transactions;
        let response;

        if (page && limit) {
            const pageInt = parseInt(page, 10);
            const limitInt = parseInt(limit, 10);
            transactions = await Transaction.find(query)
                .skip((pageInt - 1) * limitInt)
                .limit(limitInt)
                .sort({ date: -1 });

            response = {
                data: { transactions },
                total,
                page: pageInt,
                limit: limitInt
            };
        } else {
            transactions = await Transaction.find(query).sort({ date: -1 });
            response = {
                data: { transactions },
                total
            };
        }

        if (!transactions) {
            return NextResponse.json({ message: "Transactions not found" }, { status: 404 });
        }

        return NextResponse.json({ ...response }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if(!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    try {
        const userId: string = session.user.id as string;
        const { type, amount, note, date } = await request.json();

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

        const newTransaction = {
            userId,
            type,
            amount: Number(amount),
            note: note || "",
            date: date || new Date(),
        };


        await connectToDatabase();
        const transaction = await Transaction.create(newTransaction);
        return NextResponse.json({ transaction }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}