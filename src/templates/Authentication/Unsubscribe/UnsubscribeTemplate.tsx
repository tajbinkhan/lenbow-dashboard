"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaCheckCircle, FaHandHolding, FaTimesCircle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";

import { Link } from "@/i18n/navigation";
import { route } from "@/routes/routes";
import { useUnsubscribeMutation } from "@/templates/Authentication/Login/Redux/AuthenticationAPISlice";

export default function UnsubscribeTemplate() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const [unsubscribe, { isLoading }] = useUnsubscribeMutation();
	const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
	const [message, setMessage] = useState("");

	const handleUnsubscribe = async () => {
		if (!token) {
			setStatus("error");
			setMessage("Invalid unsubscribe link. Please check your email and try again.");
			return;
		}

		try {
			const response = await unsubscribe(token).unwrap();
			setStatus("success");
			setMessage(
				response.data?.message || "You have been successfully unsubscribed from transaction emails."
			);
		} catch (error: any) {
			setStatus("error");
			setMessage(error?.data?.message || "Failed to unsubscribe. Please try again later.");
		}
	};

	return (
		<main className="from-background via-background to-muted/20 relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-br p-4">
			{/* Decorative background elements */}
			<div className="absolute inset-0 -z-10">
				<div className="bg-primary/5 absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-3xl" />
				<div className="bg-primary/5 absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full blur-3xl" />
			</div>

			<div className="w-full max-w-md">
				{/* Card */}
				<div className="border-border/50 bg-background/80 hover:border-border space-y-8 rounded-3xl border p-10 shadow-2xl shadow-black/5 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-black/10">
					{/* Header */}
					<div className="flex flex-col items-center space-y-3 text-center">
						<div className="mb-4 flex items-center gap-3">
							<div className="from-primary/10 to-primary/5 ring-primary/10 flex size-10 items-center justify-center rounded-lg bg-linear-to-br ring-1">
								<FaHandHolding className="text-primary h-5 w-5" />
							</div>
							<span className="text-foreground text-2xl font-bold">Lenbow</span>
						</div>
						<h1 className="text-foreground text-3xl font-bold tracking-tight">Email Preferences</h1>
						<p className="text-muted-foreground text-base font-medium">
							Manage your transaction email notifications
						</p>
					</div>

					{/* Content */}
					<div className="space-y-6">
						{status === "idle" && (
							<>
								<div className="bg-muted/50 space-y-2 rounded-lg p-4">
									<p className="text-foreground text-sm">
										You are about to unsubscribe from transaction email notifications. You will no
										longer receive emails about:
									</p>
									<ul className="text-muted-foreground ml-4 list-disc space-y-1 text-sm">
										<li>Loan requests and offers</li>
										<li>Transaction status updates</li>
										<li>Repayment notifications</li>
										<li>Request approvals and rejections</li>
									</ul>
								</div>

								<LoadingButton
									onClick={handleUnsubscribe}
									className="h-11 w-full font-semibold"
									size="lg"
									isLoading={isLoading}
									loadingText="Unsubscribing..."
									variant="destructive"
								>
									Unsubscribe from Emails
								</LoadingButton>

								<p className="text-muted-foreground text-center text-xs">
									You can always re-enable email notifications from your profile settings
								</p>
							</>
						)}

						{status === "success" && (
							<div className="space-y-6">
								<div className="flex flex-col items-center space-y-4 text-center">
									<div className="flex size-16 items-center justify-center rounded-full bg-green-500/10">
										<FaCheckCircle className="h-8 w-8 text-green-500" />
									</div>
									<div className="space-y-2">
										<h2 className="text-foreground text-xl font-semibold">
											Successfully Unsubscribed
										</h2>
										<p className="text-muted-foreground text-sm">{message}</p>
									</div>
								</div>

								<div className="bg-muted/50 rounded-lg p-4">
									<p className="text-foreground text-sm">
										To re-enable email notifications, log in to your account and update your
										preferences in the Profile Settings page.
									</p>
								</div>

								<Link href={route.protected.login} className="block">
									<Button className="h-11 w-full font-semibold" size="lg">
										Go to Login
									</Button>
								</Link>
							</div>
						)}

						{status === "error" && (
							<div className="space-y-6">
								<div className="flex flex-col items-center space-y-4 text-center">
									<div className="bg-destructive/10 flex size-16 items-center justify-center rounded-full">
										<FaTimesCircle className="text-destructive h-8 w-8" />
									</div>
									<div className="space-y-2">
										<h2 className="text-foreground text-xl font-semibold">Unsubscribe Failed</h2>
										<p className="text-muted-foreground text-sm">{message}</p>
									</div>
								</div>

								<div className="space-y-3">
									<LoadingButton
										onClick={handleUnsubscribe}
										className="h-11 w-full font-semibold"
										size="lg"
										isLoading={isLoading}
										loadingText="Retrying..."
										variant="destructive"
									>
										Try Again
									</LoadingButton>

									<Link href={route.protected.login} className="block">
										<Button className="h-11 w-full font-semibold" size="lg" variant="outline">
											Go to Login
										</Button>
									</Link>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<p className="text-muted-foreground mt-8 px-8 text-center text-xs leading-relaxed">
					Need help? Contact support at{" "}
					<a
						href="mailto:support@lenbow.app"
						className="hover:text-primary font-medium underline underline-offset-2"
					>
						support@lenbow.app
					</a>
				</p>
			</div>
		</main>
	);
}
