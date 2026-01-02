import { Trash } from "lucide-react";
import { useState } from "react";

import { ExtendedButton } from "@/components/custom-ui/extended-button";
import { ExtendedLoadingButton } from "@/components/custom-ui/extended-loading-button";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface DataTableCompleteRepaySelectedProps {
	selectedIds: string[];
	isCompletingRepay: boolean;
	handleCompleteRepaySelected: () => void;
	showCompleteRepayAll?: boolean;
}

export default function DataTableCompleteRepaySelected({
	selectedIds,
	isCompletingRepay,
	handleCompleteRepaySelected,
	showCompleteRepayAll = false
}: DataTableCompleteRepaySelectedProps) {
	const [isOpen, setIsOpen] = useState(false);

	const handleCompleteRepay = () => {
		handleCompleteRepaySelected();
		setIsOpen(false);
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogTrigger asChild>
				{selectedIds.length > 0 ? (
					<ExtendedButton size="sm" className="hidden h-8 lg:flex" variant="success">
						<Trash className="size-4" aria-hidden="true" />
						Complete Repay ({selectedIds.length})
					</ExtendedButton>
				) : (
					showCompleteRepayAll && (
						<ExtendedButton size="sm" className="hidden h-8 lg:flex" variant="success">
							<Trash className="size-4" aria-hidden="true" />
							Complete Repay All
						</ExtendedButton>
					)
				)}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently complete repay your account and
						remove your data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isCompletingRepay}>Cancel</AlertDialogCancel>
					<ExtendedLoadingButton
						variant="success"
						isLoading={isCompletingRepay}
						onClick={handleCompleteRepay}
						loadingText="Completing Payment..."
					>
						{selectedIds.length > 0 ? (
							<>
								<Trash className="size-4" aria-hidden="true" />
								Complete Repay ({selectedIds.length})
							</>
						) : (
							<>
								<Trash className="size-4" aria-hidden="true" />
								CompleteRepay All
							</>
						)}
					</ExtendedLoadingButton>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
