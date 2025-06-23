import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user.model";

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                {
                    message: "Name, email and password are required"
                },
                {
                    status: 400
                }
            )
        }

        await connectToDatabase();

        const userExists = await User.findOne({ email });

        if (userExists) {
            return NextResponse.json(
                {
                    message: "User already exists"
                },
                {
                    status: 400
                }
            )
        }

        const user = await User.create({
            name,
            email,
            password
        });

        return NextResponse.json(
            {
                message: "User created successfully",
                user
            },
            {
                status: 200
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: (error as Error).message || "Internal server error",
                error: error
            },
            {
                status: 500
            }
        );
    }

}