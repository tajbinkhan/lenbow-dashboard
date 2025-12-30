"use client";

import { Suspense } from "react";

import Loader from "@/components/ui/loader";

import RequestsProvider from "@/templates/Requests/Table/Provider/RequestsProvider";
import RequestsTable from "@/templates/Requests/Table/RequestsTable";

export default function RequestsTemplate() {
	return (
		<div className="h-full flex-1 flex-col gap-8 md:flex">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-semibold tracking-tight">Requests you made or received</h2>
					<p className="text-muted-foreground">Manage and track all your requests in one place.</p>
				</div>
			</div>
			<Suspense fallback={<Loader />}>
				<RequestsProvider>
					<RequestsTable />
				</RequestsProvider>
			</Suspense>
		</div>
	);
}
