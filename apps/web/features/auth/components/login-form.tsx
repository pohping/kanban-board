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
import { useRouter } from "next/navigation"

interface LoginFormProps {
  callbackUrl: string
}

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const router = useRouter()
  const form = useForm<LoginInput>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  })
  const [login, { loading, error }] = useMutation(LOGIN)

  async function loginUser(input: LoginInput) {
    try {
      await login({ variables: { loginInput: input } })
      router.replace(callbackUrl)
      router.refresh()

      toast.add({ type: "success", description: "Welcome back" })
    } catch (err) {
      console.error(err)
      toast.add({ type: "error", description: "Something gone wrong." })
    }
  }

  async function handleMagicLinkClick() {
    try {
      await login({
        variables: {
          loginInput: {
            email: process.env.NEXT_PUBLIC_TEST_USER_EMAIL ?? "",
            password: process.env.NEXT_PUBLIC_TEST_USER_PASSWORD ?? "",
          },
        },
      })
      router.replace(callbackUrl)
      router.refresh()

      toast.add({ type: "success", description: "Welcome back" })
    } catch (err) {
      console.error(err)
      toast.add({ type: "error", description: "Something gone wrong." })
    }
  }

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
    <form onSubmit={form.handleSubmit(loginUser)}>
      <FieldGroup>
        <p className="text-base text-muted-foreground">
          Login with{" "}
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-base text-card-foreground"
            onClick={handleMagicLinkClick}
          >
            Magic Link
          </Button>
        </p>

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
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="cursor-pointer"
            onClick={() => {
              window.location.href = "/api/auth/google"
            }}
          >
            <FaGoogle />
            Login with Google
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
