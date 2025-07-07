"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const turnaroundData = [
    { month: 'Jan', days: 12 },
    { month: 'Feb', days: 11 },
    { month: 'Mar', days: 13 },
    { month: 'Apr', days: 10 },
    { month: 'May', days: 9 },
    { month: 'Jun', days: 8.5 },
];

const chartConfig = {
    days: {
        label: "Days",
        color: "hsl(var(--primary))",
    },
};

export default function TurnaroundTimeChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Average Turnaround Time</CardTitle>
                <CardDescription>Trend of total time from draft to decision.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                    <div>
                        <p className="text-xs text-muted-foreground">DRAFT</p>
                        <p className="text-2xl font-bold">3.2d</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">REVIEW</p>
                        <p className="text-2xl font-bold">2.1d</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">APPROVAL</p>
                        <p className="text-2xl font-bold">1.5d</p>
                    </div>
                </div>
                <ChartContainer config={chartConfig} className="h-[150px] w-full">
                    <LineChart data={turnaroundData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} />
                        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                        <Line
                            dataKey="days"
                            type="monotone"
                            stroke="var(--color-days)"
                            strokeWidth={2}
                            dot={true}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
