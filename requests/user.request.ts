import { signIn } from "next-auth/react";

const baseUrl = process.env.BASE_URL;


// create user
export const createUser = async (name: string, email: string, password: string) => {
    const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
        throw new Error((await res.json()).message);
    }

    return res.json();
}


// login user
export const loginUser = async (email: string, password: string) => {
    const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
    });

    if (res?.error) {
        throw new Error(res.error);
    }

    return res;
}