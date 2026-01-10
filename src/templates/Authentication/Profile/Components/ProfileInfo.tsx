"use client";

import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ProfileInfoProps {
	user: User;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
	return (
		<Card className="p-6">
			<h2 className="text-foreground mb-4 text-lg font-semibold">Account Information</h2>
			<div className="space-y-4">
				<div className="border-border flex items-center justify-between border-b py-2">
					<span className="text-muted-foreground text-sm">Email Verification Status</span>
					<Badge variant={user.emailVerified ? "default" : "secondary"}>
						{user.emailVerified ? "Verified" : "Unverified"}
					</Badge>
				</div>
				<div className="border-border flex items-center justify-between border-b py-2">
					<span className="text-muted-foreground text-sm">Two-Factor Authentication</span>
					<Badge variant={user.is2faEnabled ? "default" : "secondary"}>
						{user.is2faEnabled ? "Enabled" : "Disabled"}
					</Badge>
				</div>
				<div className="border-border flex items-center justify-between border-b py-2">
					<span className="text-muted-foreground text-sm">Account Created</span>
					<span className="text-foreground text-sm font-medium">
						{format(new Date(user.createdAt), "MMM dd, yyyy")}
					</span>
				</div>
				<div className="flex items-center justify-between py-2">
					<span className="text-muted-foreground text-sm">Last Updated</span>
					<span className="text-foreground text-sm font-medium">
						{format(new Date(user.updatedAt), "MMM dd, yyyy")}
					</span>
				</div>
			</div>
		</Card>
	);
}
