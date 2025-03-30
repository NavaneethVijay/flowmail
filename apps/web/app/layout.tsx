import "./globals.css";
import type { Metadata } from "next";
import { Albert_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { AddProjectProvider } from "@/context/AddProjectContext";

const inter = Albert_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Flowmail | Turbocharge Your Project Productivity",
  icons: {
    icon: "/favicon.ico",
  },
  description:
    "Streamline your workflow with AI-powered project management and email capabilities. Join over 2,500 teams using our platform for enhanced productivity.",
  keywords: [
    "project management",
    "workflow automation",
    "email management",
    "team collaboration",
    "productivity tools",
    "AI-powered platform",
  ],
  openGraph: {
    title: "WorkFlow AI | Turbocharge Your Team Productivity",
    description:
      "Streamline your workflow with AI-powered project management and email capabilities.",
    images: [
      {
        url: "/images/og-image.jpg", // Make sure to add this image to your public folder
        width: 1200,
        height: 630,
        alt: "WorkFlow AI Platform Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WorkFlow AI | Turbocharge Your Team Productivity",
    description:
      "Streamline your workflow with AI-powered project management and email capabilities.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <ModalProvider> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AddProjectProvider>{children}</AddProjectProvider>
          <Toaster />
        </ThemeProvider>
        {/* </ModalProvider> */}
        <Analytics />
      </body>
    </html>
  );
}
