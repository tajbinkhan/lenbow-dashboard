import { RefreshCcw, WifiOff } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Link } from "@/i18n/navigation";
import { route } from "@/routes/routes";

export default function OfflinePage() {
	return (
		<main className="from-background via-background to-muted/30 flex min-h-screen items-center justify-center bg-linear-to-br px-4 py-12">
			<div className="bg-background/90 w-full max-w-xl rounded-3xl border p-8 shadow-2xl backdrop-blur-sm">
				<div className="bg-primary/10 text-primary mb-6 flex h-14 w-14 items-center justify-center rounded-2xl">
					<WifiOff className="h-7 w-7" />
				</div>

				<div className="space-y-3">
					<h1 className="text-foreground text-3xl font-bold tracking-tight">
						You&apos;re offline right now
					</h1>
					<p className="text-muted-foreground text-base leading-7">
						Lenbow&apos;s cached interface is still available, but live account, request, and
						transaction data need an internet connection before they can refresh.
					</p>
				</div>

				<div className="bg-muted/40 text-muted-foreground mt-6 rounded-2xl border p-4 text-sm leading-6">
					Try reconnecting, then return to your dashboard or reload the page to pull the
					latest data.
				</div>

				<div className="mt-8 flex flex-wrap gap-3">
					<Button asChild>
						<Link href={route.private.dashboard}>Back to Dashboard</Link>
					</Button>
					<Button asChild variant="outline">
						<Link href={route.protected.login}>
							<RefreshCcw className="h-4 w-4" />
							<span>Open Login</span>
						</Link>
					</Button>
				</div>
			</div>
		</main>
	);
}
