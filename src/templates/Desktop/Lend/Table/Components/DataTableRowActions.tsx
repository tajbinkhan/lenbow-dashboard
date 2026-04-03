"use client";

import { Row } from "@tanstack/react-table";
import { Banknote, Check, HandCoins, X } from "lucide-react";
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
	useLenderRepaymentTransactionMutation,
	useRejectRequestRepaymentTransactionMutation
} from "@/redux/APISlices/TransactionAPISlice";
import { useAppDispatch } from "@/redux/hooks";
import LendPartialRepayModal from "@/templates/Desktop/Lend/Form/LendPartialRepayModal";

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
	const [isPartialRepayModalOpen, setIsPartialRepayModalOpen] = useState(false);
	const [isCloseLoanModalOpen, setIsCloseLoanModalOpen] = useState(false);

	// RTK Query mutation hook
	const [acceptRequestRepaymentTransaction] = useAcceptRequestRepaymentTransactionMutation();
	const [rejectRequestRepaymentTransaction] = useRejectRequestRepaymentTransactionMutation();
	const [lenderRepaymentTransaction] = useLenderRepaymentTransactionMutation();

	const showRequestedRepayActions = type === "requested_repay";
	const showDirectSettlementActions = type === "accepted" || type === "partially_paid";

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

	const handleCloseLoan = (id: string) => {
		startTransition(async () => {
			await lenderRepaymentTransaction({
				transactionId: id,
				body: {
					amount: data.remainingAmount
				}
			})
				.unwrap()
				.then(res => {
					toast.success(res.message);
					setIsCloseLoanModalOpen(false);
					dispatch(transactionApiSlice.util.invalidateTags([{ type: "Transaction" }]));
				})
				.catch(error => {
					setIsCloseLoanModalOpen(false);
					toast.error(error?.data?.message || "Failed to close loan. Please try again later.");
				});
		});
	};

	return (
		<>
			<LendPartialRepayModal
				transactionId={data.id}
				remainingAmount={data.remainingAmount}
				isPartialRepayModalOpen={isPartialRepayModalOpen}
				setIsPartialRepayModalOpen={setIsPartialRepayModalOpen}
			/>

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

			<AlertDialog open={isCloseLoanModalOpen} onOpenChange={setIsCloseLoanModalOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure you want to close this loan?</AlertDialogTitle>
						<AlertDialogDescription>
							This will settle the full remaining amount and mark the loan as completed.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
						<ExtendedLoadingButton
							onClick={() => handleCloseLoan(data.id)}
							variant="success"
							isLoading={isPending}
							loadingText="Closing..."
						>
							Yes, Close Loan
						</ExtendedLoadingButton>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<div className="flex gap-2">
				{showRequestedRepayActions && (
					<>
						<Tooltip>
							<TooltipTrigger asChild>
								<ExtendedButton
									onClick={() => setIsAcceptRequestOpenModal(true)}
									size={"icon"}
									variant="lime"
									disabled={isPending}
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
									disabled={isPending}
									variant="warning"
								>
									<X />
								</ExtendedButton>
							</TooltipTrigger>
							<TooltipContent>
								<p>Reject Repayment</p>
							</TooltipContent>
						</Tooltip>
					</>
				)}

				{showDirectSettlementActions && (
					<>
						<Tooltip>
							<TooltipTrigger asChild>
								<ExtendedButton
									onClick={() => setIsPartialRepayModalOpen(true)}
									size={"icon"}
									variant="teal"
									disabled={isPending}
								>
									<HandCoins />
								</ExtendedButton>
							</TooltipTrigger>
							<TooltipContent>
								<p>Settle Partially</p>
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<ExtendedButton
									size={"icon"}
									onClick={() => setIsCloseLoanModalOpen(true)}
									disabled={isPending}
									variant="success"
								>
									<Banknote />
								</ExtendedButton>
							</TooltipTrigger>
							<TooltipContent>
								<p>Close Loan</p>
							</TooltipContent>
						</Tooltip>
					</>
				)}
			</div>
		</>
	);
}
