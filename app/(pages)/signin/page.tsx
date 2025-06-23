"use client"

import { SignInForm } from '@/components/form/SignInForm';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from 'next/link';
import { useState } from 'react';

export default function Page() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <SignInForm setErrorMessage={setErrorMessage} />
        </CardContent>
        <CardFooter>
          <div className="w-full">
            {errorMessage && <p className="error_message text-sm text-center text-red-500">{errorMessage}</p>}
            <p className="text-sm text-center">
              Don&apos;t have an account ?
              <Button variant={"link"} asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}