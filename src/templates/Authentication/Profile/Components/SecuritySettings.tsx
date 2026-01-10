"use client";

import { Lock, Shield, Trash2 } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";

interface SecuritySettingsProps {
	user: User;
	onChangePassword: () => void;
	onToggle2FA: () => void;
	onDeleteAccount: () => void;
}

export default function SecuritySettings({
	user,
	onChangePassword,
	onToggle2FA,
	onDeleteAccount
}: SecuritySettingsProps) {
	return (
		<Card className="p-6">
			<h2 className="text-foreground mb-6 text-lg font-semibold">Security Settings</h2>
			<div className="space-y-6">
				{/* Password Change */}
				<div className="border-border flex items-center justify-between border-b py-4">
					<div className="flex items-center gap-3">
						<Lock className="text-muted-foreground h-5 w-5" />
						<div>
							<p className="text-foreground font-medium">Change Password</p>
							<p className="text-muted-foreground text-sm">Update your account password</p>
						</div>
					</div>
					<Button onClick={onChangePassword} variant="outline" size="sm">
						Change
					</Button>
				</div>

				{/* 2FA Toggle */}
				<div className="border-border flex items-center justify-between border-b py-4">
					<div className="flex items-center gap-3">
						<Shield className="text-muted-foreground h-5 w-5" />
						<div>
							<p className="text-foreground font-medium">Two-Factor Authentication</p>
							<p className="text-muted-foreground text-sm">
								{user.is2faEnabled ? "Enabled" : "Disabled"}
							</p>
						</div>
					</div>
					<Switch />
				</div>

				{/* Delete Account */}
				<div className="flex items-center justify-between py-4">
					<div className="flex items-center gap-3">
						<Trash2 className="text-destructive h-5 w-5" />
						<div>
							<p className="text-foreground font-medium">Delete Account</p>
							<p className="text-muted-foreground text-sm">
								Permanently delete your account and data
							</p>
						</div>
					</div>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive" size="sm">
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
