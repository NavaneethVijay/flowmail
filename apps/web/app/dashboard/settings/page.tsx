'use client'

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const data = await fetch("/api/users/settings").then((res) => res.json());
    console.log('data', data);
    setSettings(data);
  };

  console.log(
    'settings', settings
  );


  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator />
      <div className="max-w-5xl mx-auto">
        <Card className="my-5">
          <CardHeader>
            <CardTitle>API Key Management</CardTitle>
            <CardDescription>
              Manage your AI service API keys for integration.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openaiKey">OpenAI API Key</Label>
              <Input
                id="openaiKey"
                name="openaiKey"
                autoComplete="off"
                type="password"
                placeholder="sk-..."
              />
              <p className="text-sm text-muted-foreground">
                Your OpenAI API key for ChatGPT integration.
              </p>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="my-5">
          <CardHeader>
            <CardTitle>Manage Account</CardTitle>
            <CardDescription>
              Delete your account and all associated data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="destructive">Delete Account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
