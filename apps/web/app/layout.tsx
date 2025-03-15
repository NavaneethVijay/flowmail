import "./globals.css";
import type { Metadata } from "next";
import { Albert_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ModalProvider } from "@/context/ModalContext";

const inter = Albert_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modern App with Supabase Auth",
  description: "A modern application with Supabase authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ModalProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </ModalProvider>
      </body>
    </html>
  );
}
