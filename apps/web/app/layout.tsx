import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@wrksz/themes/next"

import "@workspace/ui/globals.css"
import { ThemeHotkey } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"
import { GraphQLProvider } from "@/providers/graphql-provider"
import { Toaster } from "@workspace/ui/components/toast"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <div className="min-h-screen bg-[#f5f5f5] bg-[url('/patterns/repeated-square.png')] bg-repeat">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <ThemeHotkey />
            <GraphQLProvider>
              <Toaster>{children}</Toaster>
            </GraphQLProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}
