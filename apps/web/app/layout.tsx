import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@wrksz/themes/next"

import "@workspace/ui/globals.css"
import { ThemeHotkey } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"
import { GraphQLProvider } from "@/providers/graphql-provider"

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeHotkey />
          <GraphQLProvider>{children}</GraphQLProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
