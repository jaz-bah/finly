import { connectToDatabase } from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

type Params = {
    params: {
        id: string;
    };
};

export async function GET(request: NextRequest, response: NextResponse,{ params }: Params) {
    const { id } = params;

    console.log(response, request);

    try {
        await connectToDatabase();
        const users = await User.findById(id);

        if (!users) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}