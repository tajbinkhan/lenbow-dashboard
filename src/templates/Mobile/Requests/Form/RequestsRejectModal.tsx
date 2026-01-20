import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { ExtendedLoadingButton } from "@/components/custom-ui/extended-loading-button";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
	ResponsiveDialog,
	ResponsiveDialogClose,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogFooter,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle
} from "@/components/ui/responsive-dialog";
import { Textarea } from "@/components/ui/textarea";

import { useUpdateTransactionStatusMutation } from "@/redux/APISlices/TransactionAPISlice";
import {
	RejectRequestsSchema,
	rejectRequestsSchema
} from "@/templates/Desktop/Requests/Validation/Requests.schema";

interface RequestsRejectModalProps {
	transactionId: string;
	isRejectModalOpen: boolean;
	setIsRejectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RequestsRejectModal(props: RequestsRejectModalProps) {
	const form = useForm({
		resolver: zodResolver(rejectRequestsSchema),
		defaultValues: {
			rejectionReason: ""
		}
	});

	const [updateTransactionStatus, { isLoading }] = useUpdateTransactionStatusMutation();

	const onSubmit = async (data: RejectRequestsSchema) => {
		try {
			await updateTransactionStatus({
				transactionId: props.transactionId,
				body: {
					status: "rejected",
					rejectionReason: data.rejectionReason
				}
			})
				.then(response => {
					if (response.data) {
						form.reset();
						props.setIsRejectModalOpen(false);
						toast.success("You have successfully rejected the loan request.");
					} else {
						toast.error("Failed to reject loan request. Please try again.");
					}
				})
				.catch(() => {
					toast.error("Failed to reject loan request. Please try again.");
				});
		} catch (error) {
			toast.error("Failed to reject loan request. Please try again.");
		}
	};

	return (
		<ResponsiveDialog open={props.isRejectModalOpen} onOpenChange={props.setIsRejectModalOpen}>
			<ResponsiveDialogContent className="flex max-h-[min(600px,80vh)] flex-col gap-0 p-0 sm:max-w-md">
				<form id="reject-request-form" onSubmit={form.handleSubmit(onSubmit)}>
					<ResponsiveDialogHeader className="contents space-y-0 text-left">
						<ResponsiveDialogTitle className="border-b px-6 py-4">
							Reject the loan request
						</ResponsiveDialogTitle>
						<ResponsiveDialogDescription asChild>
							<div className="p-6">
								<FieldGroup>
									<Controller
										name="rejectionReason"
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor={field.name}>Reason</FieldLabel>
												<Textarea
													{...field}
													id={field.name}
													aria-invalid={fieldState.invalid}
													placeholder="Enter rejection reason"
													className="max-h-40"
												/>
												{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
											</Field>
										)}
									/>
								</FieldGroup>
							</div>
						</ResponsiveDialogDescription>
					</ResponsiveDialogHeader>
					<ResponsiveDialogFooter className="bg-transparent px-8 pb-8 sm:justify-end">
						<ResponsiveDialogClose asChild>
							<Button type="button" variant="outline" disabled={isLoading}>
								<ChevronLeftIcon />
								Back
							</Button>
						</ResponsiveDialogClose>
						<ExtendedLoadingButton
							type="submit"
							form="reject-request-form"
							isLoading={isLoading}
							loadingText="Rejecting..."
							variant={"rose"}
						>
							Reject Loan Request
						</ExtendedLoadingButton>
					</ResponsiveDialogFooter>
				</form>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
