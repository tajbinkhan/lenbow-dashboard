"use client";

import { Row } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

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
	useDeleteTransactionRequestMutation
} from "@/redux/APISlices/TransactionAPISlice";
import { useAppDispatch } from "@/redux/hooks";
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

	const [isUpdateModal, setIsUpdateModal] = useState(false);

	// RTK Query mutation hook
	const [deleteRequest] = useDeleteTransactionRequestMutation();

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

	if (type === "borrow") {
		return (
			<>
				{/* Request Update Modal */}
				<RequestsUpdateModel
					transactionId={data.id}
					isUpdateModalOpen={isUpdateModal}
					setIsUpdateModalOpen={setIsUpdateModal}
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
							<Button onClick={() => setIsUpdateModal(true)} size={"icon"} variant="outline">
								<Edit />
							</Button>
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
