"use client";

import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import Loader from "@/components/ui/loader";

import { useLend } from "@/templates/Mobile/Lend/Hook/useLend";
import LendCard from "@/templates/Mobile/Lend/List/Components/LendCard";
import { MobileToolbar } from "@/templates/Mobile/Lend/List/Components/MobileToolbar";
import { TransactionDetailsDrawer } from "@/templates/Mobile/Lend/List/Components/TransactionDetailsDrawer";

export default function LendList() {
	const { tableData, isLoading, loadMore, hasMore, isFetching } = useLend();
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
					No lent transactions found.
				</div>
			) : (
				<div className="grid gap-4">
					{tableData.map(transaction => (
						<LendCard key={transaction.id} data={transaction} />
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
