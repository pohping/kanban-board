import { LoginForm } from "@/features/auth/components/login-form"
import { Brand } from "@/components/brand/brand"
import Image from "next/image"
import type { Metadata } from "next"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

export const metadata: Metadata = {
  title: "Login",
}

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { callbackUrl = "/" } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-[480px] shadow-md">
        <CardHeader className="px-6 pt-4">
          <Brand />
          <div className="mt-6 space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Login to your account
            </CardTitle>
            <CardDescription className="text-base">
              Enter your email below to login to your account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-8 py-6">
          <LoginForm callbackUrl={callbackUrl} />
        </CardContent>
      </Card>
    </div>
  )

  return (
    <>
      <div className="grid min-h-svh lg:grid-cols-[55%_45%]">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <Brand />
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs">
              <LoginForm callbackUrl={callbackUrl} />
            </div>
          </div>
        </div>
        <div className="relative w-full overflow-hidden bg-slate-200">
          <Image
            src="/policy.svg"
            alt="calendar"
            priority
            className="object-contain"
            fill
          />
        </div>
      </div>
    </>
  )
}
