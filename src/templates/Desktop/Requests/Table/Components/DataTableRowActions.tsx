"use client";

import { Row } from "@tanstack/react-table";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import {
	transactionApiSlice,
	useApproveTransactionRequestMutation,
	useDeleteTransactionRequestMutation
} from "@/redux/APISlices/TransactionAPISlice";
import { useAppDispatch } from "@/redux/hooks";
import RequestsRejectModal from "@/templates/Desktop/Requests/Form/RequestsRejectModal";
import RequestsUpdateModel from "@/templates/Desktop/Requests/Form/RequestsUpdateModel";

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
	const dispatch = useAppDispatch();
	const data = row.original as RequestsInterface;

	const type = data.type;

	const [isPending, startTransition] = useTransition();
	const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
	const [isOpenApproveModal, setIsOpenApproveModal] = useState(false);

	const [isUpdateDeleteModal, setIsUpdateDeleteModal] = useState(false);
	const [isOpenRejectModal, setIsOpenRejectModal] = useState(false);

	// RTK Query mutation hook
	const [deleteRequest] = useDeleteTransactionRequestMutation();
	const [approveRequest] = useApproveTransactionRequestMutation();

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
			await approveRequest({ transactionId: id })
				.unwrap()
				.then(res => {
					toast.success(res.message);
					setIsOpenApproveModal(false);
					dispatch(transactionApiSlice.util.invalidateTags([{ type: "Transaction" }]));
				})
				.catch(error => {
					setIsOpenApproveModal(false);
					toast.error(error?.data?.message || "Failed to delete request. Please try again later.");
				});
		});
	};

	if (type === "lend") {
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

				<div className="flex gap-2">
					<Tooltip>
						<TooltipTrigger asChild>
							<ExtendedButton
								size={"icon"}
								onClick={() => setIsOpenApproveModal(true)}
								disabled={isPending}
								variant="lime"
							>
								<Check />
							</ExtendedButton>
						</TooltipTrigger>
						<TooltipContent>
							<p>Approve Request</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<ExtendedButton
								onClick={() => setIsOpenRejectModal(true)}
								size={"icon"}
								variant="warning"
							>
								<X />
							</ExtendedButton>
						</TooltipTrigger>
						<TooltipContent>
							<p>Reject Request</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</>
		);
	}

	if (type === "borrow") {
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

				<div className="flex gap-2">
					<Tooltip>
						<TooltipTrigger asChild>
							<ExtendedButton
								onClick={() => setIsUpdateDeleteModal(true)}
								size={"icon"}
								variant="teal"
							>
								<Edit />
							</ExtendedButton>
						</TooltipTrigger>
						<TooltipContent>
							<p>Update Request</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size={"icon"}
								onClick={() => setIsOpenDeleteModal(true)}
								disabled={isPending}
								variant="destructive"
							>
								<Trash2 />
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Delete Request</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</>
		);
	}
}
