"use client";

import { CalendarDays, Clock, User } from "lucide-react";

import { cn } from "@/lib/utils";

import { ExtendedBadge, type ExtendedVariant } from "@/components/custom-ui/extended-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { RequestMobileActions } from "./RequestMobileActions";
import useAuth from "@/hooks/use-auth";
import { useRequests } from "@/templates/Mobile/Requests/Hook/useRequests";

export function TransactionDetailsDrawer() {
	const { activeTransaction, setActiveTransaction } = useRequests();
	const { user } = useAuth();

	// Derived state for the drawer open status
	const isOpen = !!activeTransaction;
	const data = activeTransaction;

	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setActiveTransaction(null);
		}
	};

	if (!data) return null;

	const isUserBorrower = user && user.id === data.borrower.id;
	const image = isUserBorrower ? data.lender.image : data.borrower.image;
	const userName = isUserBorrower
		? data.lender.name || data.lender.email
		: data.borrower.name || data.borrower.email;

	const email = isUserBorrower ? data.lender.email : data.borrower.email;

	// Badge Variants
	const typeVariant: ExtendedVariant = data.type === "lend" ? "emerald" : "destructive";
	let statusVariant: ExtendedVariant = "warning";
	if (data.status === "accepted") statusVariant = "emerald";
	if (data.status === "rejected") statusVariant = "destructive";
	return (
		<Drawer open={isOpen} onOpenChange={handleOpenChange}>
			<DrawerContent className="flex max-h-[85vh] flex-col">
				<div className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden">
					<DrawerHeader className="flex-none pb-2 text-left">
						<div className="flex items-center justify-between">
							<DrawerTitle className="text-xl">Transaction Details</DrawerTitle>
						</div>
						<DrawerDescription>View complete details of this transaction.</DrawerDescription>
					</DrawerHeader>

					<ScrollArea className="-mx-4 flex-1 overflow-y-auto px-4">
						<div className="space-y-6 px-4 py-2">
							{/* Amount & Status Section */}
							<div className="bg-muted/30 border-border/50 flex flex-col items-center justify-center space-y-2 rounded-xl border py-4">
								<span className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
									Amount
								</span>
								<div className="flex items-baseline gap-1">
									<span className="text-foreground text-4xl font-bold tracking-tight">
										${data.amount.toLocaleString()}
									</span>
								</div>
								<div className="mt-1 flex gap-2">
									<ExtendedBadge
										variant={typeVariant}
										className="px-2.5 py-0.5 text-xs font-semibold uppercase"
									>
										{data.type}
									</ExtendedBadge>
									<ExtendedBadge
										variant={statusVariant}
										className="px-2.5 py-0.5 text-xs capitalize"
									>
										{data.status}
									</ExtendedBadge>
								</div>
							</div>

							{/* User Info Section */}
							<div className="space-y-3">
								<h4 className="text-muted-foreground flex items-center gap-2 text-sm font-medium tracking-wider uppercase">
									<User className="h-4 w-4" />
									{isUserBorrower ? "Lender" : "Borrower"} Details
								</h4>
								<div className="border-border/60 bg-card flex items-center gap-4 rounded-lg border p-3">
									<Avatar className="border-input h-12 w-12 border">
										<AvatarImage src={image || undefined} alt={userName || "User"} />
										<AvatarFallback className="bg-primary/10 text-primary font-bold">
											{userName?.slice(0, 2).toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="flex flex-col overflow-hidden">
										<span className="text-base font-semibold">{userName}</span>
										<span className="text-muted-foreground truncate text-sm">{email}</span>
									</div>
								</div>
							</div>

							<Separator />

							{/* Dates Section */}
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1.5">
									<span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
										<Clock className="h-3.5 w-3.5" />
										Requested On
									</span>
									<p className="pl-5 text-sm font-medium">
										{new Date(data.requestDate || "").toLocaleDateString(undefined, {
											year: "numeric",
											month: "short",
											day: "numeric"
										})}
									</p>
								</div>
								<div className="space-y-1.5">
									<span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
										<CalendarDays className="h-3.5 w-3.5" />
										Due Date
									</span>
									<p
										className={cn(
											"pl-5 text-sm font-medium",
											!data.dueDate && "text-muted-foreground italic"
										)}
									>
										{data.dueDate
											? new Date(data.dueDate).toLocaleDateString(undefined, {
													year: "numeric",
													month: "short",
													day: "numeric"
												})
											: "No due date set"}
									</p>
								</div>
							</div>
						</div>
					</ScrollArea>

					<DrawerFooter className="bg-background flex-none border-t pt-4 pb-8">
						<RequestMobileActions data={data} showFullButtons={true} />
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
