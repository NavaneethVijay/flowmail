"use client"

import { Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

const chartData = [
  { category: "Primary", emails: 320, fill: "hsl(var(--chart-1))" },
  { category: "Promotions", emails: 250, fill: "hsl(var(--chart-2))" },
  { category: "Social", emails: 180, fill: "hsl(var(--chart-3))" },
  { category: "Updates", emails: 140, fill: "hsl(var(--chart-4))" },
  { category: "Forums", emails: 100, fill: "hsl(var(--chart-5))" },
]

const chartConfig = {
  emails: {
    label: "Emails",
  },
  Primary: {
    label: "Primary",
    color: "hsl(var(--primary))",
  },
  Promotions: {
    label: "Promotions",
    color: "hsl(var(--muted))",
  },
  Social: {
    label: "Social",
    color: "hsl(var(--accent))",
  },
  Updates: {
    label: "Updates",
    color: "hsl(var(--foreground))",
  },
  Forums: {
    label: "Forums",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig

export function CategoryChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-start pb-0">
        <CardTitle>Email Category Distribution</CardTitle>
        <CardDescription>Last 30 Days</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie data={chartData} dataKey="emails" nameKey="category" />
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}