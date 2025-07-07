"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import type { Template } from "@/lib/types";

const chartConfig = {
    software: { label: "Software", color: "hsl(var(--chart-1))" },
    services: { label: "Services", color: "hsl(var(--chart-2))" },
    infrastructure: { label: "Infrastructure", color: "hsl(var(--chart-3))" },
    security: { label: "Security", color: "hsl(var(--chart-4))" },
};

const colorMapping: { [key: string]: string } = {
    'Software': chartConfig.software.color,
    'Services': chartConfig.services.color,
    'Infrastructure': chartConfig.infrastructure.color,
    'Security': chartConfig.security.color,
}

export default function TemplateUsageChart({ templates }: { templates: Template[] }) {
    const chartData = useMemo(() => templates.map(t => ({
        name: t.title,
        value: t.usageCount,
        fill: colorMapping[t.category] || 'hsl(var(--muted))'
    })), [templates]);

    const sortedTemplates = useMemo(() => [...templates].sort((a, b) => b.usageCount - a.usageCount), [templates]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Proposal Template Usage</CardTitle>
                <CardDescription>Most used templates and their success rates.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[200px]">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="name" hideIndicator />} />
                        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius="50%">
                            {chartData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
                <div className="flex flex-col">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Template</TableHead>
                                <TableHead className="text-right">Success</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedTemplates.slice(0, 4).map(template => (
                                <TableRow key={template.id}>
                                    <TableCell className="font-medium">{template.title}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={template.successRate && template.successRate > 75 ? 'default' : 'secondary'} className={template.successRate && template.successRate > 75 ? 'bg-green-600/80 text-white' : ''}>
                                            {template.successRate}%
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
