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

import { useLenderRepaymentTransactionMutation } from "@/redux/APISlices/TransactionAPISlice";
import {
	PartialRepayBorrowSchema,
	partialRepayBorrowSchema
} from "@/templates/Desktop/Borrow/Validation/Borrow.schema";

interface LendPartialRepayModalProps {
	transactionId: string;
	remainingAmount: number;
	isPartialRepayModalOpen: boolean;
	setIsPartialRepayModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LendPartialRepayModal(props: LendPartialRepayModalProps) {
	const form = useForm({
		resolver: zodResolver(partialRepayBorrowSchema(props.remainingAmount)),
		defaultValues: {
			amount: ""
		}
	});

	const [lenderRepaymentTransaction, { isLoading }] = useLenderRepaymentTransactionMutation();

	const onSubmit = async (data: PartialRepayBorrowSchema) => {
		try {
			const response = await lenderRepaymentTransaction({
				transactionId: props.transactionId,
				body: {
					amount: data.amount
				}
			}).unwrap();

			form.reset();
			props.setIsPartialRepayModalOpen(false);
			toast.success(response.message || "Partial loan settlement completed successfully.");
		} catch (error: unknown) {
			const parsedError = error as { data?: { message?: string } };
			toast.error(
				parsedError?.data?.message || "Failed to settle partial repayment. Please try again later."
			);
		}
	};

	return (
		<ResponsiveDialog
			open={props.isPartialRepayModalOpen}
			onOpenChange={props.setIsPartialRepayModalOpen}
		>
			<ResponsiveDialogContent className="flex max-h-[min(600px,80vh)] flex-col gap-0 p-0 sm:max-w-md">
				<form id="partial-repay-lend-form" onSubmit={form.handleSubmit(onSubmit)}>
					<ResponsiveDialogHeader className="contents space-y-0 text-left">
						<ResponsiveDialogTitle className="border-b px-6 py-4">
							Settle Partial Repayment
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
													placeholder="Enter settled amount"
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
							form="partial-repay-lend-form"
							isLoading={isLoading}
							loadingText="Saving..."
							variant={"teal"}
						>
							Settle Partially
						</ExtendedLoadingButton>
					</ResponsiveDialogFooter>
				</form>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
