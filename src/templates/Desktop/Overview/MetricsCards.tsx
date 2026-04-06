import { AlertCircle, AlertTriangle, Clock, DollarSign, Users } from "lucide-react";

import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { Link } from "@/i18n/navigation";
import { route } from "@/routes/routes";

interface MetricsCardsProps {
	metrics: MetricsData;
	isLoading?: boolean;
}

interface MetricCardProps {
	title: string;
	value: string | number;
	icon: React.ReactNode;
	description?: string;
	href?: string;
	trend?: {
		value: number;
		isPositive: boolean;
	};
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
		default: "bg-primary/10 text-primary dark:bg-primary/15",
		warning: "bg-[var(--color-warning-bg,oklch(0.76_0.16_72_/_0.10))] text-[var(--color-warning-text,oklch(0.60_0.14_72))] dark:bg-[oklch(0.80_0.16_72_/_0.15)] dark:text-[oklch(0.85_0.14_72)]",
		danger: "bg-[var(--color-danger-bg,oklch(0.58_0.22_27_/_0.10))] text-[var(--color-danger-text,oklch(0.58_0.22_27))] dark:bg-[oklch(0.704_0.191_22.216_/_0.15)] dark:text-[oklch(0.75_0.18_27)]",
		success: "bg-[var(--color-success-bg,oklch(0.62_0.18_156_/_0.10))] text-[var(--color-success-text,oklch(0.45_0.16_156))] dark:bg-[oklch(0.68_0.18_158_/_0.15)] dark:text-[oklch(0.75_0.16_158)]"
	};

	const card = (
		<Card
			className={cn(
				"metric-card-hover group overflow-hidden transition-all duration-200",
				href ? "cursor-pointer hover:shadow-lg" : "cursor-default"
			)}
		>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
				<div
					className={cn(
						"rounded-lg p-2.5 transition-all duration-200 group-hover:scale-110 shadow-sm",
						variantStyles[variant]
					)}
				>
					{icon}
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold tracking-tight">{value}</div>
				{description && (
					<p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">{description}</p>
				)}
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
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-10 w-10 rounded-lg" />
			</CardHeader>
			<CardContent>
				<Skeleton className="mb-1 h-8 w-20" />
				<Skeleton className="h-3 w-32" />
			</CardContent>
		</Card>
	);
}

export default function MetricsCards({ metrics, isLoading }: MetricsCardsProps) {
	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{[...Array(8)].map((_, i) => (
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
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<MetricCard
				title="Total Borrowed"
				value={metrics.totalBorrowed.toFixed(2)}
				icon={<DollarSign className="h-4 w-4" />}
				href={route.private.borrow}
				description={
					metrics.overdueBorrowed > 0
						? `${metrics.overdueBorrowed} overdue loan${metrics.overdueBorrowed > 1 ? "s" : ""}`
						: "Active borrowed amount"
				}
				variant={metrics.overdueBorrowed > 0 ? "danger" : "default"}
			/>
			<MetricCard
				title="Total Lent"
				value={metrics.totalLent.toFixed(2)}
				icon={<DollarSign className="h-4 w-4" />}
				href={route.private.lend}
				description={
					metrics.overdueLent > 0
						? `${metrics.overdueLent} overdue loan${metrics.overdueLent > 1 ? "s" : ""}`
						: "Active lent amount"
				}
				variant={metrics.overdueLent > 0 ? "warning" : "success"}
			/>
			<MetricCard
				title="Pending Requests"
				value={metrics.pendingRequests}
				icon={<Clock className="h-4 w-4" />}
				href={route.private.requests}
				description={hasPendingRequests ? "Requests awaiting your approval" : "No pending requests"}
				variant={hasPendingRequests ? "warning" : "default"}
			/>
			<MetricCard
				title="Overdue Loans"
				value={metrics.overdueCount}
				icon={<AlertTriangle className="h-4 w-4" />}
				href={overdueRoute}
				description={hasOverdue ? "Requires immediate attention" : "All loans on track"}
				variant={hasOverdue ? "danger" : "success"}
			/>
			<MetricCard
				title="Repayment Requests"
				value={metrics.repaymentRequests}
				icon={<AlertCircle className="h-4 w-4" />}
				href={route.private.lend}
				description={
					hasRepaymentRequests ? "Pending repayment confirmations" : "No pending repayments"
				}
				variant={hasRepaymentRequests ? "warning" : "default"}
			/>
			<MetricCard
				title="Total Contacts"
				value={metrics.totalContacts}
				icon={<Users className="h-4 w-4" />}
				href={route.private.people}
				description="Connected contacts"
			/>
			<MetricCard
				title="Overdue (Borrowed)"
				value={metrics.overdueBorrowed}
				icon={<AlertTriangle className="h-4 w-4" />}
				href={route.private.borrow}
				description="Loans you need to pay"
				variant={metrics.overdueBorrowed > 0 ? "danger" : "success"}
			/>
			<MetricCard
				title="Overdue (Lent)"
				value={metrics.overdueLent}
				icon={<AlertTriangle className="h-4 w-4" />}
				href={route.private.lend}
				description="Loans awaiting payment"
				variant={metrics.overdueLent > 0 ? "warning" : "success"}
			/>
		</div>
	);
}
