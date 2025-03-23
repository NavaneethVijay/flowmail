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
  ListChecks,
  Layers,
  Filter,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EarlyAccessForm } from "@/components/early-access-form"

export const metadata = {
  title: "Flowmail | Transform Emails into Workflows",
  description:
    "Convert your emails into actionable tasks with an intuitive Kanban board. Organize, track, and streamline your email workflow.",
  keywords: [
    "email management",
    "kanban board",
    "workflow automation",
    "productivity tools",
    "team collaboration",
  ],
  openGraph: {
    title: "Flowmail | Transform Emails into Workflows",
    description:
      "Convert your emails into actionable tasks with an intuitive Kanban board.",
    images: [
      {
        url: "/images/dashboard.webp",
        width: 1200,
        height: 630,
        alt: "Flowmail Platform Preview",
      },
    ],
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Flowmail</span>
          </Link>
        </div>
      </header>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-black/5 pt-32 pb-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-block mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-medium">
                  Coming Soon 🎉
                </span>
              </div>
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Transform Your Emails into Actionable Workflows
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Organize, track, and manage your emails effortlessly with an
                AI-powered Kanban board.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="#early-access"
                  className="inline-flex items-center h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   document.getElementById('early-access')?.scrollIntoView({
                  //     behavior: 'smooth',
                  //     block: 'center'
                  //   });
                  // }}
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Get Early Access
                </Link>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Join over 200+ users already signing up for early access
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

        {/* Features Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground">
              Take control of your emails with powerful
              <Link className="text-primary px-1" href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`}>
                tools
              </Link>
              designed for maximum productivity.
            </p>
          </div>

          <div className="max-w-5xl mx-auto  grid md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: Send,
                title: "Smart Email Management",
                desc: "View, sort, and interact with emails efficiently.",
                image: "/images/feature-1.png",
              },
              {
                icon: Layers,
                title: "Project-Based Sorting",
                desc: "Automatically group emails by domain, label, or keywords.",
                image: "/images/feature-2.png",
              },
              {
                icon: Inbox,
                title: "Kanban Email Board",
                desc: "Move emails as tasks across a fully customizable Kanban board.",
                image: "/images/feature-2.png",
              },
              {
                icon: ListChecks,
                title: "Email To-Do Lists",
                desc: "Attach tasks to emails and track progress within the board.",
                image: "/images/feature-1.png",
              },
              {
                icon: Filter,
                title: "AI Email Categorization",
                desc: "Use smart filters to organize emails with AI-powered tagging.",
                image: "/images/feature-2.png",
              },
              {
                icon: MessageCircle,
                title: "Collaboration Tools",
                desc: "Comment, assign tasks, and work together seamlessly.",
                image: "/images/feature-1.png",
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
                <CardContent>
                  <div className="relative rounded-lg overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={300}
                      height={300}
                      className="w-full h-auto"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Privacy & Security Section */}
        <section className="py-24 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-flex items-center justify-center p-2 rounded-full bg-primary/10 text-primary mb-6">
                <Shield className="h-6 w-6" />
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Enterprise-Grade Security & Data Protection
              </h2>
              <p className="text-xl text-muted-foreground">
                Your data security is our top priority. Built in India and
                powered by Vercel&apos;s global infrastructure, Flowmail ensures
                robust security and data protection standards.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>End-to-End Encryption</CardTitle>
                  <CardDescription>
                    All emails and data are encrypted using industry-standard
                    AES-256 encryption, both at rest and in transit.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Data Protection</CardTitle>
                  <CardDescription>
                    Compliant with Information Technology Act, 2000 and aligned
                    with global privacy standards.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-4 p-3 rounded-lg bg-primary/10 w-fit">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Transparent Practices</CardTitle>
                  <CardDescription>
                    Clear documentation of our security measures, data handling,
                    and privacy practices available to all users.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="max-w-4xl mx-auto mt-16 ">
              <Card className="border-primary/10">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-semibold mb-4">
                        Robust Security Infrastructure
                      </h3>
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <div className="mr-4 mt-1">
                            <Shield className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-muted-foreground">
                            Powered by Vercel&apos;s enterprise-grade
                            infrastructure with global CDN
                          </p>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-4 mt-1">
                            <Shield className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-muted-foreground">
                            Regular security assessments and vulnerability
                            testing
                          </p>
                        </li>
                        <li className="flex items-start">
                          <div className="mr-4 mt-1">
                            <Shield className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-muted-foreground">
                            Multi-layer data protection with automated backups
                            and disaster recovery
                          </p>
                        </li>
                      </ul>
                    </div>
                    <div className="relative h-64">
                      <Image
                        src="/images/security.png"
                        alt="Security Infrastructure"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <EarlyAccessForm />

        {/* Footer */}
        <footer className="border-t bg-background">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand Column */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src="https://placehold.co/40x40/2563eb/ffffff?text=F"
                    alt="Flowmail Logo"
                    width={40}
                    height={40}
                    className="rounded"
                  />
                  <span className="font-bold text-xl">Flowmail</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Transform your emails into actionable workflows with
                  AI-powered tools.
                </p>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Flowmail. All rights reserved.
                </div>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Twitter
                  </Link>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    LinkedIn
                  </Link>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    GitHub
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
