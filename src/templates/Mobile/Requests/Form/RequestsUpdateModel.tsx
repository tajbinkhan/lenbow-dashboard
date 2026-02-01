import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarDesc, CalendarIcon, DollarSign } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";

import { useCurrencyListQuery } from "@/redux/APISlices/CurrencyAPISlice";
import {
	useLazyGetTransactionByIdQuery,
	useUpdateTransactionRequestMutation
} from "@/redux/APISlices/TransactionAPISlice";
import {
	UpdatePendingRequestsSchema,
	updatePendingRequestsSchema
} from "@/templates/Desktop/Requests/Validation/Requests.schema";

function formatDate(date: Date | undefined) {
	if (!date) return "";
	return date.toLocaleDateString("en-US", {
		day: "2-digit",
		month: "long",
		year: "numeric"
	});
}

interface RequestsUpdateModelProps {
	transactionId: string;
	isUpdateModalOpen: boolean;
	setIsUpdateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RequestsUpdateModel({
	transactionId,
	isUpdateModalOpen,
	setIsUpdateModalOpen
}: RequestsUpdateModelProps) {
	const [open, setOpen] = useState<boolean>(false);

	const [getTransactionById, { isLoading: transactionIsLoading, data: transactionData }] =
		useLazyGetTransactionByIdQuery();

	const [updateTransactionRequest, { isLoading }] = useUpdateTransactionRequestMutation();
	const { data, isLoading: isCurrencyLoading } = useCurrencyListQuery();

	const form = useForm({
		resolver: zodResolver(updatePendingRequestsSchema),
		defaultValues: {
			amount: "",
			currency: "",
			dueDate: undefined
		}
	});

	useEffect(() => {
		if (isUpdateModalOpen) {
			getTransactionById({ transactionId }).then(response => {
				if (response.data?.data) {
					const responseData = response.data.data;
					form.reset({
						amount: responseData.amount.toString(),
						currency: responseData.currency.code,
						dueDate: responseData.dueDate ? new Date(responseData.dueDate) : undefined
					});
				}
			});
		}
	}, [form, isUpdateModalOpen, getTransactionById, transactionId]);

	const onSubmit = async (data: UpdatePendingRequestsSchema) => {
		try {
			const response = await updateTransactionRequest({
				transactionId,
				body: {
					amount: Number(data.amount),
					currency: data.currency,
					...(data.dueDate && { dueDate: data.dueDate })
				}
			});

			if ("data" in response && response.data) {
				form.reset();
				setIsUpdateModalOpen(false);
				toast.success("Loan request updated successfully.");
			} else {
				toast.error("Failed to update loan request. Please try again.");
			}
		} catch {
			toast.error("Failed to update loan request. Please try again.");
		}
	};

	return (
		<Drawer open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
			<DrawerContent className="flex max-h-[85vh] flex-col">
				<div className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden">
					<DrawerHeader className="flex-none">
						<DrawerTitle className="text-2xl font-bold">Update Request</DrawerTitle>
						<DrawerDescription>Modify the amount or due date of your request.</DrawerDescription>
					</DrawerHeader>

					{transactionIsLoading ? (
						<div className="flex-1 space-y-6 p-4">
							<div className="space-y-6">
								<div className="flex flex-col gap-6">
									<div className="flex gap-4">
										<div className="flex-1 space-y-2">
											<Skeleton className="h-4 w-16" />
											<Skeleton className="h-12 w-full rounded-xl" />
										</div>
										<div className="w-28 space-y-2">
											<Skeleton className="h-4 w-16" />
											<Skeleton className="h-12 w-full rounded-xl" />
										</div>
									</div>
									<div className="space-y-2">
										<Skeleton className="h-4 w-16" />
										<Skeleton className="h-12 w-full rounded-xl" />
									</div>
								</div>
							</div>
						</div>
					) : (
						<ScrollArea className="-mx-4 flex-1 overflow-y-auto px-4">
							<form
								id="update-request-form"
								onSubmit={form.handleSubmit(onSubmit)}
								className="px-4 pt-2 pb-4"
							>
								<div className="space-y-6">
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
															<p className="text-destructive text-xs">
																{fieldState.error?.message}
															</p>
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
															<p className="text-destructive text-xs">
																{fieldState.error?.message}
															</p>
														)}
													</div>
												)}
											/>
										</div>

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
								</div>
							</form>
						</ScrollArea>
					)}

					<DrawerFooter className="bg-background flex-none border-t px-4 pt-4 pb-8">
						<ExtendedLoadingButton
							type="submit"
							form="update-request-form"
							className="h-11 w-full rounded-xl text-base font-semibold"
							isLoading={isLoading || transactionIsLoading}
							loadingText="Updating Request..."
							disabled={transactionIsLoading}
						>
							Update Request
						</ExtendedLoadingButton>
						<DrawerClose asChild>
							<Button
								variant="ghost"
								className="text-muted-foreground hover:text-foreground h-11 rounded-xl"
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
