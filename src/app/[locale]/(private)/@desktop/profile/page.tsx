import { SetBreadcrumb } from "@/providers/BreadcrumbProvider";
import { route } from "@/routes/routes";
import ProfileTemplate from "@/templates/Authentication/Profile/ProfileTemplate";

export default function Profile() {
	return (
		<>
			<SetBreadcrumb
				items={[
					{ name: "Dashboard", href: route.private.dashboard },
					{ name: "Profile", isCurrent: true }
				]}
			/>
			<ProfileTemplate />
		</>
	);
}
