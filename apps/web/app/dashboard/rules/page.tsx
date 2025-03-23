// @ts-nocheck
"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useModal } from "@/context/ModalContext";
import { CreateRule } from "@/components/rules/create-rule";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLayout } from "@/components/PageLayout";

interface Rule {
  id: string;
  name: string;
  conditions: {
    domains?: string[];
    labels?: { id: string; name: string }[];
    keywords?: string[];
  };
  targetProject: {
    id: string;
    name: string;
  };
  isActive: boolean;
}

// Sample data - replace with actual data from your API
const sampleRules: Rule[] = [
  {
    id: "1",
    name: "Marketing Emails",
    conditions: {
      domains: ["marketing.com", "ads.com"],
      labels: [{ id: "1", name: "Marketing" }],
      keywords: ["campaign", "promotion"],
    },
    targetProject: {
      id: "1",
      name: "Marketing Project",
    },
    isActive: true,
  },
  // Add more sample rules as needed
];

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>(sampleRules);
  const { openModal, closeModal } = useModal();

  const handleCreateRule = () => {
    openModal({
      title: "Create Rule",
      description: "Create a new rule for automatic email organization",
      content: (
        <CreateRule
          onSuccess={() => {
            // Refresh rules
            closeModal();
          }}
          onClose={closeModal}
        />
      ),
      actions: null,
    });
  };

  return (
    <PageLayout
      title="Rules"
      actions={
        <Button onClick={handleCreateRule}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Rule
        </Button>
      }
    >
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid gap-4">
          {rules.map((rule) => (
            <Card key={rule.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{rule.name}</CardTitle>
                  <Badge variant={rule.isActive ? "default" : "secondary"}>
                    {rule.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription>
                  Adds matching emails to {rule.targetProject.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rule.conditions.domains &&
                    rule.conditions.domains.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Domains</p>
                        <div className="flex flex-wrap gap-2">
                          {rule.conditions.domains.map((domain) => (
                            <Badge key={domain} variant="secondary">
                              @{domain}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  {rule.conditions.labels &&
                    rule.conditions.labels.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Labels</p>
                        <div className="flex flex-wrap gap-2">
                          {rule.conditions.labels.map((label) => (
                            <Badge key={label.id} variant="outline">
                              {label.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  {rule.conditions.keywords &&
                    rule.conditions.keywords.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Keywords</p>
                        <div className="flex flex-wrap gap-2">
                          {rule.conditions.keywords.map((keyword) => (
                            <Badge key={keyword} variant="secondary">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
