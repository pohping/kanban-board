"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Marker, MarkerContent } from "@workspace/ui/components/marker"
import { FaGithub } from "react-icons/fa"

export function LoginForm() {
  const router = useRouter()

  return (
    <form>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            className="h-9 text-base"
            placeholder="Enter email"
          />
        </Field>
        <Field>
          <div className="flex w-full items-center justify-between">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/"
              className="text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input type="password" id="password" className="h-9 text-base" />
        </Field>
        <Field>
          <Button type="submit" size="lg" className="cursor-pointer">
            Login
          </Button>
        </Field>
        <Field>
          <Marker variant="separator">
            <MarkerContent>Or continue with</MarkerContent>
          </Marker>
        </Field>
        <Field>
          <Button variant="outline" size="lg" className="cursor-pointer">
            <FaGithub />
            Login with GitHub
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
