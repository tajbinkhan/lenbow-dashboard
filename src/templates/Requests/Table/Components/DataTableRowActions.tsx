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

import useAuth from "@/hooks/use-auth";
import {
	transactionApiSlice,
	useDeleteTransactionRequestMutation
} from "@/redux/APISlices/TransactionAPISlice";
import { useAppDispatch } from "@/redux/hooks";

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
	const dispatch = useAppDispatch();
	const data = row.original as RequestsInterface;

	const { user } = useAuth();

	const userId = user?.id!;

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

	if (userId && userId === data.contact?.id!) {
	} else {
	}

	return (
		<>
			{/* Request Update Modal */}
			{/* <RequestRoleUpdateModal
				isUpdateModal={isUpdateModal}
				setIsUpdateModal={setIsUpdateModal}
				currentRequestRole={data.organizationRole}
			/> */}
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
				<Button onClick={() => setIsUpdateModal(true)} size={"icon"} variant="outline">
					<Edit />
				</Button>
				<Button
					size={"icon"}
					onClick={() => setIsOpenDeleteModal(true)}
					disabled={isPending}
					variant="destructive"
				>
					<Trash2 />
				</Button>
			</div>
		</>
	);
}
