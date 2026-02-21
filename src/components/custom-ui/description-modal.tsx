"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	ResponsiveDialog,
	ResponsiveDialogBody,
	ResponsiveDialogClose,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogFooter,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
	ResponsiveDialogTrigger
} from "@/components/ui/responsive-dialog";

interface DescriptionModalProps {
	description: string;
	trigger?: React.ReactNode;
}

export function DescriptionModal({ description, trigger }: DescriptionModalProps) {
	return (
		<ResponsiveDialog>
			<ResponsiveDialogTrigger asChild>
				{trigger || <button className="text-primary text-xs hover:underline">show more</button>}
			</ResponsiveDialogTrigger>
			<ResponsiveDialogContent className="sm:max-w-125">
				<ResponsiveDialogHeader>
					<ResponsiveDialogTitle>Description</ResponsiveDialogTitle>
					<ResponsiveDialogDescription>Full transaction description</ResponsiveDialogDescription>
				</ResponsiveDialogHeader>
				<ResponsiveDialogBody>
					<p className="text-sm leading-relaxed whitespace-pre-wrap">{description}</p>
				</ResponsiveDialogBody>
				<ResponsiveDialogFooter>
					<ResponsiveDialogClose asChild>
						<Button variant="outline">Close</Button>
					</ResponsiveDialogClose>
				</ResponsiveDialogFooter>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
