"use client";

import { Calendar, Clock } from "lucide-react";

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

import useAuth from "@/hooks/use-auth";
import { useLend } from "@/templates/Mobile/Lend/Hook/useLend";
import { LendMobileActions } from "@/templates/Mobile/Lend/List/Components/LendMobileActions";

function DetailsRow({
	icon: Icon,
	label,
	value,
	subValue,
	className
}: {
	icon: any;
	label: string;
	value: string | React.ReactNode;
	subValue?: string;
	className?: string;
}) {
	return (
		<div className={cn("flex items-start gap-4 py-3", className)}>
			<div className="bg-muted text-muted-foreground mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
				<Icon className="h-4 w-4" />
			</div>
			<div className="flex-1 space-y-1">
				<p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
					{label}
				</p>
				<div className="text-foreground text-sm font-semibold">{value}</div>
				{subValue && <p className="text-muted-foreground text-xs">{subValue}</p>}
			</div>
		</div>
	);
}

export function TransactionDetailsDrawer() {
	const { activeTransaction, setActiveTransaction } = useLend();
	const { user } = useAuth();

	if (!activeTransaction) return null;

	const isUserLender = user && user.id === activeTransaction.lender.id;
	const image = isUserLender ? activeTransaction.borrower.image : activeTransaction.lender.image;
	const userName = isUserLender
		? activeTransaction.borrower.name || activeTransaction.borrower.email
		: activeTransaction.lender.name || activeTransaction.lender.email;

	const email = isUserLender ? activeTransaction.borrower.email : activeTransaction.lender.email;

	const typeVariant: ExtendedVariant =
		activeTransaction.type === "lend" ? "emerald" : "destructive";

	let statusVariant: ExtendedVariant = "warning";
	if (activeTransaction.status === "accepted") statusVariant = "emerald";
	if (activeTransaction.status === "rejected") statusVariant = "destructive";
	if (activeTransaction.status === "completed") statusVariant = "purple";

	return (
		<Drawer open={!!activeTransaction} onOpenChange={open => !open && setActiveTransaction(null)}>
			<DrawerContent className="max-h-[90vh]">
				<DrawerHeader className="relative border-b pb-4 text-left">
					<DrawerTitle className="pr-8 text-xl font-bold">Transaction Details</DrawerTitle>
					<DrawerDescription>View complete details of this transaction</DrawerDescription>
				</DrawerHeader>

				<ScrollArea className="flex-1 overflow-y-auto">
					<div className="p-4 md:p-6">
						{/* Amount Section */}
						<div className="bg-card mb-6 rounded-2xl border p-6 text-center shadow-sm">
							<p className="text-muted-foreground mb-1 text-sm font-medium">Total Amount</p>
							<h3 className="text-primary text-4xl font-bold tracking-tight">
								{activeTransaction.currency.symbol}
								{activeTransaction.amount.toLocaleString()}
							</h3>
							{activeTransaction.remainingAmount !== undefined &&
								activeTransaction.remainingAmount < activeTransaction.amount && (
									<div className="bg-muted/50 mt-3 inline-flex items-center rounded-full px-3 py-1">
										<p className="text-muted-foreground text-xs font-medium">
											Remaining:{" "}
											<span className="text-foreground font-bold">
												{activeTransaction.currency.symbol}
												{activeTransaction.remainingAmount.toLocaleString()}
											</span>
										</p>
									</div>
								)}
						</div>

						{/* User Info */}
						<div className="flex items-center gap-4 rounded-xl border p-4 shadow-sm">
							<Avatar className="h-12 w-12 border-2 border-white shadow-sm">
								<AvatarImage src={image || undefined} />
								<AvatarFallback className="bg-primary/10 text-primary">
									{userName?.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-1 flex-col justify-center">
								<h4 className="leading-none font-semibold">{userName}</h4>
								<p className="text-muted-foreground mt-1 text-sm">{email}</p>
							</div>
						</div>

						<Separator className="my-6" />

						{/* Details Grid */}
						<div className="grid gap-1">
							<div className="flex items-center justify-between py-2">
								<div className="flex items-center gap-2">
									<ExtendedBadge variant={typeVariant}>
										{activeTransaction.type.charAt(0).toUpperCase() +
											activeTransaction.type.slice(1)}
									</ExtendedBadge>
									<ExtendedBadge variant={statusVariant}>
										{activeTransaction.status
											.split("_")
											.map(word => word.charAt(0).toUpperCase() + word.slice(1))
											.join(" ")}
									</ExtendedBadge>
								</div>
							</div>

							<DetailsRow
								icon={Clock}
								label="Request Date"
								value={new Date(activeTransaction.requestDate || "").toLocaleDateString(undefined, {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric"
								})}
							/>

							{activeTransaction.dueDate && (
								<DetailsRow
									icon={Calendar}
									label="Due Date"
									value={new Date(activeTransaction.dueDate).toLocaleDateString(undefined, {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric"
									})}
									className={
										new Date(activeTransaction.dueDate) < new Date() &&
										activeTransaction.status !== "completed"
											? "text-destructive"
											: ""
									}
								/>
							)}

							{activeTransaction.rejectionReason && (
								<div className="bg-destructive/5 mt-4 rounded-lg border-l-4 border-red-500 p-4">
									<h5 className="text-destructive mb-1 text-sm font-semibold">Rejection Reason</h5>
									<p className="text-muted-foreground text-sm">
										{activeTransaction.rejectionReason}
									</p>
								</div>
							)}
						</div>
					</div>
				</ScrollArea>

				<DrawerFooter className="border-t pt-4 pb-8">
					<LendMobileActions data={activeTransaction} showFullButtons />
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
