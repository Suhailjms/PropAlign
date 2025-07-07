
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { templates } from "@/lib/data";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import RepositoryFilters from "@/components/repository/RepositoryFilters";
import { useAuth } from "@/hooks/useAuth";

export default function RepositoryPage() {
    const { user } = useAuth();
    const canManageRepo = user && user.role === 'Admin';

    return (
        <main className="flex-1 p-4 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold font-headline">Repository</h1>
                    <p className="text-muted-foreground">Search and manage reusable content and templates.</p>
                </div>
                <div className="flex items-center gap-2">
                    {canManageRepo && (
                        <Button asChild>
                            <Link href="/repository/new">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                New Template
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            <Tabs defaultValue="templates">
                <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="blocks" disabled>Content Blocks</TabsTrigger>
                </TabsList>
                <div className="mt-4">
                    <RepositoryFilters />
                </div>
                <TabsContent value="templates" className="mt-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {templates.map((template) => (
                            <Card key={template.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{template.title}</CardTitle>
                                    <CardDescription>{template.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="text-sm text-muted-foreground">
                                        <p>Category: <span className="font-medium text-foreground">{template.category}</span></p>
                                        <p>Used: <span className="font-medium text-foreground">{template.usageCount} times</span></p>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href={`/proposals/new?templateId=${template.id}`}>Use Template</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="blocks" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Content Blocks</CardTitle>
                            <CardDescription>Reusable sections like case studies, executive summaries, and more.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <p className="text-center text-muted-foreground py-12">Content blocks feature coming soon.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    );
}
