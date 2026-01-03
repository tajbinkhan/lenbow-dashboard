"use client";

import { Row } from "@tanstack/react-table";
import { useState, useTransition } from "react";
import { FaSackDollar } from "react-icons/fa6";
import { RiRefund2Line } from "react-icons/ri";
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
	useUpdateTransactionStatusMutation
} from "@/redux/APISlices/TransactionAPISlice";
import { useAppDispatch } from "@/redux/hooks";
import BorrowPartialRepayModal from "@/templates/Desktop/Borrow/Form/BorrowPartialRepayModal";

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
	const dispatch = useAppDispatch();
	const data = row.original as TransactionInterface;

	const type = data.status;

	const [isPending, startTransition] = useTransition();
	const [isOpenCompleteRepayModal, setIsOpenCompleteRepayModal] = useState(false);

	const [isUpdatePartialRepayModal, setIsUpdatePartialRepayModal] = useState(false);

	// RTK Query mutation hook
	const [updateTransactionStatus] = useUpdateTransactionStatusMutation();

	const handleCompleteRepayBorrow = (id: string) => {
		startTransition(async () => {
			await updateTransactionStatus({
				transactionId: id,
				body: { status: "requested_repay", reviewAmount: data.remainingAmount }
			})
				.unwrap()
				.then(res => {
					toast.success(res.message);
					setIsOpenCompleteRepayModal(false);
					dispatch(transactionApiSlice.util.invalidateTags([{ type: "Transaction" }]));
				})
				.catch(error => {
					setIsOpenCompleteRepayModal(false);
					toast.error(
						error?.data?.message || "Failed to complete repay borrow. Please try again later."
					);
				});
		});
	};

	return (
		<>
			{/* Borrow Update Modal */}
			<BorrowPartialRepayModal
				transactionId={data.id}
				remainingAmount={data.remainingAmount}
				isPartialRepayModalOpen={isUpdatePartialRepayModal}
				setIsPartialRepayModalOpen={setIsUpdatePartialRepayModal}
			/>

			<AlertDialog open={isOpenCompleteRepayModal} onOpenChange={setIsOpenCompleteRepayModal}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure you want to full repay of this loan?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently complete the loan and remove it
							from the pending borrow list.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<ExtendedLoadingButton
							onClick={() => handleCompleteRepayBorrow(data.id)}
							variant="success"
							isLoading={isPending}
							loadingText="Completing Payment..."
						>
							Yes, Complete Payment
						</ExtendedLoadingButton>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<div className="flex gap-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<ExtendedButton
							onClick={() => setIsUpdatePartialRepayModal(true)}
							size={"icon"}
							variant="teal"
							disabled={type === "requested_repay"}
						>
							<RiRefund2Line />
						</ExtendedButton>
					</TooltipTrigger>
					<TooltipContent>
						<p>Partially Repay</p>
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<ExtendedButton
							size={"icon"}
							onClick={() => setIsOpenCompleteRepayModal(true)}
							disabled={isPending || type === "requested_repay"}
							variant="success"
						>
							<FaSackDollar />
						</ExtendedButton>
					</TooltipTrigger>
					<TooltipContent>
						<p>Complete Repay</p>
					</TooltipContent>
				</Tooltip>
			</div>
		</>
	);
}
