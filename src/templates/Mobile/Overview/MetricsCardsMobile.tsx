import { AlertCircle, AlertTriangle, Clock, DollarSign, TrendingUp, Users } from "lucide-react";

import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { Link } from "@/i18n/navigation";
import { route } from "@/routes/routes";

interface MetricsCardsMobileProps {
	metrics: MetricsData;
	isLoading?: boolean;
}

interface MetricCardProps {
	title: string;
	value: string | number;
	icon: React.ReactNode;
	description?: string;
	href?: string;
	variant?: "default" | "warning" | "danger" | "success";
}

function MetricCard({
	title,
	value,
	icon,
	description,
	href,
	variant = "default"
}: MetricCardProps) {
	const variantStyles = {
		default: "bg-primary/10 text-primary",
		warning: "bg-amber-500/10 text-amber-600 dark:text-amber-500",
		danger: "bg-destructive/10 text-destructive",
		success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500"
	};

	const card = (
		<Card className={cn(href ? "cursor-pointer" : "")}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-xs font-medium">{title}</CardTitle>
				<div className={cn("rounded-lg p-1.5", variantStyles[variant])}>{icon}</div>
			</CardHeader>
			<CardContent>
				<div className="text-xl font-bold">{value}</div>
				{description && <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>}
			</CardContent>
		</Card>
	);

	if (!href) return card;

	return (
		<Link
			href={href}
			className="focus-visible:ring-ring block rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
		>
			{card}
		</Link>
	);
}

function MetricCardSkeleton() {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<Skeleton className="h-3 w-20" />
				<Skeleton className="h-8 w-8 rounded-lg" />
			</CardHeader>
			<CardContent>
				<Skeleton className="mb-1 h-7 w-16" />
				<Skeleton className="h-3 w-28" />
			</CardContent>
		</Card>
	);
}

export default function MetricsCardsMobile({ metrics, isLoading }: MetricsCardsMobileProps) {
	if (isLoading) {
		return (
			<div className="grid grid-cols-2 gap-3">
				{[...Array(6)].map((_, i) => (
					<MetricCardSkeleton key={i} />
				))}
			</div>
		);
	}

	const hasOverdue = metrics.overdueCount > 0;
	const hasPendingRequests = metrics.pendingRequests > 0;
	const hasRepaymentRequests = metrics.repaymentRequests > 0;
	const overdueRoute =
		metrics.overdueBorrowed > 0
			? route.private.borrow
			: metrics.overdueLent > 0
				? route.private.lend
				: route.private.history;

	return (
		<div className="grid grid-cols-2 gap-3">
			<MetricCard
				title="Borrowed"
				value={metrics.totalBorrowed.toFixed(0)}
				icon={<DollarSign className="h-3.5 w-3.5" />}
				href={route.private.borrow}
				description={
					metrics.overdueBorrowed > 0 ? `${metrics.overdueBorrowed} overdue` : "Active amount"
				}
				variant={metrics.overdueBorrowed > 0 ? "danger" : "default"}
			/>
			<MetricCard
				title="Lent"
				value={metrics.totalLent.toFixed(0)}
				icon={<TrendingUp className="h-3.5 w-3.5" />}
				href={route.private.lend}
				description={metrics.overdueLent > 0 ? `${metrics.overdueLent} overdue` : "Active amount"}
				variant={metrics.overdueLent > 0 ? "warning" : "success"}
			/>
			<MetricCard
				title="Pending"
				value={metrics.pendingRequests}
				icon={<Clock className="h-3.5 w-3.5" />}
				href={route.private.requests}
				description={hasPendingRequests ? "Need approval" : "No requests"}
				variant={hasPendingRequests ? "warning" : "default"}
			/>
			<MetricCard
				title="Overdue"
				value={metrics.overdueCount}
				icon={<AlertTriangle className="h-3.5 w-3.5" />}
				href={overdueRoute}
				description={hasOverdue ? "Action needed" : "All on track"}
				variant={hasOverdue ? "danger" : "success"}
			/>
			<MetricCard
				title="Repayments"
				value={metrics.repaymentRequests}
				icon={<AlertCircle className="h-3.5 w-3.5" />}
				href={route.private.lend}
				description={hasRepaymentRequests ? "To review" : "None pending"}
				variant={hasRepaymentRequests ? "warning" : "default"}
			/>
			<MetricCard
				title="Contacts"
				value={metrics.totalContacts}
				icon={<Users className="h-3.5 w-3.5" />}
				href={route.private.people}
				description="Connected"
			/>
		</div>
	);
}
