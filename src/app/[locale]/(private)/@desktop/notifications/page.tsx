import ComingSoon from "@/components/helpers/coming-soon";

import { SetBreadcrumb } from "@/providers/BreadcrumbProvider";
import { route } from "@/routes/routes";

export default function Notification() {
	return (
		<>
			<SetBreadcrumb
				items={[
					{ name: "Dashboard", href: route.private.dashboard },
					{ name: "Notifications", isCurrent: true }
				]}
			/>
			<ComingSoon />
		</>
	);
}
