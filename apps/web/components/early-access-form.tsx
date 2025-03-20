"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function EarlyAccessForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "You've been added to our waitlist. We'll be in touch soon!",
        });
        setEmail("");
      } else {
        // Handle specific error cases
        switch (response.status) {
          case 409:
            toast({
              title: "Already Registered",
              description: data.error || "This email is already on our waitlist.",
              variant: "destructive",
            });
            break;
          case 400:
            toast({
              title: "Invalid Email",
              description: data.error || "Please enter a valid email address.",
              variant: "destructive",
            });
            break;
          default:
            toast({
              title: "Error",
              description: data.error || "Failed to join waitlist. Please try again.",
              variant: "destructive",
            });
        }
      }
    } catch (error) {
      console.error("Waitlist error:", error);
      toast({
        title: "Error",
        description: "Unable to connect to the server. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="early-access" className="py-24 bg-background">
      <div className="container mx-auto px-4 text-center">
        <Card className="max-w-4xl mx-auto bg-gradient-to-b from-primary/10 to-primary/5">
          <CardHeader>
            <CardTitle className="text-3xl">
              Be the First to Experience Flowmail
            </CardTitle>
            <CardDescription className="text-lg">
              Join our waitlist and get early access to a smarter way of
              managing emails. Stay organized, boost productivity, and turn
              emails into action—coming soon!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="flex justify-center max-w-md mx-auto gap-2 mt-6"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border bg-background/50 backdrop-blur-sm"
                required
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Joining..." : "Join Waitlist"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
