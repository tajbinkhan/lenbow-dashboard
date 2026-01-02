"use client";

import { Suspense } from "react";

import Loader from "@/components/ui/loader";

import BorrowTable from "@/templates/Desktop/Borrow/Table/BorrowTable";
import BorrowProvider from "@/templates/Desktop/Borrow/Table/Provider/BorrowProvider";

export default function BorrowTemplate() {
	return (
		<div className="h-full flex-1 flex-col gap-8 md:flex">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-semibold tracking-tight">Borrow you made or received</h2>
					<p className="text-muted-foreground">Manage and track all your borrow in one place.</p>
				</div>
			</div>
			<Suspense fallback={<Loader />}>
				<BorrowProvider>
					<BorrowTable />
				</BorrowProvider>
			</Suspense>
		</div>
	);
}
