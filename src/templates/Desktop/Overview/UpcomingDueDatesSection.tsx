import { format } from "date-fns";
import { AlertTriangle, Calendar, Clock } from "lucide-react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { getUserInitials } from "@/core/helper";
import { Link } from "@/i18n/navigation";
import { route } from "@/routes/routes";

interface UpcomingDueDatesSectionProps {
	upcomingDueDates: UpcomingDueDate[];
	isLoading?: boolean;
	onItemClick?: (item: UpcomingDueDate) => void;
}

const urgencyConfig = {
	high: {
		label: "High",
		variant: "destructive" as const,
		icon: AlertTriangle,
		className: "bg-destructive/10 text-destructive"
	},
	medium: {
		label: "Medium",
		variant: "secondary" as const,
		icon: Clock,
		className: "bg-amber-500/10 text-amber-600 dark:text-amber-500"
	},
	low: {
		label: "Low",
		variant: "secondary" as const,
		icon: Calendar,
		className: "bg-blue-500/10 text-blue-600 dark:text-blue-500"
	}
};

function DueDateItem({
	item,
	onItemClick
}: {
	item: UpcomingDueDate;
	onItemClick?: (item: UpcomingDueDate) => void;
}) {
	const config = urgencyConfig[item.urgency];
	const Icon = config.icon;

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
		<Link
			href={redirectLink(item.type, item.status, item.id)}
			className="focus-visible:ring-ring block rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
		>
			<div
				className={cn(
					"hover:bg-muted/50 flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors duration-200",
					item.urgency === "high" && "border-destructive/50 bg-destructive/5"
				)}
				onClick={() => onItemClick?.(item)}
			>
				<div className={cn("mt-1 rounded-full p-2", config.className)}>
					<Icon className="h-4 w-4" />
				</div>

				<div className="flex-1 space-y-2">
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1">
							<div className="mb-1 flex items-center gap-2">
								<Badge variant={config.variant}>{config.label} Priority</Badge>
								<Badge variant="outline" className="text-xs">
									{item.type === "borrow" ? "You Owe" : "They Owe"}
								</Badge>
							</div>
							<p className="text-muted-foreground text-xs">
								{item.daysUntilDue === 0
									? "Due today"
									: item.daysUntilDue === 1
										? "Due tomorrow"
										: `Due in ${item.daysUntilDue} days`}
							</p>
						</div>
						<div className="text-right">
							<p className="text-lg font-semibold">
								{item.currency.symbol}
								{item.remainingAmount.toFixed(2)}
							</p>
							<p className="text-muted-foreground text-xs">
								of {item.currency.symbol}
								{item.amount.toFixed(2)}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Avatar className="h-8 w-8">
							<AvatarImage src={item.otherParty.image || ""} alt={item.otherParty.name || ""} />
							<AvatarFallback className="text-xs">
								{getUserInitials(item.otherParty.name || null)}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1">
							<p className="text-sm font-medium">{item.otherParty.name || item.otherParty.email}</p>
							{item.otherParty.name && (
								<p className="text-muted-foreground text-xs">{item.otherParty.email}</p>
							)}
						</div>
					</div>

					<div className="text-muted-foreground flex items-center gap-2">
						<Calendar className="h-3 w-3" />
						<p className="text-xs">Due: {format(new Date(item.dueDate), "MMM dd, yyyy")}</p>
					</div>
				</div>
			</div>
		</Link>
	);
}

function DueDateItemSkeleton() {
	return (
		<div className="flex items-start gap-4 rounded-lg border p-4">
			<Skeleton className="mt-1 h-10 w-10 rounded-full" />
			<div className="flex-1 space-y-2">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1 space-y-2">
						<Skeleton className="h-5 w-32" />
						<Skeleton className="h-4 w-24" />
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

export default function UpcomingDueDatesSection({
	upcomingDueDates,
	isLoading,
	onItemClick
}: UpcomingDueDatesSectionProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Upcoming Due Dates</CardTitle>
					<CardDescription>Loans due in the next 30 days</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{[...Array(3)].map((_, i) => (
						<DueDateItemSkeleton key={i} />
					))}
				</CardContent>
			</Card>
		);
	}

	if (upcomingDueDates.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Upcoming Due Dates</CardTitle>
					<CardDescription>Loans due in the next 30 days</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<div className="bg-muted mb-4 rounded-full p-4">
							<Calendar className="text-muted-foreground h-8 w-8" />
						</div>
						<h3 className="mb-2 text-lg font-semibold">No upcoming due dates</h3>
						<p className="text-muted-foreground max-w-sm text-sm">
							You don&apos;t have any loans due in the next 30 days.
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Sort by urgency (high -> medium -> low) and days until due
	const sortedDueDates = [...upcomingDueDates].sort((a, b) => {
		const urgencyOrder = { high: 0, medium: 1, low: 2 };
		if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
			return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
		}
		return a.daysUntilDue - b.daysUntilDue;
	});

	const highPriority = sortedDueDates.filter(item => item.urgency === "high").length;
	const mediumPriority = sortedDueDates.filter(item => item.urgency === "medium").length;

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Upcoming Due Dates</CardTitle>
						<CardDescription>Loans due in the next 30 days</CardDescription>
					</div>
					<div className="flex items-center gap-2">
						{highPriority > 0 && (
							<Badge variant="destructive" className="text-xs">
								{highPriority} High
							</Badge>
						)}
						{mediumPriority > 0 && (
							<Badge
								variant="secondary"
								className="bg-amber-500/10 text-xs text-amber-600 dark:text-amber-500"
							>
								{mediumPriority} Medium
							</Badge>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-125 pr-4">
					<div className="space-y-4">
						{sortedDueDates.map(item => (
							<DueDateItem key={item.id} item={item} onItemClick={onItemClick} />
						))}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
