"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, Shield, Trash2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldError } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import {
	useCurrencyListQuery,
	useUpdateUserCurrencyMutation
} from "@/redux/APISlices/CurrencyAPISlice";
import { useAppDispatch } from "@/redux/hooks";
import { authenticationApiSlice } from "@/templates/Authentication/Login/Redux/AuthenticationAPISlice";
import {
	CurrencyUpdateSchema,
	currencyUpdateSchema
} from "@/templates/Authentication/Profile/Validation/Profile.schema";

interface SecuritySettingsProps {
	user: User;
	onDeleteAccount: () => void;
}

export default function SecuritySettings({ user, onDeleteAccount }: SecuritySettingsProps) {
	const { data: currencies, isLoading: isCurrencyLoading } = useCurrencyListQuery();
	const [updateCurrency, { isLoading: isUpdatingCurrency }] = useUpdateUserCurrencyMutation();

	const dispatch = useAppDispatch();

	const form = useForm<CurrencyUpdateSchema>({
		resolver: zodResolver(currencyUpdateSchema),
		defaultValues: {
			currency: user.currencyCode || ""
		}
	});

	const onSubmit = (data: CurrencyUpdateSchema) => {
		updateCurrency(data)
			.unwrap()
			.then(() => {
				toast.success("Currency updated successfully");
				dispatch(authenticationApiSlice.util.invalidateTags(["Me"]));
			})
			.catch(error => {
				toast.error(error?.data?.message || "Failed to update currency");
			});
	};

	return (
		<Card className="p-6">
			<h2 className="text-foreground mb-6 text-lg font-semibold">Security Settings</h2>
			<div className="space-y-6">
				{/* Currency Change */}
				<div className="border-border flex items-center justify-between gap-4 border-b py-4">
					<div className="flex items-center gap-3">
						<DollarSign className="text-muted-foreground h-5 w-5" />
						<div>
							<p className="text-foreground font-medium">Change Default Currency</p>
							<p className="text-muted-foreground text-sm">Update your default currency</p>
						</div>
					</div>
					<div className="max-w-40">
						<Controller
							name="currency"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<Select
										value={field.value}
										onValueChange={e => {
											field.onChange(e);
											onSubmit({ ...form.getValues(), currency: e });
										}}
										disabled={isCurrencyLoading || isUpdatingCurrency}
									>
										<SelectTrigger aria-invalid={fieldState.invalid} className="w-full">
											<SelectValue placeholder="Select currency" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												{isCurrencyLoading ? (
													<SelectItem value="loading" disabled>
														Loading currencies...
													</SelectItem>
												) : currencies && currencies.data && currencies.data.length > 0 ? (
													currencies.data.map(currency => (
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
				</div>

				{/* 2FA Toggle */}
				<div className="border-border flex items-center justify-between border-b py-4">
					<div className="flex items-center gap-3">
						<Shield className="text-muted-foreground h-5 w-5" />
						<div>
							<p className="text-foreground font-medium">
								Two-Factor Authentication (Currently Under Development)
							</p>
							<p className="text-muted-foreground text-sm">
								{user.is2faEnabled ? "Enabled" : "Disabled"}
							</p>
						</div>
					</div>
					<Switch disabled />
				</div>

				{/* Delete Account */}
				<div className="flex items-center justify-between py-4">
					<div className="flex items-center gap-3">
						<Trash2 className="text-destructive h-5 w-5" />
						<div>
							<p className="text-foreground font-medium">
								Delete Account (Currently Under Development)
							</p>
							<p className="text-muted-foreground text-sm">
								Permanently delete your account and data
							</p>
						</div>
					</div>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive" size="sm" disabled>
								Delete
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete Account</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete your account and remove
									all associated data from our servers.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<div className="flex gap-4">
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={onDeleteAccount}
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								>
									Delete Account
								</AlertDialogAction>
							</div>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
		</Card>
	);
}
