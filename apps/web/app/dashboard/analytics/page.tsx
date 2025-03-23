// @ts-nocheck
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { PageLayout } from "@/components/PageLayout";

// Add TypeScript interfaces for our data structures
interface EmailVolumeData {
  name: string;
  value: number;
}

interface ResponseTimeData {
  name: string;
  average: number;
}

interface KanbanStageData {
  name: string;
  value: number;
}

interface ProjectCompletionData {
  name: string;
  completed: number;
  pending: number;
}

interface CategoryDistributionData {
  name: string;
  value: number;
}

interface AIAccuracyData {
  name: string;
  accuracy: number;
}

interface KeywordTrendsData {
  keyword: string;
  count: number;
}

interface SentimentData {
  name: string;
  value: number;
}

// Sample data
const emailVolumeData: EmailVolumeData[] = [
  { name: "Mon", value: 45 },
  { name: "Tue", value: 52 },
  { name: "Wed", value: 38 },
  { name: "Thu", value: 64 },
  { name: "Fri", value: 47 },
  { name: "Sat", value: 23 },
  { name: "Sun", value: 19 },
];

const responseTimeData: ResponseTimeData[] = [
  { name: "Mon", average: 2.4 },
  { name: "Tue", average: 1.8 },
  { name: "Wed", average: 3.2 },
  { name: "Thu", average: 2.1 },
  { name: "Fri", average: 2.7 },
  { name: "Sat", average: 1.5 },
  { name: "Sun", average: 2.9 },
];

const kanbanStageData: KanbanStageData[] = [
  { name: "To Do", value: 12 },
  { name: "In Progress", value: 8 },
  { name: "Done", value: 25 },
];

const projectCompletionData: ProjectCompletionData[] = [
  { name: "Jan", completed: 65, pending: 35 },
  { name: "Feb", completed: 75, pending: 25 },
  { name: "Mar", completed: 82, pending: 18 },
  { name: "Apr", completed: 78, pending: 22 },
];

const categoryDistributionData: CategoryDistributionData[] = [
  { name: "Work", value: 45 },
  { name: "Support", value: 30 },
  { name: "Sales", value: 15 },
  { name: "Personal", value: 10 },
];

const aiAccuracyData: AIAccuracyData[] = [
  { name: "Jan", accuracy: 92 },
  { name: "Feb", accuracy: 94 },
  { name: "Mar", accuracy: 95 },
  { name: "Apr", accuracy: 97 },
];

const keywordTrendsData: KeywordTrendsData[] = [
  { keyword: "Meeting", count: 45 },
  { keyword: "Urgent", count: 38 },
  { keyword: "Report", count: 32 },
  { keyword: "Follow-up", count: 28 },
  { keyword: "Review", count: 25 },
];

const sentimentData: SentimentData[] = [
  { name: "Positive", value: 60 },
  { name: "Neutral", value: 30 },
  { name: "Negative", value: 10 },
];

// Add these colors for the pie charts
const COLORS: string[] = ["#3b82f6", "#22c55e", "#ef4444", "#f59e0b"];

export default function AnalyticsPage() {
  return (
    <PageLayout title="Analytics">
      <div className="flex-1 space-y-4 px-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <div className="flex items-center space-x-2">
            <Select defaultValue="7d">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="email" className="space-y-4">
          <TabsList>
            <TabsTrigger value="email">Email & AI Analytics</TabsTrigger>
            <TabsTrigger value="project">Project Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Email Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={emailVolumeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={responseTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="average"
                        stroke="#3b82f6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: { name: string; percent: number }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryDistributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={keywordTrendsData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="keyword" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Categorization Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={aiAccuracyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#22c55e"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: { name: string; percent: number }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.name === "Positive"
                                ? "#22c55e"
                                : entry.name === "Neutral"
                                ? "#f59e0b"
                                : "#ef4444"
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="project" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Kanban Stage Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={kanbanStageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={projectCompletionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        stroke="#3b82f6"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="pending"
                        stroke="#ef4444"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
