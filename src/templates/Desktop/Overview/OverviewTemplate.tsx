"use client";

import ActionRequiredSection from "./ActionRequiredSection";
import EmptyState from "./EmptyState";
import MetricsCards from "./MetricsCards";
import RecentTransactionsSection from "./RecentTransactionsSection";
import UpcomingDueDatesSection from "./UpcomingDueDatesSection";
import { Link } from "@/i18n/navigation";
import { useGetOverviewQuery } from "@/redux/APISlices/OverviewAPISlice";
import { route } from "@/routes/routes";

export default function OverviewTemplate() {
	const { data, isLoading, isError, error } = useGetOverviewQuery({
		recentLimit: 10,
		upcomingLimit: 10,
		actionRequiredLimit: 10,
		monthsBack: 6
	});

	const overviewData = data?.data;

	// Check if user has any data
	const hasData =
		overviewData &&
		(overviewData.metrics.totalBorrowed > 0 ||
			overviewData.metrics.totalLent > 0 ||
			overviewData.recentTransactions.length > 0 ||
			overviewData.actionRequired.length > 0);

	// Show error state
	if (isError) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex min-h-100 flex-col items-center justify-center text-center">
					<div className="bg-destructive/10 ring-destructive/20 mb-6 flex h-16 w-16 items-center justify-center rounded-full ring-2">
						<span className="text-destructive text-2xl font-bold">!</span>
					</div>
					<h2 className="mb-2 text-2xl font-bold">Unable to Load Dashboard</h2>
					<p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
						{(error as any)?.data?.message || "Something went wrong. Please try again later."}
					</p>
					<Link
						href={route.private.dashboard}
						className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-200"
					>
						Refresh Page
					</Link>
				</div>
			</div>
		);
	}

	// Show empty state for new users
	if (!isLoading && !hasData) {
		return <EmptyState />;
	}

	return (
		<div className="container mx-auto space-y-6 px-4 sm:px-6 lg:space-y-8 lg:px-8">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h1 className="gradient-text text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
					<p className="text-muted-foreground mt-1 text-sm sm:text-base">
						Welcome back! Here&apos;s an overview of your loan activities.
					</p>
				</div>
			</div>

			{/* Metrics Cards */}
			<MetricsCards metrics={overviewData?.metrics!} isLoading={isLoading} />

			{/* Action Required & Upcoming Due Dates */}
			<div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
				<ActionRequiredSection
					actions={overviewData?.actionRequired || []}
					isLoading={isLoading}
					onActionClick={action => {
						// Navigate to transaction detail or handle action
						console.log("Action clicked:", action);
					}}
				/>
				<UpcomingDueDatesSection
					upcomingDueDates={overviewData?.upcomingDueDates || []}
					isLoading={isLoading}
					onItemClick={item => {
						// Navigate to transaction detail
						console.log("Due date item clicked:", item);
					}}
				/>
			</div>

			{/* Charts Section */}
			{/* <ChartsSection chartData={overviewData?.chartData!} isLoading={isLoading} /> */}

			{/* Recent Transactions */}
			<RecentTransactionsSection
				transactions={overviewData?.recentTransactions || []}
				isLoading={isLoading}
			/>
		</div>
	);
}
