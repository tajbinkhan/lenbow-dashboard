import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "@/layout/Desktop/AppSidebar";
import { SiteHeader } from "@/layout/Desktop/SiteHeader";
import { BreadcrumbProvider } from "@/providers/BreadcrumbProvider";
import UnifiedAuthProvider from "@/providers/UnifiedAuthProvider";

export default function DashboardLayout({ children }: Readonly<GlobalLayoutProps>) {
	return (
		<UnifiedAuthProvider requireAuth>
			<BreadcrumbProvider>
				<SidebarProvider
					style={
						{
							"--sidebar-width": "calc(var(--spacing) * 72)",
							"--header-height": "calc(var(--spacing) * 12)"
						} as React.CSSProperties
					}
				>
					<AppSidebar variant="inset" />
					<SidebarInset>
						<SiteHeader />
						<div className="flex flex-1 flex-col">
							<div className="@container/main flex flex-1 flex-col gap-2">
								<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
									<div className="px-4 lg:px-6">{children}</div>
								</div>
							</div>
						</div>
					</SidebarInset>
				</SidebarProvider>
			</BreadcrumbProvider>
		</UnifiedAuthProvider>
	);
}
