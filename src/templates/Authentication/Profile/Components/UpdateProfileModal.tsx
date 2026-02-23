"use client";

import { useUpdateProfileImageMutation } from "../../Login/Redux/AuthenticationAPISlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

// Import User type

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { PhoneInput } from "@/components/ui/phone-input";
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle
} from "@/components/ui/responsive-dialog";

import { getUserInitials } from "@/core/helper";
import {
	UpdateProfileSchema,
	updateProfileSchema
} from "@/templates/Authentication/Profile/Validation/Profile.schema";

interface UpdateProfileModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: User;
	onSubmit: (data: UpdateProfileSchema) => Promise<void>;
	isUpdating: boolean;
}

export default function UpdateProfileModal({
	open,
	onOpenChange,
	user,
	onSubmit,
	isUpdating
}: UpdateProfileModalProps) {
	const [updateProfileImage, { isLoading: isUploadingImage }] = useUpdateProfileImageMutation();
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const form = useForm<UpdateProfileSchema>({
		resolver: zodResolver(updateProfileSchema),
		defaultValues: {
			name: user.name || "",
			phone: user.phone || ""
		}
	});

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validate file type
			const allowed = ["image/png", "image/jpeg", "image/webp"] as const;
			if (!allowed.includes(file.type as any)) {
				toast.error("Please select a valid image file (PNG, JPEG, or WebP)");
				return;
			}

			// Validate file size (e.g., max 2MB)
			const maxSize = 2 * 1024 * 1024; // 2MB
			if (file.size > maxSize) {
				toast.error("Image size should be less than 2MB");
				return;
			}

			// Set file and create preview
			setSelectedFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const onFormSubmit = async (data: UpdateProfileSchema) => {
		try {
			// Upload image first if selected
			if (selectedFile) {
				const formData = new FormData();
				formData.append("avatar", selectedFile);

				await updateProfileImage(formData).unwrap();
			}

			// Then update profile name
			await onSubmit(data);

			// Reset form state
			setImagePreview(null);
			setSelectedFile(null);
			onOpenChange(false);
		} catch (error) {
			console.error("Failed to update profile:", error);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			form.reset();
			setImagePreview(null);
			setSelectedFile(null);
		}
		onOpenChange(newOpen);
	};

	return (
		<ResponsiveDialog open={open} onOpenChange={handleOpenChange}>
			<ResponsiveDialogContent className="max-w-md p-4 sm:w-full sm:p-6">
				<ResponsiveDialogHeader>
					<ResponsiveDialogTitle className="text-xl sm:text-2xl">
						Edit Profile
					</ResponsiveDialogTitle>
					<ResponsiveDialogDescription className="text-sm sm:text-base">
						Update your profile information and avatar
					</ResponsiveDialogDescription>
				</ResponsiveDialogHeader>
				<form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4 sm:space-y-6">
					{/* Hidden file input */}
					<input
						ref={fileInputRef}
						type="file"
						accept="image/png,image/jpeg,image/webp"
						onChange={handleImageSelect}
						className="hidden"
						disabled={isUploadingImage || isUpdating || form.formState.isSubmitting}
					/>

					{/* Avatar with click to upload */}
					<div className="flex flex-col items-center gap-3 py-2">
						<button
							type="button"
							onClick={handleAvatarClick}
							className="group relative cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
							disabled={isUploadingImage || isUpdating || form.formState.isSubmitting}
						>
							<Avatar className="h-20 w-20 sm:h-24 sm:w-24">
								<AvatarImage
									src={imagePreview || user.image || undefined}
									alt={user.name || user.email}
								/>
								<AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
							</Avatar>
							<div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
								<Camera className="h-8 w-8 text-white" />
							</div>
						</button>
						<p className="text-muted-foreground text-center text-xs sm:text-sm">
							Click avatar to change photo
						</p>
					</div>

					<FieldGroup>
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
									<Input
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
										placeholder="Enter your full name"
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>

						<Controller
							name="phone"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
									<PhoneInput
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
										placeholder="Enter your phone number"
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
					</FieldGroup>

					<div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3 sm:pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
							disabled={form.formState.isSubmitting || isUploadingImage || isUpdating}
							className="w-full text-sm sm:w-auto sm:text-base"
						>
							Cancel
						</Button>
						<LoadingButton
							type="submit"
							className="w-full text-sm sm:w-auto sm:text-base"
							isLoading={form.formState.isSubmitting || isUploadingImage || isUpdating}
							loadingText="Saving..."
						>
							Save Changes
						</LoadingButton>
					</div>
				</form>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
