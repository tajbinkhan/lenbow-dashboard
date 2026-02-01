import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarDesc, CalendarIcon, DollarSign, TextQuote } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { ExtendedLoadingButton } from "@/components/custom-ui/extended-loading-button";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle
} from "@/components/ui/drawer";
import InputNumeric from "@/components/ui/input-numeric";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
	CreateRequestsSchema,
	createRequestsSchema
} from "@/templates/Desktop/Requests/Validation/Requests.schema";
import FetchConnectedContactList from "@/templates/Mobile/Requests/Form/FetchConnectedContactList";

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
	}, [isCreateModalOpen, form, user?.currencyCode]);

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
		<Drawer open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
			<DrawerContent className="flex max-h-[75vh] flex-col">
				<div className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden">
					<DrawerHeader className="flex-none px-4 pt-4 pb-3">
						<DrawerTitle className="text-xl font-bold">New Request</DrawerTitle>
						<DrawerDescription className="text-sm">
							Create a new loan request to send to a contact.
						</DrawerDescription>
					</DrawerHeader>

					<ScrollArea className="-mx-4 flex-1 overflow-y-auto px-4">
						<form
							id="create-request-form"
							onSubmit={form.handleSubmit(onSubmit)}
							className="px-4 pt-1 pb-2"
						>
							<div className="space-y-5">
								<Controller
									name="contactId"
									control={form.control}
									render={({ field, fieldState }) => (
										<div className="space-y-2">
											<div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
												Account ID
											</div>
											<FetchConnectedContactList
												id="contactId"
												value={field.value}
												onChange={field.onChange}
												aria-invalid={fieldState.invalid}
											/>
											{fieldState.invalid && (
												<p className="text-destructive text-xs">{fieldState.error?.message}</p>
											)}
										</div>
									)}
								/>

								<div className="flex flex-col gap-6">
									<div className="flex gap-4">
										<Controller
											name="amount"
											control={form.control}
											render={({ field, fieldState }) => (
												<div className="flex-1 space-y-2">
													<div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
														<DollarSign className="h-3.5 w-3.5" /> Amount
													</div>
													<div className="relative">
														<InputNumeric
															{...field}
															id="amount"
															aria-invalid={fieldState.invalid}
															placeholder="0.00"
															inputMode="numeric"
															className="bg-muted/40 focus:border-primary h-12 rounded-xl border-transparent transition-all"
														/>
													</div>
													{fieldState.invalid && (
														<p className="text-destructive text-xs">{fieldState.error?.message}</p>
													)}
												</div>
											)}
										/>

										<Controller
											name="currency"
											control={form.control}
											render={({ field, fieldState }) => (
												<div className="w-28 space-y-2">
													<div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
														Currency
													</div>
													<Select value={field.value} onValueChange={field.onChange}>
														<SelectTrigger className="bg-muted/40 focus:border-primary h-12! w-full rounded-xl border-transparent transition-all">
															<SelectValue placeholder="Currency" />
														</SelectTrigger>
														<SelectContent>
															<SelectGroup>
																{isCurrencyLoading ? (
																	<SelectItem value="loading" disabled>
																		Loading...
																	</SelectItem>
																) : data && data.data && data.data.length > 0 ? (
																	data.data.map(currency => (
																		<SelectItem key={currency.code} value={currency.code}>
																			{currency.code} ({currency.symbol})
																		</SelectItem>
																	))
																) : (
																	<SelectItem value="no-data" disabled>
																		No currencies
																	</SelectItem>
																)}
															</SelectGroup>
														</SelectContent>
													</Select>
													{fieldState.invalid && (
														<p className="text-destructive text-xs">{fieldState.error?.message}</p>
													)}
												</div>
											)}
										/>
									</div>

									<Controller
										name="type"
										control={form.control}
										render={({ field, fieldState }) => (
											<div className="space-y-2">
												<div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
													Request Type
												</div>
												<Select value={field.value} onValueChange={field.onChange}>
													<SelectTrigger className="bg-muted/40 focus:border-primary h-12! w-full rounded-xl border-transparent transition-all">
														<SelectValue placeholder="Select request type" />
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															<SelectItem value="lend">Lend</SelectItem>
															<SelectItem value="borrow">Borrow</SelectItem>
														</SelectGroup>
													</SelectContent>
												</Select>
												{field.value && (
													<p className="text-muted-foreground text-xs">
														{field.value === "lend"
															? "You're lending money to the person"
															: "You're borrowing money from the person"}
													</p>
												)}
												{fieldState.invalid && (
													<p className="text-destructive text-xs">{fieldState.error?.message}</p>
												)}
											</div>
										)}
									/>

									<Controller
										name="dueDate"
										control={form.control}
										render={({ field, fieldState }) => (
											<div className="space-y-2">
												<div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
													<CalendarDesc className="h-3.5 w-3.5" /> Due Date
												</div>

												<div className="relative flex gap-2">
													<Button
														variant={"outline"}
														className={`border-input/60 h-11 w-full justify-start rounded-xl text-left font-normal ${!field.value && "text-muted-foreground"}`}
														onClick={() => setOpen(true)}
														onKeyDown={e => {
															if (["Enter", " ", "ArrowDown"].includes(e.key)) {
																e.preventDefault();
																setOpen(true);
															} else {
																e.preventDefault();
															}
														}}
														type="button"
													>
														{field.value ? formatDate(field.value) : <span>Pick a date</span>}
													</Button>

													<Popover open={open} onOpenChange={setOpen}>
														<PopoverTrigger asChild>
															<Button
																type="button"
																variant="ghost"
																className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
																onClick={() => setOpen(true)}
																tabIndex={-1}
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
												{fieldState.invalid && (
													<p className="text-destructive text-xs">{fieldState.error?.message}</p>
												)}
											</div>
										)}
									/>
								</div>

								<Controller
									name="description"
									control={form.control}
									render={({ field, fieldState }) => (
										<div className="space-y-2">
											<div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
												<TextQuote className="h-3.5 w-3.5" /> Description
											</div>
											<Textarea
												{...field}
												id="description"
												aria-invalid={fieldState.invalid}
												placeholder="What's this loan for?"
												className="bg-muted/40 focus:border-primary min-h-25 resize-none rounded-xl border-transparent p-3 transition-all"
											/>
											{fieldState.invalid && (
												<p className="text-destructive text-xs">{fieldState.error?.message}</p>
											)}
										</div>
									)}
								/>
							</div>
						</form>
					</ScrollArea>

					<DrawerFooter className="bg-background flex-none border-t px-4 pt-3 pb-6">
						<ExtendedLoadingButton
							type="submit"
							form="create-request-form"
							className="shadow-primary/20 h-11 w-full rounded-xl text-base font-semibold shadow-lg"
							isLoading={isLoading}
							loadingText="Creating Request..."
						>
							Send Request
						</ExtendedLoadingButton>
						<DrawerClose asChild>
							<Button
								variant="ghost"
								className="text-muted-foreground hover:text-foreground h-10 rounded-xl"
							>
								Cancel
							</Button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
