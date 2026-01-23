"use client";

import { Suspense } from "react";

import Loader from "@/components/ui/loader";

import LendList from "@/templates/Mobile/Lend/List/LendList";
import LendProvider from "@/templates/Mobile/Lend/Provider/LendProvider";

export default function LendTemplate() {
	return (
		<div className="flex h-full flex-1 flex-col gap-4 p-4">
			<div className="flex flex-col gap-1">
				<h2 className="text-xl font-semibold tracking-tight">Lend</h2>
				<p className="text-muted-foreground text-sm">
					Manage and track all your lend transactions in one place.
				</p>
			</div>
			<Suspense fallback={<Loader />}>
				<LendProvider>
					<LendList />
				</LendProvider>
			</Suspense>
		</div>
	);
}
