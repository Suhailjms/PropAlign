
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Proposal } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";

export default function ProposalsList({ proposals, title="Active Proposals", description="A list of proposals currently in the pipeline." }: { proposals: Proposal[], title?: string, description?: string }) {
  // Filter out terminal statuses like 'Won' or 'Lost' to show only active proposals.
  const activeProposals = proposals.filter(p => p.status !== 'Won' && p.status !== 'Lost');
  const { user } = useAuth();
  
  return (
    <Card>
      <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Proposal</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Value</TableHead>
              <TableHead className="hidden md:table-cell">Last Updated</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeProposals.map((proposal) => {
              const canDelete = user?.role === 'Admin';
              const canEdit = user && ['Admin', 'Approver', 'Manager', 'Editor'].includes(user.role);

              return (
              <TableRow key={proposal.id}>
                <TableCell>
                  <Link href={`/proposals/${proposal.id}`} className="font-medium hover:underline">{proposal.title}</Link>
                  <div className="text-sm text-muted-foreground">{proposal.client}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                   <Badge 
                    variant="outline" 
                    className={
                        proposal.status === 'In Review' ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
                        proposal.status === 'In Revision' ? 'border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-400' :
                        proposal.status === 'Approved' ? 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400' :
                        proposal.status === 'Submitted' ? 'border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400' :
                        ''
                    }>
                    {proposal.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell font-medium">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(proposal.value)}
                </TableCell>
                <TableCell className="hidden md:table-cell">{proposal.lastUpdated}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions for {proposal.title}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/proposals/${proposal.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      {canEdit && (
                         <DropdownMenuItem asChild>
                           <Link href={`/proposals/${proposal.id}`}>Edit Proposal</Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {canDelete && (
                         <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
