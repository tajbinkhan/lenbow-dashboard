"use client";

import { Row } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ExtendedButton } from "@/components/custom-ui/extended-button";
import { ExtendedLoadingButton } from "@/components/custom-ui/extended-loading-button";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import {
	transactionApiSlice,
	useAcceptRequestRepaymentTransactionMutation,
	useRejectRequestRepaymentTransactionMutation
} from "@/redux/APISlices/TransactionAPISlice";
import { useAppDispatch } from "@/redux/hooks";

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
	const dispatch = useAppDispatch();
	const data = row.original as TransactionInterface;

	const type = data.status;

	const [isPending, startTransition] = useTransition();

	const [isAcceptRequestOpenModal, setIsAcceptRequestOpenModal] = useState(false);
	const [isRejectRequestOpenModal, setIsRejectRequestOpenModal] = useState(false);

	// RTK Query mutation hook
	const [acceptRequestRepaymentTransaction] = useAcceptRequestRepaymentTransactionMutation();
	const [rejectRequestRepaymentTransaction] = useRejectRequestRepaymentTransactionMutation();

	const handleAcceptRepayment = (id: string) => {
		startTransition(async () => {
			await acceptRequestRepaymentTransaction({
				transactionId: id
			})
				.unwrap()
				.then(res => {
					toast.success(res.message);
					setIsAcceptRequestOpenModal(false);
					dispatch(transactionApiSlice.util.invalidateTags([{ type: "Transaction" }]));
				})
				.catch(error => {
					setIsAcceptRequestOpenModal(false);
					toast.error(
						error?.data?.message || "Failed to accept repayment request. Please try again later."
					);
				});
		});
	};

	const handleRejectRepayment = (id: string) => {
		startTransition(async () => {
			await rejectRequestRepaymentTransaction({
				transactionId: id
			})
				.unwrap()
				.then(res => {
					toast.success(res.message);
					setIsRejectRequestOpenModal(false);
					dispatch(transactionApiSlice.util.invalidateTags([{ type: "Transaction" }]));
				})
				.catch(error => {
					setIsRejectRequestOpenModal(false);
					toast.error(
						error?.data?.message || "Failed to reject repayment request. Please try again later."
					);
				});
		});
	};

	return (
		<>
			{/* Lend Update Modal */}
			{/* <LendPartialRepayModal
				transactionId={data.id}
				remainingAmount={data.remainingAmount}
				isPartialRepayModalOpen={isAcceptRequestOpenModal}
				setIsPartialRepayModalOpen={setIsAcceptRequestOpenModal}
			/> */}

			<AlertDialog open={isAcceptRequestOpenModal} onOpenChange={setIsAcceptRequestOpenModal}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to accept the repayment request?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action will accept the repayment and update the loan status accordingly.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<ExtendedLoadingButton
							onClick={() => handleAcceptRepayment(data.id)}
							variant="success"
							isLoading={isPending}
							loadingText="Accepting..."
						>
							Yes, Accept Repayment
						</ExtendedLoadingButton>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog open={isRejectRequestOpenModal} onOpenChange={setIsRejectRequestOpenModal}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to reject the repayment request?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action will reject the repayment and update the loan status accordingly.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<ExtendedLoadingButton
							onClick={() => handleRejectRepayment(data.id)}
							variant="warning"
							isLoading={isPending}
							loadingText="Rejecting..."
						>
							Yes, Reject Repayment
						</ExtendedLoadingButton>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<div className="flex gap-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<ExtendedButton
							onClick={() => setIsAcceptRequestOpenModal(true)}
							size={"icon"}
							variant="lime"
							disabled={type !== "requested_repay"}
						>
							<Check />
						</ExtendedButton>
					</TooltipTrigger>
					<TooltipContent>
						<p>Accept Repayment</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<ExtendedButton
							size={"icon"}
							onClick={() => setIsRejectRequestOpenModal(true)}
							disabled={isPending || type !== "requested_repay"}
							variant="warning"
						>
							<X />
						</ExtendedButton>
					</TooltipTrigger>
					<TooltipContent>
						<p>Reject Repayment</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</>
	);
}
