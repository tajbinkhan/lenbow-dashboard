import ComingSoon from "@/components/helpers/coming-soon";

import { SetBreadcrumb } from "@/providers/BreadcrumbProvider";
import { route } from "@/routes/routes";

export default function Profile() {
	return (
		<>
			<SetBreadcrumb
				items={[
					{ name: "Dashboard", href: route.private.dashboard },
					{ name: "Profile", isCurrent: true }
				]}
			/>
			<ComingSoon />
		</>
	);
}
