
"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function RepositoryFilters() {
    return (
        <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by keyword, content, or tag..."
                    className="w-full bg-background pl-8"
                />
            </div>
            <div className="flex gap-4">
                <Select>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="case-study">Case Study</SelectItem>
                        <SelectItem value="executive-summary">Executive Summary</SelectItem>
                        <SelectItem value="pricing">Pricing Terms</SelectItem>
                        <SelectItem value="scope">Scope of Work</SelectItem>
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="most-used">Most Used</SelectItem>
                        <SelectItem value="highest-rated">Highest Rated</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
