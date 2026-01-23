"use client";

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

import {
	transactionApiSlice,
	useAcceptRequestRepaymentTransactionMutation,
	useRejectRequestRepaymentTransactionMutation
} from "@/redux/APISlices/TransactionAPISlice";
import { useAppDispatch } from "@/redux/hooks";
import { useLend } from "@/templates/Mobile/Lend/Hook/useLend";

interface LendMobileActionsProps {
	data: TransactionInterface;
	showFullButtons?: boolean;
}

export function LendMobileActions({ data, showFullButtons = false }: LendMobileActionsProps) {
	const dispatch = useAppDispatch();
	const { setActiveTransaction } = useLend();
	const [isAcceptRequestOpenModal, setIsAcceptRequestOpenModal] = useState(false);
	const [isRejectRequestOpenModal, setIsRejectRequestOpenModal] = useState(false);
	const [isPending, startTransition] = useTransition();

	const [acceptRequestRepaymentTransaction] = useAcceptRequestRepaymentTransactionMutation();
	const [rejectRequestRepaymentTransaction] = useRejectRequestRepaymentTransactionMutation();

	const handleAcceptRepayment = () => {
		startTransition(async () => {
			await acceptRequestRepaymentTransaction({
				transactionId: data.id
			})
				.unwrap()
				.then(res => {
					toast.success(res.message);
					setIsAcceptRequestOpenModal(false);
					setActiveTransaction(null);
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

	const handleRejectRepayment = () => {
		startTransition(async () => {
			await rejectRequestRepaymentTransaction({
				transactionId: data.id
			})
				.unwrap()
				.then(res => {
					toast.success(res.message);
					setIsRejectRequestOpenModal(false);
					setActiveTransaction(null);
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

	const containerClass = showFullButtons ? "flex flex-col w-full gap-3" : "flex gap-2";
	const buttonClass = showFullButtons ? "w-full justify-center h-12 text-base" : "h-10 w-10";

	// Show actions only if status is "requested_repay"
	if (data.status === "requested_repay") {
		return (
			<>
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
								onClick={handleAcceptRepayment}
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
								onClick={handleRejectRepayment}
								variant="warning"
								isLoading={isPending}
								loadingText="Rejecting..."
							>
								Yes, Reject Repayment
							</ExtendedLoadingButton>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

				<div className={containerClass}>
					<ExtendedButton
						onClick={() => setIsAcceptRequestOpenModal(true)}
						size={showFullButtons ? "default" : "icon"}
						variant="lime"
						className={buttonClass}
						disabled={isPending}
					>
						<Check className="mr-0 h-5 w-5 md:mr-2" />
						{showFullButtons && <span className="ml-2">Accept Repayment</span>}
					</ExtendedButton>

					<ExtendedButton
						onClick={() => setIsRejectRequestOpenModal(true)}
						size={showFullButtons ? "default" : "icon"}
						variant="warning"
						className={buttonClass}
						disabled={isPending}
					>
						<X className="mr-0 h-5 w-5 md:mr-2" />
						{showFullButtons && <span className="ml-2">Reject Repayment</span>}
					</ExtendedButton>
				</div>
			</>
		);
	}

	return null;
}
