"use client";

import { Check, Edit, Trash2, X } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";

import useAuth from "@/hooks/use-auth";
import {
	transactionApiSlice,
	useDeleteTransactionRequestMutation,
	useUpdateTransactionStatusMutation
} from "@/redux/APISlices/TransactionAPISlice";
import { useAppDispatch } from "@/redux/hooks";
import RequestsRejectModal from "@/templates/Mobile/Requests/Form/RequestsRejectModal";
import RequestsUpdateModel from "@/templates/Mobile/Requests/Form/RequestsUpdateModel";
import { useRequests } from "@/templates/Mobile/Requests/Hook/useRequests";

interface RequestMobileActionsProps {
	data: TransactionInterface;
	showFullButtons?: boolean;
}

export function RequestMobileActions({ data, showFullButtons = false }: RequestMobileActionsProps) {
	const dispatch = useAppDispatch();
	const { setActiveTransaction } = useRequests();

	const { user } = useAuth();

	const isCreatedByMe = data.createdBy === user?.id;

	const [isPending, startTransition] = useTransition();
	const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
	const [isOpenApproveModal, setIsOpenApproveModal] = useState(false);

	const [isUpdateDeleteModal, setIsUpdateDeleteModal] = useState(false);
	const [isOpenRejectModal, setIsOpenRejectModal] = useState(false);

	// RTK Query mutation hook
	const [deleteRequest] = useDeleteTransactionRequestMutation();
	const [updateTransactionStatus] = useUpdateTransactionStatusMutation();

	const handleDeleteRequest = (id: string) => {
		startTransition(async () => {
			await deleteRequest({ transactionIds: [id] })
				.unwrap()
				.then(res => {
					if (res.data) {
						toast.warning(res.data);
					} else {
						toast.success(res.message);
					}
					setIsOpenDeleteModal(false);
					setActiveTransaction(null); // Close the transaction details drawer
					dispatch(transactionApiSlice.util.invalidateTags([{ type: "Transaction" }]));
				})
				.catch(error => {
					setIsOpenDeleteModal(false);
					toast.error(error?.data?.message || "Failed to delete request. Please try again later.");
				});
		});
	};

	const handleApproveRequest = (id: string) => {
		startTransition(async () => {
			await updateTransactionStatus({ transactionId: id, body: { status: "accepted" } })
				.unwrap()
				.then(res => {
					toast.success(res.message);
					setIsOpenApproveModal(false);
					setActiveTransaction(null); // Close the transaction details drawer
					dispatch(transactionApiSlice.util.invalidateTags([{ type: "Transaction" }]));
				})
				.catch(error => {
					setIsOpenApproveModal(false);
					toast.error(error?.data?.message || "Failed to delete request. Please try again later.");
				});
		});
	};

	const containerClass = showFullButtons ? "flex flex-col w-full gap-3" : "flex gap-2";
	const buttonClass = showFullButtons ? "w-full justify-center h-11 text-base" : "h-10 w-10";

	if (!isCreatedByMe) {
		return (
			<>
				{/* Request Reject Modal */}
				<RequestsRejectModal
					transactionId={data.id}
					isRejectModalOpen={isOpenRejectModal}
					setIsRejectModalOpen={setIsOpenRejectModal}
				/>
				{/* Approve Modal */}
				<AlertDialog open={isOpenApproveModal} onOpenChange={setIsOpenApproveModal}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure you want to approve request?</AlertDialogTitle>
							<AlertDialogDescription>Request will be approved permanently</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
							<ExtendedLoadingButton
								onClick={() => handleApproveRequest(data.id)}
								variant="success"
								isLoading={isPending}
								loadingText="Approving..."
							>
								Approve Request
							</ExtendedLoadingButton>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

				<div className={containerClass}>
					<ExtendedButton
						size={showFullButtons ? "default" : "icon"}
						onClick={() => setIsOpenApproveModal(true)}
						disabled={isPending}
						variant="success"
						className={buttonClass}
					>
						<Check className="mr-0 h-5 w-5 md:mr-2" />
						{showFullButtons && <span className="ml-2">Approve Request</span>}
					</ExtendedButton>

					<ExtendedButton
						onClick={() => setIsOpenRejectModal(true)}
						size={showFullButtons ? "default" : "icon"}
						variant="destructive"
						className={buttonClass}
					>
						<X className="mr-0 h-5 w-5 md:mr-2" />
						{showFullButtons && <span className="ml-2">Reject Request</span>}
					</ExtendedButton>
				</div>
			</>
		);
	}

	if (isCreatedByMe) {
		return (
			<>
				{/* Request Update Modal */}
				<RequestsUpdateModel
					transactionId={data.id}
					isUpdateModalOpen={isUpdateDeleteModal}
					setIsUpdateModalOpen={setIsUpdateDeleteModal}
				/>
				{/* Delete Modal */}
				<AlertDialog open={isOpenDeleteModal} onOpenChange={setIsOpenDeleteModal}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure you want to delete request?</AlertDialogTitle>
							<AlertDialogDescription>Request will be deleted permanently</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
							<LoadingButton
								onClick={() => handleDeleteRequest(data.id)}
								variant="destructive"
								isLoading={isPending}
								loadingText="Deleting..."
							>
								Delete Request
							</LoadingButton>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

				<div className={containerClass}>
					<ExtendedButton
						onClick={() => setIsUpdateDeleteModal(true)}
						size={showFullButtons ? "default" : "icon"}
						variant="secondary"
						className={`${buttonClass} bg-muted hover:bg-muted/80 text-foreground border-border h-11 rounded-xl border`}
					>
						<Edit className="h-4 w-4" />
						{showFullButtons && <span className="ml-2">Edit Request</span>}
					</ExtendedButton>

					<Button
						size={showFullButtons ? "default" : "icon"}
						onClick={() => setIsOpenDeleteModal(true)}
						disabled={isPending}
						variant="outline"
						className={`${buttonClass} border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive h-11 rounded-xl`}
					>
						<Trash2 className="h-4 w-4" />
						{showFullButtons && <span className="ml-2">Delete Request</span>}
					</Button>
				</div>
			</>
		);
	}
}
