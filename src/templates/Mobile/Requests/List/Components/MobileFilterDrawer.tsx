"use client";

import { Check, Filter } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { ExtendedButton } from "@/components/custom-ui/extended-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from "@/components/ui/drawer";

import { TRANSACTION_TYPE } from "@/templates/Mobile/Requests/Data/data";
import { useRequests } from "@/templates/Mobile/Requests/Hook/useRequests";

export function MobileFilterDrawer() {
	const { searchParams, handleOptionFilter } = useRequests();
	const [isOpen, setIsOpen] = useState(false);
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (open) {
			const currentTypes = searchParams.get("type")?.split(",").filter(Boolean) || [];
			setSelectedTypes(currentTypes);
		}
	};

	const toggleType = (value: string) => {
		setSelectedTypes(prev =>
			prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
		);
	};

	const handleApply = () => {
		handleOptionFilter("type", selectedTypes.length > 0 ? selectedTypes : undefined);
		setIsOpen(false);
	};

	const handleClear = () => {
		setSelectedTypes([]);
	};

	const activeFilterCount = (searchParams.get("type")?.split(",").filter(Boolean) || []).length;

	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange}>
			<DrawerTrigger asChild>
				<ExtendedButton
					variant="outline"
					size="sm"
					className={cn(
						"h-8 border-dashed",
						activeFilterCount > 0 && "bg-accent text-accent-foreground"
					)}
				>
					<Filter className="mr-2 size-4" />
					Filter
					{activeFilterCount > 0 && (
						<Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal lg:hidden">
							{activeFilterCount}
						</Badge>
					)}
				</ExtendedButton>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle className="text-lg font-semibold">Filter Requests</DrawerTitle>
					<DrawerDescription>Filter the list by transaction type.</DrawerDescription>
				</DrawerHeader>
				<div className="px-4 py-4">
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-3">
							{TRANSACTION_TYPE.map(option => {
								const isSelected = selectedTypes.includes(option.value);
								return (
									<div
										key={option.value}
										role="button"
										tabIndex={0}
										onClick={() => toggleType(option.value)}
										className={cn(
											"relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all duration-200",
											isSelected
												? "border-primary bg-primary/5 shadow-sm"
												: "border-muted hover:border-primary/50 hover:bg-accent"
										)}
									>
										<div
											className={cn(
												"flex h-8 w-8 items-center justify-center rounded-full transition-colors",
												isSelected
													? "bg-primary text-primary-foreground"
													: "bg-muted text-muted-foreground"
											)}
										>
											{isSelected ? <Check className="h-5 w-5" /> : <Filter className="h-4 w-4" />}
										</div>
										<span
											className={cn("font-medium", isSelected ? "text-primary" : "text-foreground")}
										>
											{option.label}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>
				<DrawerFooter className="pt-4 pb-8">
					<ExtendedButton size="lg" onClick={handleApply} className="w-full text-base">
						Apply Filters
					</ExtendedButton>
					<div className="flex gap-3">
						<Button variant="outline" size="lg" className="flex-1" onClick={handleClear}>
							Reset Selection
						</Button>
						<DrawerClose asChild>
							<Button variant="ghost" size="lg" className="flex-1">
								Cancel
							</Button>
						</DrawerClose>
					</div>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
