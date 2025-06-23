"use client"

import { SignUpForm } from '@/components/form/SignUpForm'
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from 'lucide-react';
import { useState } from 'react';

export default function Page() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <SignUpForm setErrorMessage={setErrorMessage} />
        </CardContent>
        <CardFooter>
          <div className="w-full">
            {errorMessage && <p className="error_message text-sm text-center text-red-500">{errorMessage}</p>}
            <p className="text-sm text-center">
              Already have an account ?
              <Button variant={"link"} asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
