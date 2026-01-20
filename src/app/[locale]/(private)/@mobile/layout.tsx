import { MobileNavBar } from "@/layout/Mobile/MobileNavBar";
import UnifiedAuthProvider from "@/providers/UnifiedAuthProvider";

export default function MobileLayout({ children }: Readonly<GlobalLayoutProps>) {
	return (
		<UnifiedAuthProvider requireAuth>
			<div className="bg-muted/20 min-h-screen pb-20">{children}</div>
			<MobileNavBar />
		</UnifiedAuthProvider>
	);
}
