"use client";

import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";

import useAuth from "@/hooks/use-auth";
import { Link, useRouter } from "@/i18n/navigation";
import { navSupportingItem, userItems } from "@/layout/Desktop/Menu";

interface MobileNavDrawerProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function MobileNavDrawer({ isOpen, onOpenChange }: MobileNavDrawerProps) {
	const { user, handleLogout: authLogout } = useAuth();
	const router = useRouter();

	const onSignOut = async () => {
		await authLogout();
		router.push("/auth/login");
	};

	return (
		<Drawer open={isOpen} onOpenChange={onOpenChange}>
			<DrawerContent>
				<DrawerHeader className="pb-0 text-left">
					<DrawerTitle className="sr-only">Menu</DrawerTitle>
					<DrawerDescription className="sr-only">Navigation Menu</DrawerDescription>
					<div className="flex items-center gap-4 py-4">
						<Avatar className="border-primary/10 h-12 w-12 border-2">
							<AvatarImage src={user?.image || undefined} alt={user?.name || "User"} />
							<AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
								{user?.name?.slice(0, 2).toUpperCase() || "ME"}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<span className="text-lg font-bold">{user?.name}</span>
							<span className="text-muted-foreground text-sm">{user?.email}</span>
						</div>
					</div>
				</DrawerHeader>
				<div className="px-4 pb-2">
					<Separator />
				</div>

				<div className="max-h-[60vh] space-y-6 overflow-y-auto p-4 pt-2">
					{/* User Settings */}
					<div className="space-y-1">
						<h4 className="text-muted-foreground mb-2 pl-2 text-xs font-semibold tracking-wider uppercase">
							Account
						</h4>
						{userItems.map((item, index) => {
							if (!item) return null;
							return (
								<Link
									key={index}
									href={item.url}
									className="hover:bg-muted/50 flex items-center gap-3 rounded-xl px-3 py-3 transition-colors"
									onClick={() => onOpenChange(false)}
								>
									<item.icon className="text-foreground/70 h-5 w-5" />
									<span className="font-medium">{item.title}</span>
								</Link>
							);
						})}
					</div>

					{/* Supporting Items */}
					<div className="space-y-1">
						<h4 className="text-muted-foreground mb-2 pl-2 text-xs font-semibold tracking-wider uppercase">
							More
						</h4>
						{navSupportingItem.map((item, index) => {
							if (!item) return null;
							return (
								<Link
									key={index}
									href={item.url}
									className="hover:bg-muted/50 flex items-center gap-3 rounded-xl px-3 py-3 transition-colors"
									onClick={() => onOpenChange(false)}
								>
									<item.icon className="text-foreground/70 h-5 w-5" />
									<span className="font-medium">{item.title}</span>
								</Link>
							);
						})}
					</div>

					{/* Logout */}
					<div className="pt-2">
						<Button
							variant="destructive"
							className="h-12 w-full justify-start gap-3 rounded-xl"
							onClick={onSignOut}
						>
							<LogOut className="h-5 w-5" />
							Sign Out
						</Button>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
