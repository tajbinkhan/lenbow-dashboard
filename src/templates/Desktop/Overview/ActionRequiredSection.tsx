import { format } from "date-fns";
import { AlertCircle, AlertTriangle, Clock, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { getUserInitials } from "@/core/helper";
import { Link } from "@/i18n/navigation";
import { route } from "@/routes/routes";

interface ActionRequiredSectionProps {
	actions: ActionRequiredItem[];
	isLoading?: boolean;
	onActionClick?: (action: ActionRequiredItem) => void;
}

const actionTypeConfig = {
	pending_request: {
		icon: Clock,
		label: "Pending Request",
		variant: "warning" as const,
		description: "Awaiting your approval"
	},
	repayment_request: {
		icon: TrendingUp,
		label: "Repayment Request",
		variant: "default" as const,
		description: "Borrower submitted repayment"
	},
	overdue_loan: {
		icon: AlertTriangle,
		label: "Overdue Loan",
		variant: "destructive" as const,
		description: "Past due date"
	},
	updated_transaction: {
		icon: AlertCircle,
		label: "Updated Transaction",
		variant: "default" as const,
		description: "Terms have been updated"
	}
};

function ActionItem({
	action,
	onActionClick
}: {
	action: ActionRequiredItem;
	onActionClick?: (action: ActionRequiredItem) => void;
}) {
	const config = actionTypeConfig[action.type];
	const Icon = config.icon;

	const transactionStatusType = action.userRole === "lender" ? "lend" : "borrow";

	const redirectLink = (type: "lend" | "borrow", status: TransactionStatusType, id: string) => {
		if (status === "pending") {
			return `${route.private.requests}?search=${id}`;
		} else if (status === "rejected" || status === "completed") {
			return `${route.private.history}?search=${id}`;
		} else {
			return `${type === "lend" ? route.private.lend : route.private.borrow}?search=${id}`;
		}
	};

	return (
		<Link href={redirectLink(transactionStatusType, action.status, action.transactionId)}>
			<div
				className={cn(
					"hover:bg-muted/60 flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all duration-200 hover:shadow-md active:scale-[0.99]",
					action.type === "overdue_loan" &&
						"border-[var(--color-danger-border,oklch(0.58_0.22_27_/_0.30))] bg-[var(--color-danger-bg,oklch(0.58_0.22_27_/_0.05))] hover:bg-[oklch(0.58_0.22_27_/_0.10)] dark:border-[oklch(0.704_0.191_22.216_/_0.30)] dark:bg-[oklch(0.704_0.191_22.216_/_0.10)] dark:hover:bg-[oklch(0.704_0.191_22.216_/_0.15)]"
				)}
				onClick={() => onActionClick?.(action)}
			>
				<div
					className={cn(
						"mt-1 rounded-full p-2 shadow-sm",
						action.type === "overdue_loan"
							? "bg-[var(--color-danger-bg,oklch(0.58_0.22_27_/_0.10))] text-[var(--color-danger-text,oklch(0.58_0.22_27))] dark:bg-[oklch(0.704_0.191_22.216_/_0.20)] dark:text-[oklch(0.75_0.18_27)]"
							: action.type === "pending_request"
								? "bg-[var(--color-warning-bg,oklch(0.76_0.16_72_/_0.10))] text-[var(--color-warning-text,oklch(0.60_0.14_72))] dark:bg-[oklch(0.80_0.16_72_/_0.20)] dark:text-[oklch(0.85_0.14_72)]"
								: "bg-primary/10 text-primary dark:bg-primary/15"
					)}
				>
					<Icon className="h-4 w-4" />
				</div>

				<div className="flex-1 space-y-2">
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1">
							<div className="mb-1 flex items-center gap-2">
								<Badge variant={config.variant === "warning" ? "secondary" : config.variant}>
									{config.label}
								</Badge>
								{action.userRole === "lender" && (
									<Badge variant="outline" className="text-xs">
										As Lender
									</Badge>
								)}
								{action.userRole === "borrower" && (
									<Badge variant="outline" className="text-xs">
										As Borrower
									</Badge>
								)}
							</div>
							<p className="text-muted-foreground text-sm">{config.description}</p>
						</div>
						<div className="text-right">
							<p className="text-lg font-semibold">
								{action.currency.symbol}
								{action.amount.toFixed(2)}
							</p>
							<p className="text-muted-foreground text-xs">{action.currency.code}</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Avatar className="h-8 w-8">
							<AvatarImage src={action.otherParty.image || ""} alt={action.otherParty.name || ""} />
							<AvatarFallback className="text-xs">
								{getUserInitials(action.otherParty.name || null)}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<p className="text-sm font-medium">
								{action.otherParty.name || action.otherParty.email}
							</p>
							{action.otherParty.name && (
								<p className="text-muted-foreground text-xs">{action.otherParty.email}</p>
							)}
						</div>
					</div>

					{action.daysOverdue && action.daysOverdue > 0 && (
						<div className="text-destructive flex items-center gap-2">
							<AlertTriangle className="h-3 w-3" />
							<p className="text-xs font-medium">{action.daysOverdue} days overdue</p>
						</div>
					)}

					{action.dueDate && (
						<p className="text-muted-foreground text-xs">
							Due: {format(new Date(action.dueDate), "MMM dd, yyyy")}
						</p>
					)}

					<p className="text-muted-foreground text-xs">
						Requested: {format(new Date(action.requestDate), "MMM dd, yyyy 'at' h:mm a")}
					</p>
				</div>
			</div>
		</Link>
	);
}

function ActionItemSkeleton() {
	return (
		<div className="flex items-start gap-4 rounded-lg border p-4">
			<Skeleton className="mt-1 h-10 w-10 rounded-full" />
			<div className="flex-1 space-y-2">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1 space-y-2">
						<Skeleton className="h-5 w-32" />
						<Skeleton className="h-4 w-48" />
					</div>
					<Skeleton className="h-6 w-20" />
				</div>
				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-8 rounded-full" />
					<div className="flex-1">
						<Skeleton className="h-4 w-32" />
					</div>
				</div>
				<Skeleton className="h-3 w-40" />
			</div>
		</div>
	);
}

export default function ActionRequiredSection({
	actions,
	isLoading,
	onActionClick
}: ActionRequiredSectionProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Action Required</CardTitle>
					<CardDescription>Items that need your attention</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{[...Array(3)].map((_, i) => (
						<ActionItemSkeleton key={i} />
					))}
				</CardContent>
			</Card>
		);
	}

	if (actions.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Action Required</CardTitle>
					<CardDescription>Items that need your attention</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<div className="bg-muted mb-4 rounded-full p-4">
							<Clock className="text-muted-foreground h-8 w-8" />
						</div>
						<h3 className="mb-2 text-lg font-semibold">All caught up!</h3>
						<p className="text-muted-foreground max-w-sm text-sm">
							You have no pending actions at the moment. Check back later for updates.
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Action Required</CardTitle>
						<CardDescription>Items that need your attention</CardDescription>
					</div>
					<Badge variant="secondary">
						{actions.length} item{actions.length !== 1 ? "s" : ""}
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-125 pr-4">
					<div className="flex flex-col gap-4">
						{actions.map(action => (
							<ActionItem
								key={action.transactionId}
								action={action}
								onActionClick={onActionClick}
							/>
						))}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
