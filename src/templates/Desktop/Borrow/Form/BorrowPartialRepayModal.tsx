import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { ExtendedLoadingButton } from "@/components/custom-ui/extended-loading-button";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import InputNumeric from "@/components/ui/input-numeric";
import {
	ResponsiveDialog,
	ResponsiveDialogClose,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogFooter,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle
} from "@/components/ui/responsive-dialog";

import { usePartialRepayTransactionRequestMutation } from "@/redux/APISlices/TransactionAPISlice";
import {
	PartialRepayBorrowSchema,
	partialRepayBorrowSchema
} from "@/templates/Desktop/Borrow/Validation/Borrow.schema";

interface BorrowPartialRepayModalProps {
	transactionId: string;
	remainingAmount: number;
	isPartialRepayModalOpen: boolean;
	setIsPartialRepayModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BorrowPartialRepayModal(props: BorrowPartialRepayModalProps) {
	const form = useForm({
		resolver: zodResolver(partialRepayBorrowSchema(props.remainingAmount)),
		defaultValues: {
			amount: ""
		}
	});

	const [partialRepayTransactionRequest, { isLoading }] =
		usePartialRepayTransactionRequestMutation();

	const onSubmit = async (data: PartialRepayBorrowSchema) => {
		try {
			await partialRepayTransactionRequest({
				transactionId: props.transactionId,
				body: data
			})
				.then(response => {
					if (response.data) {
						form.reset();
						props.setIsPartialRepayModalOpen(false);
						toast.success("You have successfully partially repaid the loan request.");
					} else {
						toast.error("Failed to partially repay loan request. Please try again.");
					}
				})
				.catch(() => {
					toast.error("Failed to partially repay loan request. Please try again.");
				});
		} catch (error) {
			toast.error("Failed to partially repay loan request. Please try again.");
		}
	};

	return (
		<ResponsiveDialog
			open={props.isPartialRepayModalOpen}
			onOpenChange={props.setIsPartialRepayModalOpen}
		>
			<ResponsiveDialogContent className="flex max-h-[min(600px,80vh)] flex-col gap-0 p-0 sm:max-w-md">
				<form id="partial-repay-request-form" onSubmit={form.handleSubmit(onSubmit)}>
					<ResponsiveDialogHeader className="contents space-y-0 text-left">
						<ResponsiveDialogTitle className="border-b px-6 py-4">
							Partial Repay the loan request
						</ResponsiveDialogTitle>
						<ResponsiveDialogDescription asChild>
							<div className="p-6">
								<FieldGroup>
									<Controller
										name="amount"
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor={field.name}>Amount</FieldLabel>
												<InputNumeric
													{...field}
													id={field.name}
													aria-invalid={fieldState.invalid}
													placeholder="Enter partial repayment amount"
													className="max-h-40"
													inputMode="numeric"
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
							form="partial-repay-request-form"
							isLoading={isLoading}
							loadingText="Repaying..."
							variant={"rose"}
						>
							Partial Repay
						</ExtendedLoadingButton>
					</ResponsiveDialogFooter>
				</form>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
