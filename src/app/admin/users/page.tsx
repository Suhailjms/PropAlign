
"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createUser, type CreateUserState } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { AccessRole } from "@/lib/types";

export default function UserManagementPage() {
    const { toast } = useToast();
    const initialState: CreateUserState = { message: null, errors: {} };
    const [state, formAction, isPending] = useActionState(createUser, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    const roles: AccessRole[] = ['Admin', 'Manager', 'Approver', 'Reviewer', 'Editor', 'Viewer'];

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast({
                    title: "Success",
                    description: state.message,
                });
                formRef.current?.reset();
            } else {
                toast({
                    variant: "destructive",
                    title: "Error Creating User",
                    description: state.message,
                });
            }
        }
    }, [state, toast]);

    return (
        <main className="flex-1 p-4 md:p-6">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Create New User</CardTitle>
                    <CardDescription>
                       Create a new user account and assign a role by entering their details manually.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form ref={formRef} action={formAction} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" placeholder="e.g. Jane Doe" required />
                            {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" placeholder="e.g. jane.doe@example.com" required />
                             {state.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                             <Input 
                                id="password" 
                                name="password" 
                                type="password"
                                required
                                placeholder="Enter a secure password"
                            />
                            {state.errors?.password && <p className="text-sm font-medium text-destructive">{state.errors.password[0]}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select name="role" defaultValue="Viewer" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map(role => (
                                        <SelectItem key={role} value={role}>{role}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {state.errors?.role && <p className="text-sm font-medium text-destructive">{state.errors.role[0]}</p>}
                        </div>
                        
                         <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create User
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
