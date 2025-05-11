import Header from "@/components/header";
import Footer from "@/components/footer";
//import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
//import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

import { Inter } from "next/font/google"
//import { cn } from "@/lib/utils"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Réveil Basket Is sur Tille",
  description: "Site officiel du club de basket d'Is sur Tille",
};

//const inter = Inter({ subsets: ["latin"] })
const inter = Inter({ subsets: ["latin"], display: "swap" })

/*
const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});
*/
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      {/*<html lang="fr" className={geistSans.className} suppressHydrationWarning>*/}

      {/*<body className="bg-background text-foreground">*/}
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </nav>
              <Header />
              <ThemeSwitcher />
              <div className="flex flex-col gap-20 p-5">
                {children}
              </div>
              <Footer />
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
