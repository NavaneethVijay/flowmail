import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LogIn,
  ArrowRight,
  Send,
  Inbox,
  BarChart,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "../components/mode-toggle";

export const metadata = {
  title: 'Flowmail | Turbocharge Your Project Productivity',
  description: 'Streamline your workflow with AI-powered project management and email capabilities. Join over 2,500 teams using our platform for enhanced productivity.',
  keywords: [
    'project management',
    'workflow automation',
    'email management',
    'team collaboration',
    'productivity tools',
    'AI-powered platform'
  ],
  openGraph: {
    title: 'WorkFlow AI | Turbocharge Your Team Productivity',
    description: 'Streamline your workflow with AI-powered project management and email capabilities.',
    images: [
      {
        url: '/images/og-image.jpg', // Make sure to add this image to your public folder
        width: 1200,
        height: 630,
        alt: 'WorkFlow AI Platform Preview',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WorkFlow AI | Turbocharge Your Team Productivity',
    description: 'Streamline your workflow with AI-powered project management and email capabilities.',
    images: ['/images/og-image.jpg'],
  }
};

export default function Home() {
  return (
    <>
      {/* Add Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto  flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Flowmail</span>
          </Link>
          <ModeToggle />
        </div>
      </header>

      <main className="min-h-screen">
        {/* Hero Section - Inspired by Flowmail's clean hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-primary/5 pt-32 pb-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-block mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium">
                  Coming Soon 🎉
                </span>
              </div>
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Turbocharge your workflow & communications
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Explore powerful project management tools with integrated email
                capabilities. Streamline your team&apos;s productivity with our
                AI-powered platform.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`}
                  className="h-12 px-8"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Get Early Access
                </Link>
                <Button size="lg" variant="outline" className="h-12 px-8">
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Join over 2,500 teams already using our platform
              </p>
            </div>

            {/* Dashboard Preview */}
            <div className="relative mx-auto max-w-6xl">
              <div className="rounded-xl border bg-background/50 backdrop-blur-sm shadow-2xl">
                <Image
                  src="/images/dashboard.webp"
                  alt="Dashboard Preview"
                  width={1400}
                  height={1000}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid - Similar to Flowmail's feature presentation */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Craft your personalized workflow
              </h2>
              <p className="text-muted-foreground">
                Empower your team with customizable tools for maximum efficiency
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Send,
                  title: "Smart Email Management",
                  desc: "AI-powered email handling with custom filters and automated responses",
                },
                {
                  icon: Inbox,
                  title: "Unified Inbox",
                  desc: "All your communications in one place with intelligent organization",
                },
                {
                  icon: BarChart,
                  title: "Analytics Dashboard",
                  desc: "Comprehensive insights into your team's performance and engagement",
                },
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  desc: "Bank-grade encryption and advanced security protocols",
                },
                {
                  icon: Users,
                  title: "Team Collaboration",
                  desc: "Seamless collaboration tools for enhanced productivity",
                },
                {
                  icon: Zap,
                  title: "Automation Tools",
                  desc: "Powerful automation to streamline repetitive tasks",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 border-primary/10"
                >
                  <CardHeader>
                    <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl mb-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - Similar to Flowmail's call-to-action */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary to-primary/80">
              <CardHeader>
                <CardTitle className="text-3xl text-primary-foreground">
                  Ready to transform your workflow?
                </CardTitle>
                <CardDescription className="text-primary-foreground/90 text-lg">
                  Join thousands of teams already using our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="lg"
                  variant="secondary"
                  // onClick={handleGoogleSignIn}
                  className="mt-4"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Get Early Access
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
