"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useMutation } from "@tanstack/react-query"
import { IUserSignInPayload } from "@/types/user.type"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    })
});

interface Props {
    setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
}

export function SignInForm({ setErrorMessage }: Props) {

    const Router = useRouter();

    // states
    const [showPassword, setShowPassword] = useState(false);


    // form initial value
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    // signin mutation
    const signinMutation = useMutation({
        mutationFn: async ({ email, password }: IUserSignInPayload) => await signIn("credentials", {
            redirect: false,
            email,
            password,
        }),
        onSuccess: (data) => {
            if (data?.error) {
                toast.error(data.error);
                setErrorMessage(data.error);
            } else {
                toast.success("Signin successfully.");
                Router.push("/");
            }
        },
        onError: (error) => {
            const errorMessage = (error as Error).message;
            toast.error(errorMessage);
            setErrorMessage(errorMessage);
        },
    })

    // form submit handler
    function onSubmit(values: z.infer<typeof formSchema>) {
        const { email, password } = values;

        signinMutation.mutate({ email, password });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">Submit</Button>
            </form>
        </Form>
    )
}