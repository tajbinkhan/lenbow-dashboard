"use client";

import type React from "react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	ResponsiveDialog,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle
} from "@/components/ui/responsive-dialog";

interface UpdateProfileModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: User;
	onSubmit: (data: { name: string; avatar: string }) => void;
}

export default function UpdateProfileModal({
	open,
	onOpenChange,
	user,
	onSubmit
}: UpdateProfileModalProps) {
	const [name, setName] = useState(user.name);
	const [avatar, setAvatar] = useState(user.image);
	const [isLoading, setIsLoading] = useState(false);

	const initials = (name || user.email)
		.split(" ")
		.map(n => n[0])
		.join("")
		.toUpperCase();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			await new Promise(resolve => setTimeout(resolve, 500));
			// onSubmit({ name, avatar });
		} finally {
			setIsLoading(false);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			setName(user.name);
			setAvatar(user.image);
		}
		onOpenChange(newOpen);
	};

	return (
		<ResponsiveDialog open={open} onOpenChange={handleOpenChange}>
			<ResponsiveDialogContent className="sm:max-w-md">
				<ResponsiveDialogHeader>
					<ResponsiveDialogTitle>Edit Profile</ResponsiveDialogTitle>
					<ResponsiveDialogDescription>
						Update your profile information and avatar
					</ResponsiveDialogDescription>
				</ResponsiveDialogHeader>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="flex justify-center">
						<Avatar className="h-20 w-20">
							<AvatarImage src={avatar || "/placeholder.svg"} alt={name || user.email} />
							<AvatarFallback>{initials}</AvatarFallback>
						</Avatar>
					</div>

					<div className="space-y-2">
						<Label htmlFor="full-name">Full Name</Label>
						<Input
							id="full-name"
							value={name || ""}
							onChange={e => setName(e.target.value)}
							placeholder="Enter your full name"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="avatar-url">Avatar URL</Label>
						<Input
							id="avatar-url"
							type="url"
							value={avatar || ""}
							onChange={e => setAvatar(e.target.value)}
							placeholder="https://example.com/avatar.jpg"
						/>
					</div>

					<div className="flex justify-end gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				</form>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
