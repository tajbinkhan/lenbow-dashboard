"use client";

import { toast } from "sonner";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { route } from "@/routes/routes";
import { useLogoutMutation } from "@/templates/Authentication/Login/Redux/AuthenticationAPISlice";
import { logout as logoutAction } from "@/templates/Authentication/Login/Redux/AuthenticationSlice";

/**
 * Custom hook to access authentication state from Redux store
 * @returns Authentication state including user, isAuthenticated, isLoading, isLoggingOut, and handleLogout function
 */
export default function useAuth() {
	const { user, isAuthenticated, isLoading, isLoggingOut } = useAppSelector(
		state => state.authReducer
	);

	const dispatch = useAppDispatch();
	const router = useRouter();
	const pathname = usePathname();
	const [logoutMutation] = useLogoutMutation();

	const handleLogout = async () => {
		await logoutMutation()
			.unwrap()
			.then(() => {
				// Clear Redux state
				dispatch(logoutAction());
				toast.success("Logged out successfully!");
				// Redirect to login with current page as redirect URL
				const redirectUrl = `${route.protected.login}?redirect=${encodeURIComponent(process.env.NEXT_PUBLIC_FRONTEND_URL + pathname)}`;
				router.push(redirectUrl);
			})
			.catch(error => {
				toast.error(error?.data?.message || "Failed to logout. Please try again.");
			});
	};

	return {
		user,
		isAuthenticated,
		isLoading,
		isLoggingOut,
		handleLogout
	};
}
