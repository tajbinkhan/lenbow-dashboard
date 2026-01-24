"use client";

import { Suspense } from "react";

import Loader from "@/components/ui/loader";

import HistoryList from "./List/HistoryList";
import HistoryProvider from "@/templates/Mobile/History/Provider/HistoryProvider";

export default function HistoryTemplate() {
	return (
		<div className="flex h-full flex-1 flex-col gap-4 overflow-x-hidden p-4">
			<div className="flex flex-col gap-1">
				<h2 className="text-xl font-semibold tracking-tight">Transaction History</h2>
				<p className="text-muted-foreground text-sm">
					Review your past transactions and monitor your account activity.
				</p>
			</div>
			<Suspense fallback={<Loader />}>
				<HistoryProvider>
					<HistoryList />
				</HistoryProvider>
			</Suspense>
		</div>
	);
}
