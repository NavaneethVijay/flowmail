import { CalendarWidget } from "@/components/dashboard/widgets/calender";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4</div>
        </CardContent>
      </Card>
      <Card>
        <CalendarWidget />
      </Card>
    </div>
  );
}
