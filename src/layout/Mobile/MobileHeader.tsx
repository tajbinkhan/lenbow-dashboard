"use client";

import { LogOut } from "lucide-react";
import { FaHandHoldingDollar } from "react-icons/fa6";

import PWAInstallButton from "@/components/pwa/PWAInstallButton";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/theme-toggle";

import useAuth from "@/hooks/use-auth";
import { Link } from "@/i18n/navigation";
import { route } from "@/routes/routes";

export default function MobileHeader() {
	const { handleLogout, isLoggingOut } = useAuth();

	return (
		<div className="from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden bg-linear-to-br px-4 pt-6 shadow-lg">
			<div className="relative mb-6 flex items-center justify-between">
				<Link
					href={route.private.dashboard}
					className="flex items-center gap-2 transition-opacity hover:opacity-80"
				>
					<div className="bg-primary-foreground/10 rounded-lg p-1.5 backdrop-blur-sm">
						<FaHandHoldingDollar className="text-primary-foreground size-5" />
					</div>
					<span className="text-lg font-bold tracking-tight">Lenbow</span>
				</Link>
				<div className="flex items-center gap-2">
					<PWAInstallButton compact />
					<ThemeToggle variant="colored" />
					<Button
						variant="ghost"
						size="icon"
						onClick={handleLogout}
						disabled={isLoggingOut}
						className="text-primary-foreground hover:bg-primary-foreground/20 transition-colors duration-200 disabled:opacity-50"
					>
						<LogOut className="h-5 w-5" />
					</Button>
				</div>
			</div>

			{/* <div className="relative flex items-center gap-3">
				<div className="relative w-fit">
					<Avatar size="sm" className="ring-primary-foreground/20 shadow-lg ring-2">
						<AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
						<AvatarFallback className="bg-primary-foreground text-primary text-sm font-bold">
							{getUserInitials(user?.name || null)}
						</AvatarFallback>
					</Avatar>
					<div className="ring-primary absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-emerald-500 shadow-sm ring-2" />
				</div>
				<div className="min-w-0 flex-1">
					<h1 className="truncate text-lg font-bold tracking-tight">{user?.name || "User"}</h1>
					<p className="text-primary-foreground/80 truncate text-xs font-medium">{user?.email}</p>
				</div>
			</div> */}
		</div>
	);
}
