"use client";

import { Suspense } from "react";

import Loader from "@/components/ui/loader";

import RequestsList from "./List/RequestsList";
import RequestsProvider from "@/templates/Mobile/Requests/Provider/RequestsProvider";

export default function RequestsTemplate() {
	return (
		<div className="flex h-full flex-1 flex-col gap-4 p-4">
			<div className="flex flex-col gap-1">
				<h2 className="text-xl font-semibold tracking-tight">Requests</h2>
				<p className="text-muted-foreground text-sm">Manage your requests.</p>
			</div>
			<Suspense fallback={<Loader />}>
				<RequestsProvider>
					<RequestsList />
				</RequestsProvider>
			</Suspense>
		</div>
	);
}
