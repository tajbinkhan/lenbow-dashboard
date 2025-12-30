import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import InputNumeric from "@/components/ui/input-numeric";
import { LoadingButton } from "@/components/ui/loading-button";
import {
	ResponsiveDialog,
	ResponsiveDialogClose,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogFooter,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle
} from "@/components/ui/responsive-dialog";

import { useCreateTransactionRequestMutation } from "@/redux/APISlices/TransactionAPISlice";
import {
	CreateRequestsSchema,
	createRequestsSchema
} from "@/templates/Requests/Validation/CreateRequests.schema";

interface RequestsCreateModalProps {
	isCreateModalOpen: boolean;
	setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RequestsCreateModal({
	isCreateModalOpen,
	setIsCreateModalOpen
}: RequestsCreateModalProps) {
	const [createTransactionRequest, { isLoading, reset }] = useCreateTransactionRequestMutation();

	const form = useForm({
		resolver: zodResolver(createRequestsSchema),
		defaultValues: {
			lenderId: "",
			amount: ""
		}
	});

	const onSubmit = async (data: CreateRequestsSchema) => {
		try {
			await createTransactionRequest({
				lenderId: data.lenderId,
				amount: Number(data.amount)
			})
				.then(response => {
					if (response.data) {
						form.reset();
						setIsCreateModalOpen(false);
						toast.success("Loan request created successfully.");
					} else {
						toast.error("Failed to create loan request. Please try again.");
					}
				})
				.catch(() => {
					toast.error("Failed to create loan request. Please try again.");
				});
		} catch (error) {
			toast.error("Failed to create loan request. Please try again.");
		}
	};

	return (
		<ResponsiveDialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
			<ResponsiveDialogContent className="flex max-h-[min(600px,80vh)] flex-col gap-0 p-0 sm:max-w-md">
				<form id="create-request-form" onSubmit={form.handleSubmit(onSubmit)}>
					<ResponsiveDialogHeader className="contents space-y-0 text-left">
						<ResponsiveDialogTitle className="border-b px-6 py-4">
							Create a loan request
						</ResponsiveDialogTitle>
						<ResponsiveDialogDescription asChild>
							<div className="p-6">
								<FieldGroup>
									<Controller
										name="lenderId"
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor="lenderId">Lender ID</FieldLabel>
												<Input
													{...field}
													id="lenderId"
													aria-invalid={fieldState.invalid}
													placeholder="Login button not working on mobile"
													autoComplete="off"
												/>
												{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
											</Field>
										)}
									/>
									<Controller
										name="amount"
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor="amount">Amount</FieldLabel>
												<InputNumeric
													{...field}
													id="amount"
													aria-invalid={fieldState.invalid}
													placeholder="Enter amount"
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
						<LoadingButton
							type="submit"
							form="create-request-form"
							isLoading={isLoading}
							loadingText="Creating..."
						>
							Create Loan Request
						</LoadingButton>
					</ResponsiveDialogFooter>
				</form>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
