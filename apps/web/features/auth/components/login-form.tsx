"use client"

import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { Marker, MarkerContent } from "@workspace/ui/components/marker"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert"
import { FaGoogle } from "react-icons/fa"
import { useMutation } from "@apollo/client/react"
import { LOGIN } from "../graphql/mutations"
import { useForm } from "react-hook-form"
import { loginSchema, type LoginInput } from "../schemas/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircleIcon } from "lucide-react"
import { toast } from "@workspace/ui/components/toast"
import { useRouter, useSearchParams } from "next/navigation"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const form = useForm<LoginInput>({
    defaultValues: {
      email: process.env.NEXT_PUBLIC_TEST_USER_EMAIL,
      password: process.env.NEXT_PUBLIC_TEST_USER_PASSWORD,
    },
    resolver: zodResolver(loginSchema),
  })
  const [login, { loading, error }] = useMutation(LOGIN)

  async function handleSubmit(loginInput: LoginInput) {
    try {
      await login({ variables: { loginInput } })
      router.replace(callbackUrl)
      router.refresh()

      toast.add({ type: "success", description: "Welcome back" })
    } catch (err) {
      console.error(err)
      toast.add({ type: "error", description: "Something gone wrong." })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        {error && (
          <Alert variant="destructive" className="max-w-md">
            <AlertCircleIcon />
            <AlertTitle>Login failed</AlertTitle>
            <AlertDescription>
              Wrong username, email, or password, or caps lock left on.
            </AlertDescription>
          </Alert>
        )}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            className="h-9 text-base"
            placeholder="Enter email"
            aria-invalid={!!form.formState.errors.email}
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <FieldError>{form.formState.errors.email.message}</FieldError>
          )}
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
          <Input
            type="password"
            id="password"
            className="h-9 text-base"
            aria-invalid={!!form.formState.errors.password}
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <FieldError>{form.formState.errors.password.message}</FieldError>
          )}
        </Field>
        <Field>
          <Button
            type="submit"
            size="lg"
            className="cursor-pointer"
            disabled={loading}
          >
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
            <FaGoogle />
            Login with Google
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
