"use client";

import { Suspense } from "react";

import Loader from "@/components/ui/loader";

import PeopleTable from "@/templates/Desktop/People/Table/PeopleTable";
import PeopleProvider from "@/templates/Desktop/People/Table/Provider/PeopleProvider";

export default function PeopleTemplate() {
	return (
		<div className="h-full flex-1 flex-col gap-8 md:flex">
			<div className="flex items-center justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h2 className="text-2xl font-semibold tracking-tight">Connected People</h2>
					<p className="text-muted-foreground">Manage your connected people here.</p>
				</div>
			</div>
			<Suspense fallback={<Loader />}>
				<PeopleProvider>
					<PeopleTable />
				</PeopleProvider>
			</Suspense>
		</div>
	);
}
