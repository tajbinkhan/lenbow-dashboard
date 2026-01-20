"use client";

import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import Loader from "@/components/ui/loader";

import { MobileToolbar } from "./Components/MobileToolbar";
import RequestCard from "./Components/RequestCard";
import { TransactionDetailsDrawer } from "./Components/TransactionDetailsDrawer";
import { useRequests } from "@/templates/Mobile/Requests/Hook/useRequests";

export default function RequestsList() {
	const { tableData, isLoading, loadMore, hasMore, isFetching } = useRequests();
	const { ref, inView } = useInView();

	useEffect(() => {
		if (inView) {
			loadMore();
		}
	}, [inView, loadMore]);

	if (isLoading && tableData.length === 0) {
		return <Loader />;
	}

	return (
		<div className="flex flex-col gap-4">
			<MobileToolbar />

			{tableData.length === 0 ? (
				<div className="text-muted-foreground flex h-40 items-center justify-center rounded-md border border-dashed">
					No requests found.
				</div>
			) : (
				<div className="grid gap-4">
					{tableData.map(transaction => (
						<RequestCard key={transaction.id} data={transaction} />
					))}
					{hasMore && (
						<div ref={ref} className="flex justify-center p-4">
							{isFetching && <Loader2 className="text-primary animate-spin" />}
						</div>
					)}
				</div>
			)}
			<TransactionDetailsDrawer />
		</div>
	);
}
