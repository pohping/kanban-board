import { LoginForm } from "@/components/auth/login-form"
import { Brand } from "@/components/brand/brand"
import Image from "next/image"

export default function Login() {
  return (
    <div className="grid min-h-svh lg:grid-cols-[55%_45%]">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <Brand />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative w-full overflow-hidden bg-slate-200">
        <Image
          src="/policy.svg"
          alt="calendar"
          className="object-contain"
          fill
        />
      </div>
    </div>
  )
}
