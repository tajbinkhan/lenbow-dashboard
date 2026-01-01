import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, ChevronLeftIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import InputNumeric from "@/components/ui/input-numeric";
import { LoadingButton } from "@/components/ui/loading-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import FetchConnectedContactList from "@/templates/Desktop/Requests/Form/FetchConnectedContactList";
import {
	CreateRequestsSchema,
	createRequestsSchema
} from "@/templates/Desktop/Requests/Validation/Requests.schema";

interface RequestsCreateModalProps {
	isCreateModalOpen: boolean;
	setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function formatDate(date: Date | undefined) {
	if (!date) {
		return "";
	}
	return date.toLocaleDateString("en-US", {
		day: "2-digit",
		month: "long",
		year: "numeric"
	});
}

export default function RequestsCreateModal({
	isCreateModalOpen,
	setIsCreateModalOpen
}: RequestsCreateModalProps) {
	const [open, setOpen] = useState<boolean>(false);

	const [createTransactionRequest, { isLoading }] = useCreateTransactionRequestMutation();

	const form = useForm({
		resolver: zodResolver(createRequestsSchema),
		defaultValues: {
			lenderId: "",
			amount: "",
			dueDate: undefined
		}
	});

	useEffect(() => {
		if (isCreateModalOpen) form.reset();
	}, [isCreateModalOpen, form]);

	const onSubmit = async (data: CreateRequestsSchema) => {
		try {
			await createTransactionRequest({
				lenderId: data.lenderId,
				amount: Number(data.amount),
				...(data.dueDate && { dueDate: data.dueDate })
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
												<FieldLabel htmlFor="lenderId">Account ID</FieldLabel>
												<FetchConnectedContactList
													id="lenderId"
													value={field.value}
													onChange={field.onChange}
													aria-invalid={fieldState.invalid}
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

									<Controller
										name="dueDate"
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor="dueDate">Due Date</FieldLabel>
												<div className="relative flex gap-2">
													<Input
														id="date"
														value={field.value ? formatDate(field.value) : ""}
														placeholder="June 01, 2025"
														className="bg-background cursor-pointer pr-10 caret-transparent"
														readOnly
														inputMode="none" // prevents mobile keyboard
														onClick={() => setOpen(true)}
														onFocus={() => setOpen(true)}
														onKeyDown={e => {
															// allow opening via keyboard, but prevent typing
															if (["Enter", " ", "ArrowDown"].includes(e.key)) {
																e.preventDefault();
																setOpen(true);
															} else {
																e.preventDefault();
															}
														}}
													/>

													<Popover open={open} onOpenChange={setOpen}>
														<PopoverTrigger asChild>
															<Button
																id="date-picker"
																type="button"
																variant="ghost"
																className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
																onClick={() => setOpen(true)}
																tabIndex={-1} // optional: keep focus behavior on the input
															>
																<CalendarIcon className="size-3.5" />
																<span className="sr-only">Select date</span>
															</Button>
														</PopoverTrigger>

														<PopoverContent
															className="w-auto overflow-hidden p-0"
															align="end"
															alignOffset={-8}
															sideOffset={10}
														>
															<Calendar
																mode="single"
																selected={field.value}
																captionLayout="dropdown"
																defaultMonth={field.value ?? new Date()}
																startMonth={new Date()}
																endMonth={
																	new Date(new Date().setFullYear(new Date().getFullYear() + 5))
																}
																disabled={date => date < new Date()}
																onSelect={date => {
																	if (!date) return;
																	field.onChange(date);
																	setOpen(false);
																}}
															/>
														</PopoverContent>
													</Popover>
												</div>

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
