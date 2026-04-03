"use client";

import { Download, Plus, Share2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";

import { usePwa } from "@/hooks/use-pwa";
import { cn } from "@/lib/utils";

interface PWAInstallButtonProps {
	className?: string;
	compact?: boolean;
}

export default function PWAInstallButton({
	className,
	compact = false
}: PWAInstallButtonProps) {
	const { canInstall, install, isInstalled, isIOSInstallable, isOffline } = usePwa();
	const [isHelpOpen, setIsHelpOpen] = useState(false);

	if (isInstalled || (!canInstall && !isIOSInstallable)) {
		return null;
	}

	const handleInstall = async () => {
		if (canInstall) {
			await install();
			return;
		}

		if (isIOSInstallable) {
			setIsHelpOpen(true);
		}
	};

	return (
		<>
			<Button
				type="button"
				variant={compact ? "ghost" : "outline"}
				size={compact ? "icon" : "sm"}
				onClick={handleInstall}
				aria-label="Install Lenbow"
				className={cn(
					compact
						? "text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
						: "gap-2",
					className
				)}
				title={isOffline ? "Install may require a connection" : "Install Lenbow"}
			>
				<Download className={compact ? "h-5 w-5" : "h-4 w-4"} />
				{!compact && <span>Install App</span>}
			</Button>

			<Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Install Lenbow on iPhone or iPad</DialogTitle>
						<DialogDescription>
							Safari on iOS does not show the standard install prompt, so you&apos;ll need to
							add Lenbow manually from the browser menu.
						</DialogDescription>
					</DialogHeader>

					<div className="bg-muted/40 space-y-3 rounded-xl border p-4 text-sm">
						<div className="flex items-start gap-3">
							<div className="bg-background rounded-full border p-2">
								<Share2 className="text-primary h-4 w-4" />
							</div>
							<p>Open Safari&apos;s Share menu.</p>
						</div>
						<div className="flex items-start gap-3">
							<div className="bg-background rounded-full border p-2">
								<Plus className="text-primary h-4 w-4" />
							</div>
							<p>Select &quot;Add to Home Screen&quot; and confirm the install.</p>
						</div>
					</div>

					<DialogFooter showCloseButton />
				</DialogContent>
			</Dialog>
		</>
	);
}
