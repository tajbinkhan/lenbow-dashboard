"use client";

import { Edit2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { getUserInitials } from "@/core/helper";

interface ProfileHeaderProps {
	user: User;
	onEdit: () => void;
}

export default function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
	return (
		<Card className="p-6">
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-4">
					<Avatar className="h-16 w-16 self-baseline">
						<AvatarImage src={user.image || undefined} alt={user.name || user.email} />
						<AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
					</Avatar>
					<div className="space-y-2">
						<div>
							<h1 className="text-foreground text-2xl font-bold">{user.name}</h1>
							<p className="text-muted-foreground text-sm">{user.email}</p>
						</div>
						<div className="flex flex-col gap-4">
							{user.emailVerified && (
								<Badge variant="outline" className="w-fit">
									✓ Email Verified
								</Badge>
							)}
							<Button
								onClick={onEdit}
								variant="outline"
								size="sm"
								className="gap-2 bg-transparent md:hidden"
							>
								<Edit2 className="h-4 w-4" />
								Edit Profile
							</Button>
						</div>
					</div>
				</div>
				<Button
					onClick={onEdit}
					variant="outline"
					size="sm"
					className="hidden gap-2 bg-transparent md:flex"
				>
					<Edit2 className="h-4 w-4" />
					Edit Profile
				</Button>
			</div>
		</Card>
	);
}
