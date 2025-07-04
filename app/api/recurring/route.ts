
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Recurring from "@/models/recurring.model";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";


interface getQuery {
    userId: string;
    type?: string;
    frequency?: string;
    page?: string;
    limit?: string;
    date?: {
        $gte?: Date;
        $lte?: Date;
    };
}



export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectToDatabase();

        const userId: string = session.user.id as string;

        const {searchParams} = request.nextUrl;
        const type = searchParams.get("type");
        const frequency = searchParams.get("frequency");
        const page = searchParams.get("page");
        const limit = searchParams.get("limit");

        const query: getQuery = { userId };

        if (type) query.type = type;
        if (frequency) query.frequency = frequency;

        const total = await Recurring.countDocuments(query);

        let recurrings;
        let response;

        if(page && limit){
            const pageInt = parseInt(page, 10);
            const limitInt = parseInt(limit, 10);

            recurrings = await Recurring.find(query).skip((pageInt - 1) * limitInt).limit(limitInt);
            response = {
                data: recurrings,
                page: pageInt,
                limit: limitInt,
                total
            }
        } else {
            recurrings = await Recurring.find(query);
            response = {
                data: recurrings,
                total
            }
        }

        if(!recurrings) {
            return NextResponse.json({ message: "Recurring not found" }, { status: 404 });
        }

        return NextResponse.json(response, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }

}



export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const userId: string = session.user.id as string;

        const { type, amount, note, frequency } = await request.json();

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


        const newRecurring = {
            userId,
            type,
            amount: Number(amount),
            note: note || "",
            last_updated: new Date(),
            frequency
        };

        await connectToDatabase();

        const recurring = await Recurring.create(newRecurring);

        return NextResponse.json({ message: "Recurring created successfully", recurring }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }

}

