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
import { Textarea } from "@/components/ui/textarea";

import { useCreateTransactionRequestMutation } from "@/redux/APISlices/TransactionAPISlice";
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

	const [createTransactionRequest, { isLoading }] = useCreateTransactionRequestMutation();

	const form = useForm({
		resolver: zodResolver(createRequestsSchema),
		defaultValues: {
			lenderId: "",
			amount: "",
			dueDate: undefined,
			description: ""
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
				...(data.dueDate && { dueDate: data.dueDate }),
				...(data.description && { description: data.description })
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
		<Drawer open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
			<DrawerContent className="flex max-h-[85vh] flex-col">
				<div className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden">
					<DrawerHeader className="flex-none">
						<DrawerTitle className="text-2xl font-bold">New Request</DrawerTitle>
						<DrawerDescription>Create a new loan request to send to a contact.</DrawerDescription>
					</DrawerHeader>

					<ScrollArea className="-mx-4 flex-1 overflow-y-auto px-4">
						<form
							id="create-request-form"
							onSubmit={form.handleSubmit(onSubmit)}
							className="px-4 pt-2 pb-4"
						>
							<div className="space-y-6">
								<Controller
									name="lenderId"
									control={form.control}
									render={({ field, fieldState }) => (
										<div className="space-y-2">
											<div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
												User
											</div>
											<FetchConnectedContactList
												id="lenderId"
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
												className="bg-muted/40 focus:border-primary min-h-[100px] resize-none rounded-xl border-transparent p-3 transition-all"
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

					<DrawerFooter className="bg-background flex-none border-t px-4 pt-4 pb-8">
						<ExtendedLoadingButton
							type="submit"
							form="create-request-form"
							className="shadow-primary/20 h-12 w-full rounded-xl text-base font-semibold shadow-lg"
							isLoading={isLoading}
							loadingText="Creating Request..."
						>
							Send Request
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
