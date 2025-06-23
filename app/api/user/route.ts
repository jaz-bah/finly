import { connectToDatabase } from "@/lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        await connectToDatabase();
        const users = await User.find({});
        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}