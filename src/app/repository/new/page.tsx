
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  category: z.string().min(2, { message: "Category must be at least 2 characters." }),
  content: z.string().min(20, { message: "Template content must be at least 20 characters." }),
});

export default function NewTemplatePage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.role !== 'Admin') {
            toast({
                variant: "destructive",
                title: "Access Denied",
                description: "You do not have permission to create templates.",
            });
            router.push('/repository');
        }
    }, [user, router, toast]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
            content: "",
        },
    });
    
    function onSubmit(values: z.infer<typeof formSchema>) {
        // In a real app, you'd save the new template.
        console.log(values);
        toast({
            title: "Template Created",
            description: `A new template titled "${values.title}" has been created.`,
        });
        router.push("/repository"); 
    }

    return (
        <main className="flex-1 p-4 md:p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Template</CardTitle>
                    <CardDescription>
                        Fill in the details below to create a new proposal template for your team to use.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Template Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Standard SaaS Proposal" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder="A short description of when to use this template." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Software, Services" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Template Content</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Write the template content here. Use placeholders like [Client Name]."
                                                className="resize-y min-h-[250px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Create Template</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    );
}
