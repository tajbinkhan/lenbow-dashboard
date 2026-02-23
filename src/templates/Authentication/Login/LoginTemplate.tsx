"use client";

import { useState, useTransition } from "react";
import { FaGoogle, FaHandHoldingDollar, FaRocket } from "react-icons/fa6";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";

import { useLoginMutation } from "./Redux/AuthenticationAPISlice";
import { useRedirectUrl } from "@/hooks/use-redirect-url";
import { Link } from "@/i18n/navigation";
import { apiRoute, route } from "@/routes/routes";

const isDemoMode = process.env.NEXT_PUBLIC_APPLICATION_TYPE === "demo";

// Demo credentials for 5 users
const demoCredentials = [
	{ email: "demo1@example.com", name: "Demo User One" },
	{ email: "demo2@example.com", name: "Demo User Two" },
	{ email: "demo3@example.com", name: "Demo User Three" },
	{ email: "demo4@example.com", name: "Demo User Four" },
	{ email: "demo5@example.com", name: "Demo User Five" }
];

const demoPassword = "Demo123!";

export default function LoginTemplate() {
	const [isPending, startTransition] = useTransition();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const redirectUrl = useRedirectUrl();

	const [login, { isLoading: isLoggingIn }] = useLoginMutation();

	const googleOauthRedirectUrl = redirectUrl
		? redirectUrl
		: encodeURIComponent(process.env.NEXT_PUBLIC_FRONTEND_URL + route.private.dashboard);

	const handleGoogleLogin = () => {
		startTransition(() => {
			window.location.href = `${process.env.NEXT_PUBLIC_API_URL + apiRoute.googleLogin}?redirect=${googleOauthRedirectUrl}`;
		});
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await login({ email, password }).unwrap();
			toast.success(response.message || "Login successful!");

			// Redirect after successful login
			window.location.href = redirectUrl || route.private.dashboard;
		} catch (error: any) {
			toast.error(error?.data?.message || "Login failed. Please check your credentials.");
		}
	};

	const handleTryDemo = () => {
		// Randomly select one demo user
		const randomUser = demoCredentials[Math.floor(Math.random() * demoCredentials.length)];

		// Pre-fill the form
		setEmail(randomUser.email);
		setPassword(demoPassword);

		toast.info(`Try logging in as ${randomUser.name}!`);
	};

	return (
		<main className="from-background via-background to-muted/20 relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-br p-4">
			{/* Decorative background elements */}
			<div className="absolute inset-0 -z-10">
				<div className="bg-primary/5 absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-3xl" />
				<div className="bg-primary/5 absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-3xl" />
			</div>

			<div className="w-full max-w-md">
				{/* Demo Mode Notice */}
				{isDemoMode && (
					<div className="bg-primary/10 border-primary/20 text-primary mb-4 rounded-2xl border p-4 text-center backdrop-blur-sm">
						<p className="text-sm font-medium">🎭 Demo Mode Active</p>
						<p className="text-muted-foreground mt-1 text-xs">
							Want the real application?{" "}
							<Link
								href={process.env.NEXT_PUBLIC_REAL_APPLICATION_URL || "#"}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-primary font-semibold underline underline-offset-2"
							>
								Visit here
							</Link>
						</p>
					</div>
				)}

				{/* Card */}
				<div className="border-border/50 bg-background/80 hover:border-border space-y-8 rounded-3xl border p-10 shadow-2xl shadow-black/5 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-black/10">
					{/* Header */}
					<div className="flex flex-col items-center space-y-3 text-center">
						<div className="mb-4 flex items-center gap-3">
							<div className="from-primary/10 to-primary/5 ring-primary/10 flex size-10 items-center justify-center rounded-lg bg-linear-to-br ring-1">
								<FaHandHoldingDollar className="text-primary h-5 w-5" />
							</div>
							<span className="text-foreground text-2xl font-bold">Lenbow</span>
						</div>
						<h1 className="text-foreground text-4xl font-bold tracking-tight">Welcome back</h1>
						<p className="text-muted-foreground text-base font-medium">
							Sign in to your account to continue
						</p>
					</div>

					{isDemoMode ? (
						<>
							{/* Demo Login Form */}
							<form onSubmit={handleLogin} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="demo1@example.com"
										value={email}
										onChange={e => setEmail(e.target.value)}
										required
										className="h-11"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<Input
										id="password"
										type="password"
										placeholder="Enter password"
										value={password}
										onChange={e => setPassword(e.target.value)}
										required
										className="h-11"
									/>
								</div>

								<div className="space-y-3 pt-2">
									<LoadingButton
										type="submit"
										className="h-11 w-full font-semibold"
										size="lg"
										isLoading={isLoggingIn}
										loadingText="Signing in..."
									>
										Sign In
									</LoadingButton>

									<Button
										type="button"
										variant="outline"
										className="hover:bg-primary/5 hover:border-primary/30 group h-11 w-full gap-2 font-semibold transition-all duration-200"
										onClick={handleTryDemo}
									>
										<FaRocket className="group-hover:text-primary h-4 w-4 transition-colors" />
										Try with Random Demo User
									</Button>
								</div>

								<p className="text-muted-foreground text-center text-xs">
									Click &quot;Try Demo&quot; to fill credentials automatically
								</p>
							</form>
						</>
					) : (
						<>
							{/* Divider */}
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<span className="bg-border w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background text-muted-foreground px-3 font-medium">
										Continue with
									</span>
								</div>
							</div>

							{/* Google OAuth Button */}
							<div className="space-y-4">
								<LoadingButton
									type="button"
									className="group hover:shadow-primary/20 h-auto w-full gap-3 py-3.5 transition-all duration-200 hover:shadow-lg"
									size="lg"
									isLoading={isPending}
									loadingText="Redirecting..."
									onClick={handleGoogleLogin}
								>
									<FaGoogle className="h-5 w-5 transition-opacity duration-200 group-hover:opacity-80" />
									<span className="font-semibold">Continue with Google</span>
								</LoadingButton>
								<p className="text-muted-foreground text-center text-xs">
									Secure authentication powered by Google
								</p>
							</div>
						</>
					)}
				</div>

				{/* Footer */}
				<p className="text-muted-foreground mt-8 px-8 text-center text-xs leading-relaxed">
					By clicking continue, you agree to our{" "}
					<Link
						href="#"
						className="hover:text-primary decoration-muted-foreground/30 hover:decoration-primary/50 font-medium underline underline-offset-4 transition-colors"
						target="_blank"
					>
						Terms of Service
					</Link>{" "}
					and{" "}
					<Link
						href="#"
						className="hover:text-primary decoration-muted-foreground/30 hover:decoration-primary/50 font-medium underline underline-offset-4 transition-colors"
						target="_blank"
					>
						Privacy Policy
					</Link>
					.
				</p>
			</div>
		</main>
	);
}
