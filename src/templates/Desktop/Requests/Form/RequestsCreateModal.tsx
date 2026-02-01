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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import useAuth from "@/hooks/use-auth";
import { useCurrencyListQuery } from "@/redux/APISlices/CurrencyAPISlice";
import { useCreateTransactionRequestMutation } from "@/redux/APISlices/TransactionAPISlice";
import { useAppDispatch } from "@/redux/hooks";
import { authenticationApiSlice } from "@/templates/Authentication/Login/Redux/AuthenticationAPISlice";
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

	const { user } = useAuth();
	const dispatch = useAppDispatch();

	const [createTransactionRequest, { isLoading }] = useCreateTransactionRequestMutation();
	const { data, isLoading: isCurrencyLoading } = useCurrencyListQuery();

	const form = useForm({
		resolver: zodResolver(createRequestsSchema),
		defaultValues: {
			contactId: "",
			type: "lend",
			amount: "",
			currency: "",
			dueDate: undefined,
			description: ""
		}
	});

	useEffect(() => {
		if (isCreateModalOpen) {
			form.reset({
				contactId: "",
				type: "lend",
				amount: "",
				currency: user?.currencyCode || "",
				dueDate: undefined,
				description: ""
			});
		}
	}, [isCreateModalOpen, form, user]);

	const onSubmit = async (data: CreateRequestsSchema) => {
		try {
			await createTransactionRequest({
				contactId: data.contactId,
				type: data.type,
				amount: Number(data.amount),
				currency: data.currency,
				...(data.dueDate && { dueDate: data.dueDate }),
				...(data.description && { description: data.description })
			})
				.then(response => {
					if (response.data) {
						// revalidate user information if currency code was null
						if (!user?.currencyCode) {
							dispatch(authenticationApiSlice.util.invalidateTags(["Me"]));
						}
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
										name="contactId"
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor="contactId">Account ID</FieldLabel>
												<FetchConnectedContactList
													id="contactId"
													value={field.value}
													onChange={field.onChange}
													aria-invalid={fieldState.invalid}
												/>
												{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
											</Field>
										)}
									/>

									<div className="flex gap-4">
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
											name="currency"
											control={form.control}
											render={({ field, fieldState }) => (
												<Field data-invalid={fieldState.invalid}>
													<FieldLabel htmlFor="currency">Currency</FieldLabel>
													<Select value={field.value} onValueChange={field.onChange}>
														<SelectTrigger aria-invalid={fieldState.invalid}>
															<SelectValue placeholder="Select currency" />
														</SelectTrigger>
														<SelectContent>
															<SelectGroup>
																{isCurrencyLoading ? (
																	<SelectItem value="loading" disabled>
																		Loading currencies...
																	</SelectItem>
																) : data && data.data && data.data.length > 0 ? (
																	data.data.map(currency => (
																		<SelectItem key={currency.code} value={currency.code}>
																			{currency.code} ({currency.symbol})
																		</SelectItem>
																	))
																) : (
																	<SelectItem value="no-data" disabled>
																		No currencies available
																	</SelectItem>
																)}
															</SelectGroup>
														</SelectContent>
													</Select>
													{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
												</Field>
											)}
										/>
									</div>

									<Controller
										name="type"
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor="type">Request Type</FieldLabel>
												<Select value={field.value} onValueChange={field.onChange}>
													<SelectTrigger aria-invalid={fieldState.invalid}>
														<SelectValue placeholder="Select request type" />
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															<SelectItem value="lend">
																Lend - You&apos;re lending money to the person
															</SelectItem>
															<SelectItem value="borrow">
																Borrow - You&apos;re borrowing money from the person
															</SelectItem>
														</SelectGroup>
													</SelectContent>
												</Select>
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

									<Controller
										name="description"
										control={form.control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel htmlFor="description">Reason</FieldLabel>
												<Textarea
													{...field}
													id="description"
													aria-invalid={fieldState.invalid}
													placeholder="Enter reason for the loan request"
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
