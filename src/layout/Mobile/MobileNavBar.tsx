"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { MobileNavDrawer } from "./MobileNavDrawer";
import { Link, usePathname } from "@/i18n/navigation";
import { navItem } from "@/layout/Desktop/Menu";

export function MobileNavBar() {
	const pathname = usePathname();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	// We only show the first 4 items from the main nav
	// The 5th item will be the "Menu" trigger
	const mainNavItems = navItem.slice(0, 4);

	return (
		<>
			<nav className="bg-background/80 pb-safe fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur-xl">
				<div className="flex h-16 items-center justify-around px-2">
					{mainNavItems.map((item, index) => {
						const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);
						return (
							<Link
								key={index}
								href={item.url}
								className={cn(
									"flex h-full flex-1 flex-col items-center justify-center gap-1 transition-transform active:scale-95",
									isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
								)}
							>
								<div
									className={cn(
										"rounded-full p-1.5 transition-colors",
										isActive && "bg-primary/10"
									)}
								>
									<item.icon
										className={cn("h-5 w-5 transition-all", isActive && "fill-current")}
										strokeWidth={isActive ? 2.5 : 2}
									/>
								</div>
								<span className="text-[10px] font-medium">{item.title}</span>
							</Link>
						);
					})}

					{/* Menu Trigger */}
					<button
						onClick={() => setIsDrawerOpen(true)}
						className="text-muted-foreground hover:text-foreground flex h-full flex-1 flex-col items-center justify-center gap-1 transition-transform active:scale-95"
					>
						<div
							className={cn(
								"rounded-full p-1.5 transition-colors",
								isDrawerOpen && "bg-primary/10 text-primary"
							)}
						>
							<Menu className="h-5 w-5" strokeWidth={2} />
						</div>
						<span className="text-[10px] font-medium">Menu</span>
					</button>
				</div>
			</nav>

			<MobileNavDrawer isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
		</>
	);
}
