import { AlertTriangle, Calendar, ChevronRight, Clock } from "lucide-react";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { getUserInitials } from "@/core/helper";
import { Link } from "@/i18n/navigation";
import { route } from "@/routes/routes";

interface UpcomingDueDatesMobileProps {
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
		label: "Med",
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
					"active:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors duration-200",
					item.urgency === "high" && "border-destructive/50 bg-destructive/5"
				)}
				onClick={() => onItemClick?.(item)}
			>
				<div className={cn("shrink-0 rounded-full p-1.5", config.className)}>
					<Icon className="h-3.5 w-3.5" />
				</div>

				<Avatar className="h-10 w-10 shrink-0">
					<AvatarImage src={item.otherParty.image || ""} alt={item.otherParty.name || ""} />
					<AvatarFallback className="text-xs">
						{getUserInitials(item.otherParty.name || null)}
					</AvatarFallback>
				</Avatar>

				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-medium">
						{item.otherParty.name || item.otherParty.email}
					</p>
					<div className="mt-0.5 flex items-center gap-2">
						<Badge variant={config.variant} className={cn("text-xs", config.className)}>
							{config.label}
						</Badge>
						<p className="text-muted-foreground text-xs">
							{item.daysUntilDue === 0
								? "Today"
								: item.daysUntilDue === 1
									? "Tomorrow"
									: `${item.daysUntilDue}d`}
						</p>
					</div>
				</div>

				<div className="flex shrink-0 items-center gap-2">
					<div className="text-right">
						<p className="text-sm font-semibold">
							{item.currency.symbol}
							{item.remainingAmount.toFixed(0)}
						</p>
						<p className="text-muted-foreground text-xs">
							{item.type === "borrow" ? "Owe" : "Due"}
						</p>
					</div>
					<ChevronRight className="text-muted-foreground h-4 w-4" />
				</div>
			</div>
		</Link>
	);
}

function DueDateItemSkeleton() {
	return (
		<div className="flex items-center gap-3 rounded-lg border p-3">
			<Skeleton className="h-8 w-8 rounded-full" />
			<Skeleton className="h-10 w-10 rounded-full" />
			<div className="flex-1">
				<Skeleton className="mb-2 h-4 w-32" />
				<Skeleton className="h-3 w-20" />
			</div>
			<Skeleton className="h-5 w-12" />
		</div>
	);
}

export default function UpcomingDueDatesMobile({
	upcomingDueDates,
	isLoading,
	onItemClick
}: UpcomingDueDatesMobileProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Upcoming Due Dates</CardTitle>
					<CardDescription className="text-xs">Next 30 days</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
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
					<CardTitle className="text-base">Upcoming Due Dates</CardTitle>
					<CardDescription className="text-xs">Next 30 days</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-6 text-center">
						<div className="bg-muted mb-3 rounded-full p-3">
							<Calendar className="text-muted-foreground h-6 w-6" />
						</div>
						<p className="mb-1 text-sm font-medium">No upcoming due dates</p>
						<p className="text-muted-foreground text-xs">All clear for now</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Sort by urgency
	const sortedDueDates = [...upcomingDueDates].sort((a, b) => {
		const urgencyOrder = { high: 0, medium: 1, low: 2 };
		if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
			return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
		}
		return a.daysUntilDue - b.daysUntilDue;
	});

	const highPriority = sortedDueDates.filter(item => item.urgency === "high").length;

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-base">Upcoming Due Dates</CardTitle>
						<CardDescription className="text-xs">Next 30 days</CardDescription>
					</div>
					{highPriority > 0 && (
						<Badge variant="destructive" className="text-xs">
							{highPriority} High
						</Badge>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				{sortedDueDates.slice(0, 5).map(item => (
					<DueDateItem key={item.id} item={item} onItemClick={onItemClick} />
				))}
				{sortedDueDates.length > 5 && (
					<p className="text-muted-foreground pt-2 text-center text-xs">
						+{sortedDueDates.length - 5} more due dates
					</p>
				)}
			</CardContent>
		</Card>
	);
}
