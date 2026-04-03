"use client";

import { format, parse } from "date-fns";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartsSectionProps {
	chartData: ChartData;
	isLoading?: boolean;
}

const STATUS_COLORS = {
	pending: "#f59e0b",
	accepted: "#3b82f6",
	partially_paid: "#8b5cf6",
	completed: "#10b981",
	rejected: "#ef4444",
	requested_repay: "#ec4899"
};

const STATUS_LABELS = {
	pending: "Pending",
	accepted: "Accepted",
	partially_paid: "Partially Paid",
	completed: "Completed",
	rejected: "Rejected",
	requested_repay: "Repayment Requested"
};

function ChartSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-6 w-48" />
			<Skeleton className="h-75 w-full" />
		</div>
	);
}

export default function ChartsSection({ chartData, isLoading }: ChartsSectionProps) {
	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-4 w-64" />
					</CardHeader>
					<CardContent>
						<ChartSkeleton />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-4 w-64" />
					</CardHeader>
					<CardContent>
						<ChartSkeleton />
					</CardContent>
				</Card>
			</div>
		);
	}

	// Prepare data for pie charts
	const borrowerData = Object.entries(chartData.statusDistributionAsBorrower)
		.filter(([_, value]) => value > 0)
		.map(([key, value]) => ({
			name: STATUS_LABELS[key as keyof typeof STATUS_LABELS],
			value,
			color: STATUS_COLORS[key as keyof typeof STATUS_COLORS]
		}));

	const lenderData = Object.entries(chartData.statusDistributionAsLender)
		.filter(([_, value]) => value > 0)
		.map(([key, value]) => ({
			name: STATUS_LABELS[key as keyof typeof STATUS_LABELS],
			value,
			color: STATUS_COLORS[key as keyof typeof STATUS_COLORS]
		}));

	// Prepare data for monthly activity chart
	const monthlyData = chartData.monthlyActivity.map(item => ({
		month: format(parse(item.month, "yyyy-MM", new Date()), "MMM yyyy"),
		borrowed: item.borrowed,
		lent: item.lent
	}));

	const hasData = borrowerData.length > 0 || lenderData.length > 0 || monthlyData.length > 0;

	if (!hasData) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Activity Charts</CardTitle>
					<CardDescription>Visualize your loan activity</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<p className="text-muted-foreground text-sm">
							No data available yet. Start lending or borrowing to see your activity.
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			{/* Monthly Activity Chart */}
			{monthlyData.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Monthly Activity</CardTitle>
						<CardDescription>Borrowed and lent amounts over time</CardDescription>
					</CardHeader>
					<CardContent>
						<ResponsiveContainer width="100%" height={350}>
							<BarChart data={monthlyData}>
								<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
								<XAxis dataKey="month" className="text-xs" />
								<YAxis className="text-xs" />
								<Tooltip
									contentStyle={{
										backgroundColor: "hsl(var(--background))",
										border: "1px solid hsl(var(--border))",
										borderRadius: "6px"
									}}
									formatter={value => {
										const parsedValue =
											typeof value === "number"
												? value
												: Number(Array.isArray(value) ? value[0] : value);

										return Number.isFinite(parsedValue) ? `$${parsedValue.toFixed(2)}` : "$0.00";
									}}
								/>
								<Legend />
								<Bar dataKey="borrowed" fill="#ef4444" name="Borrowed" radius={[4, 4, 0, 0]} />
								<Bar dataKey="lent" fill="#10b981" name="Lent" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			)}

			{/* Status Distribution Charts */}
			<div className="grid gap-4 md:grid-cols-2">
				{borrowerData.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle>Status as Borrower</CardTitle>
							<CardDescription>Distribution of your borrowed loans</CardDescription>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										data={borrowerData}
										cx="50%"
										cy="50%"
										labelLine={false}
										label={({ name, percent }) =>
											`${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
										}
										outerRadius={80}
										fill="#8884d8"
										dataKey="value"
									>
										{borrowerData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} />
										))}
									</Pie>
									<Tooltip
										contentStyle={{
											backgroundColor: "hsl(var(--background))",
											border: "1px solid hsl(var(--border))",
											borderRadius: "6px"
										}}
									/>
								</PieChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				)}

				{lenderData.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle>Status as Lender</CardTitle>
							<CardDescription>Distribution of your lent loans</CardDescription>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										data={lenderData}
										cx="50%"
										cy="50%"
										labelLine={false}
										label={({ name, percent }) =>
											`${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
										}
										outerRadius={80}
										fill="#8884d8"
										dataKey="value"
									>
										{lenderData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} />
										))}
									</Pie>
									<Tooltip
										contentStyle={{
											backgroundColor: "hsl(var(--background))",
											border: "1px solid hsl(var(--border))",
											borderRadius: "6px"
										}}
									/>
								</PieChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
