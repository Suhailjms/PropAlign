"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import type { Proposal } from "@/lib/types";
import { useMemo } from "react";

const chartConfig = {
    won: { label: "Won", color: "hsl(var(--chart-2))" },
    lost: { label: "Lost", color: "hsl(var(--destructive))" },
    inProgress: { label: "In Progress", color: "hsl(var(--chart-5))" },
};

export default function ProposalOutcomeChart({ proposals }: { proposals: Proposal[] }) {
    const outcomeData = useMemo(() => {
        return proposals.reduce((acc, proposal) => {
            if (proposal.status === 'Won') {
                acc.won += 1;
            } else if (proposal.status === 'Lost') {
                acc.lost += 1;
            } else {
                acc.inProgress += 1;
            }
            return acc;
        }, { won: 0, lost: 0, inProgress: 0 });
    }, [proposals]);

    const chartData = useMemo(() => [
        { name: 'won', value: outcomeData.won, fill: chartConfig.won.color },
        { name: 'lost', value: outcomeData.lost, fill: chartConfig.lost.color },
        { name: 'inProgress', value: outcomeData.inProgress, fill: chartConfig.inProgress.color },
    ], [outcomeData]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Proposal Outcome Overview</CardTitle>
                <CardDescription>Last 12 months</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-6 pt-0">
                <ChartContainer config={chartConfig} className="aspect-square h-[250px]">
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius="60%"
                            strokeWidth={5}
                        >
                            {chartData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                            ))}
                        </Pie>
                         <ChartLegend
                            content={<ChartLegendContent nameKey="name" />}
                            className="-mt-4"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
