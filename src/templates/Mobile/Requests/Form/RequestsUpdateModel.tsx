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
import { Skeleton } from "@/components/ui/skeleton";

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

	const form = useForm({
		resolver: zodResolver(updatePendingRequestsSchema),
		defaultValues: {
			amount: "",
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
									<div className="space-y-2">
										<Skeleton className="h-4 w-16" />
										<Skeleton className="h-12 w-full rounded-xl" />
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
										<Controller
											name="amount"
											control={form.control}
											render={({ field, fieldState }) => (
												<div className="space-y-2">
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
															className="bg-muted/40 focus:border-primary h-12 rounded-xl border-transparent pl-8 transition-all"
														/>
														<span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 font-semibold">
															$
														</span>
													</div>
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

													<div className="relative">
														<Popover open={open} onOpenChange={setOpen}>
															<PopoverTrigger asChild>
																<Button
																	variant={"outline"}
																	className={`border-input/60 h-12 w-full justify-start rounded-xl text-left font-normal ${!field.value && "text-muted-foreground"}`}
																>
																	{field.value ? formatDate(field.value) : <span>Pick a date</span>}
																	<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
																</Button>
															</PopoverTrigger>
															<PopoverContent className="w-auto p-0" align="start">
																<Calendar
																	mode="single"
																	selected={field.value}
																	onSelect={date => {
																		field.onChange(date);
																		setOpen(false);
																	}}
																	disabled={date => date < new Date()}
																	initialFocus
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
							className="h-12 w-full rounded-xl text-base font-semibold"
							isLoading={isLoading || transactionIsLoading}
							loadingText="Updating Request..."
							disabled={transactionIsLoading}
						>
							Update Request
						</ExtendedLoadingButton>
						<DrawerClose asChild>
							<Button
								variant="ghost"
								className="text-muted-foreground hover:text-foreground h-12 rounded-xl"
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
