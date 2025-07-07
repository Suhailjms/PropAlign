"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import type { Proposal, ProposalStatus } from "@/lib/types";
import { useMemo } from "react";

const funnelOrder: ProposalStatus[] = ['Draft', 'In Review', 'Approved', 'Submitted', 'Won'];

const chartConfig = {
    value: {
        label: "Proposals",
        color: "hsl(var(--primary))",
    },
};

export default function ProposalFunnelChart({ proposals }: { proposals: Proposal[] }) {
    const funnelData = useMemo(() => {
        return funnelOrder.map(status => {
            let count = 0;
            const statusIndex = funnelOrder.indexOf(status);
            count = proposals.filter(p => {
                 if (p.status === 'Lost') return false;
                 const pStatusIndex = funnelOrder.indexOf(p.status as ProposalStatus);
                 // A won proposal has passed all previous stages
                 if(p.status === 'Won') return true;
                 return pStatusIndex >= statusIndex;
            }).length;
            
            return { name: status, value: count };
        });
    }, [proposals]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Proposal Funnel</CardTitle>
                <CardDescription>Conversion status from draft to won.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart
                        data={funnelData}
                        layout="vertical"
                        margin={{ left: 10, right: 10, top: 10, bottom: 10 }}
                    >
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            width={80}
                        />
                        <ChartTooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
                        <Bar dataKey="value" layout="vertical" radius={5} fill="var(--color-value)" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
