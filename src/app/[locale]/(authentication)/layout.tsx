import ThemeToggle from "@/components/ui/theme-toggle";

export default function AuthenticationLayout({ children }: Readonly<GlobalLayoutProps>) {
	return (
		<div className="relative">
			{children}
			<div className="fixed right-6 bottom-6 flex items-center gap-4">
				<ThemeToggle />
			</div>
		</div>
	);
}
