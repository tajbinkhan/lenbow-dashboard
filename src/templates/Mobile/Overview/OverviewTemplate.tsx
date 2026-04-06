"use client";

import ActionRequiredMobile from "./ActionRequiredMobile";
import EmptyStateMobile from "./EmptyStateMobile";
import MetricsCardsMobile from "./MetricsCardsMobile";
import RecentTransactionsMobile from "./RecentTransactionsMobile";
import UpcomingDueDatesMobile from "./UpcomingDueDatesMobile";
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

	return (
		<>
			{/* Content */}
			{isError ? (
				<div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
					<h2 className="mb-2 text-lg font-bold">Unable to Load Dashboard</h2>
					<p className="text-muted-foreground mb-4 text-sm">
						{(error as any)?.data?.message || "Something went wrong. Please try again later."}
					</p>
					<Link href={route.private.dashboard} className="text-primary text-sm hover:underline">
						Refresh Page
					</Link>
				</div>
			) : !isLoading && !hasData ? (
				<EmptyStateMobile />
			) : (
				<div className="flex-1 space-y-4 px-3 py-4 sm:space-y-5 sm:px-4 sm:py-6">
					{/* Metrics */}
					<MetricsCardsMobile metrics={overviewData?.metrics!} isLoading={isLoading} />

					{/* Action Required */}
					<ActionRequiredMobile
						actions={overviewData?.actionRequired || []}
						isLoading={isLoading}
						onActionClick={action => {
							console.log("Action clicked:", action);
						}}
					/>

					{/* Upcoming Due Dates */}
					<UpcomingDueDatesMobile
						upcomingDueDates={overviewData?.upcomingDueDates || []}
						isLoading={isLoading}
						onItemClick={item => {
							console.log("Due date clicked:", item);
						}}
					/>

					{/* Charts */}
					{/* <ChartsMobile chartData={overviewData?.chartData!} isLoading={isLoading} /> */}

					{/* Recent Transactions */}
					<RecentTransactionsMobile
						transactions={overviewData?.recentTransactions || []}
						isLoading={isLoading}
						onTransactionClick={transaction => {
							console.log("Transaction clicked:", transaction);
						}}
					/>
				</div>
			)}
		</>
	);
}
