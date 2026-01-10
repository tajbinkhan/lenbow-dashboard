"use client";

import type React from "react";
import { useState } from "react";

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

interface ChangePasswordModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: {
		currentPassword: string;
		newPassword: string;
		confirmPassword: string;
	}) => void;
}

export default function ChangePasswordModal({
	open,
	onOpenChange,
	onSubmit
}: ChangePasswordModalProps) {
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (newPassword !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (newPassword.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		setIsLoading(true);
		try {
			await new Promise(resolve => setTimeout(resolve, 500));
			onSubmit({ currentPassword, newPassword, confirmPassword });
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			onOpenChange(false);
		} finally {
			setIsLoading(false);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			setError("");
		}
		onOpenChange(newOpen);
	};

	return (
		<ResponsiveDialog open={open} onOpenChange={handleOpenChange}>
			<ResponsiveDialogContent className="sm:max-w-md">
				<ResponsiveDialogHeader>
					<ResponsiveDialogTitle>Change Password</ResponsiveDialogTitle>
					<ResponsiveDialogDescription>
						Enter your current password and choose a new one
					</ResponsiveDialogDescription>
				</ResponsiveDialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="current-password">Current Password</Label>
						<Input
							id="current-password"
							type="password"
							value={currentPassword}
							onChange={e => setCurrentPassword(e.target.value)}
							placeholder="Enter your current password"
							required
							disabled={isLoading}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="new-password">New Password</Label>
						<Input
							id="new-password"
							type="password"
							value={newPassword}
							onChange={e => setNewPassword(e.target.value)}
							placeholder="Enter a new password"
							required
							disabled={isLoading}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirm-password">Confirm Password</Label>
						<Input
							id="confirm-password"
							type="password"
							value={confirmPassword}
							onChange={e => setConfirmPassword(e.target.value)}
							placeholder="Confirm your new password"
							required
							disabled={isLoading}
						/>
					</div>

					{error && (
						<div className="bg-destructive/10 rounded-md p-3">
							<p className="text-destructive text-sm">{error}</p>
						</div>
					)}

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
							{isLoading ? "Updating..." : "Update Password"}
						</Button>
					</div>
				</form>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}
