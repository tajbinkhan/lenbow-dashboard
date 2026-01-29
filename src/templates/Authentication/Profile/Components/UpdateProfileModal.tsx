"use client";

import { useUpdateProfileImageMutation } from "../../Login/Redux/AuthenticationAPISlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Import User type

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle
} from "@/components/ui/responsive-dialog";

import { getUserInitials } from "@/core/helper";
import { validateString } from "@/validators/commonRule";

// Define the form schema
const updateProfileSchema = z.object({
	name: validateString("Full Name", { min: 2, max: 100 })
});

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

interface UpdateProfileModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: User;
	onSubmit: (data: { name: string }) => Promise<void>;
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

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset
	} = useForm<UpdateProfileFormData>({
		resolver: zodResolver(updateProfileSchema),
		defaultValues: {
			name: user.name || ""
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

			// Validate image is square
			const reader = new FileReader();
			reader.onload = event => {
				const img = new Image();
				img.onload = () => {
					if (img.width !== img.height) {
						toast.error("Please select a square image (width and height must be equal)");
						// Reset the file input
						if (fileInputRef.current) {
							fileInputRef.current.value = "";
						}
						return;
					}

					// Image is valid and square - set preview
					setSelectedFile(file);
					setImagePreview(event.target?.result as string);
				};
				img.onerror = () => {
					alert("Failed to load image. Please try another file.");
				};
				img.src = event.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	};

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const onFormSubmit = async (data: UpdateProfileFormData) => {
		try {
			// Upload image first if selected
			if (selectedFile) {
				const formData = new FormData();
				formData.append("avatar", selectedFile);

				await updateProfileImage(formData).unwrap();
			}

			// Then update profile name
			await onSubmit({ name: data.name });

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
			reset();
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
				<form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 sm:space-y-6">
					{/* Hidden file input */}
					<input
						ref={fileInputRef}
						type="file"
						accept="image/png,image/jpeg,image/webp"
						onChange={handleImageSelect}
						className="hidden"
						disabled={isUploadingImage || isUpdating || isSubmitting}
					/>

					{/* Avatar with click to upload */}
					<div className="flex flex-col items-center gap-3 py-2">
						<button
							type="button"
							onClick={handleAvatarClick}
							className="group relative cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
							disabled={isUploadingImage || isUpdating || isSubmitting}
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
							Click avatar to change photo <br /> (square images only)
						</p>
					</div>

					<Field data-invalid={!!errors.name}>
						<Label htmlFor="full-name" className="text-sm sm:text-base">
							Full Name
						</Label>
						<Input
							id="full-name"
							{...register("name")}
							placeholder="Enter your full name"
							className="text-sm sm:text-base"
							disabled={isUploadingImage || isUpdating || isSubmitting}
						/>
						<FieldError errors={errors.name ? [errors.name] : []} />
					</Field>

					<div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3 sm:pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
							disabled={isSubmitting || isUploadingImage || isUpdating}
							className="w-full text-sm sm:w-auto sm:text-base"
						>
							Cancel
						</Button>
						<LoadingButton
							type="submit"
							className="w-full text-sm sm:w-auto sm:text-base"
							isLoading={isSubmitting || isUploadingImage || isUpdating}
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
