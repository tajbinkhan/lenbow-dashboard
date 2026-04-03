"use client";

import { format, parse } from "date-fns";
import { BarChart3 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartsMobileProps {
	chartData: ChartData;
	isLoading?: boolean;
}

function ChartSkeleton() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-5 w-32" />
				<Skeleton className="h-3 w-48" />
			</CardHeader>
			<CardContent>
				<Skeleton className="h-50 w-full" />
			</CardContent>
		</Card>
	);
}

export default function ChartsMobile({ chartData, isLoading }: ChartsMobileProps) {
	if (isLoading) {
		return <ChartSkeleton />;
	}

	// Prepare data for monthly activity chart
	const monthlyData = chartData.monthlyActivity
		.slice(-6) // Last 6 months
		.map(item => ({
			month: format(parse(item.month, "yyyy-MM", new Date()), "MMM"),
			borrowed: item.borrowed,
			lent: item.lent
		}));

	const hasData = monthlyData.length > 0;

	if (!hasData) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Activity Chart</CardTitle>
					<CardDescription className="text-xs">Your loan activity</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-6 text-center">
						<div className="bg-muted mb-3 rounded-full p-3">
							<BarChart3 className="text-muted-foreground h-6 w-6" />
						</div>
						<p className="text-muted-foreground text-sm">No data available yet</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Monthly Activity</CardTitle>
				<CardDescription className="text-xs">Last 6 months</CardDescription>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={200}>
					<BarChart data={monthlyData}>
						<CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
						<XAxis dataKey="month" className="text-xs" tick={{ fontSize: 10 }} tickLine={false} />
						<YAxis className="text-xs" tick={{ fontSize: 10 }} tickLine={false} />
						<Tooltip
							contentStyle={{
								backgroundColor: "hsl(var(--background))",
								border: "1px solid hsl(var(--border))",
								borderRadius: "6px",
								fontSize: "12px"
							}}
							formatter={value => {
								const parsedValue =
									typeof value === "number"
										? value
										: Number(Array.isArray(value) ? value[0] : value);

								return Number.isFinite(parsedValue) ? parsedValue.toFixed(0) : "0";
							}}
						/>
						<Bar dataKey="borrowed" fill="#ef4444" name="Borrowed" radius={[4, 4, 0, 0]} />
						<Bar dataKey="lent" fill="#10b981" name="Lent" radius={[4, 4, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
