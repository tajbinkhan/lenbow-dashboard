import ComingSoon from "@/components/helpers/coming-soon";

import { SetBreadcrumb } from "@/providers/BreadcrumbProvider";
import { route } from "@/routes/routes";

export default function Settings() {
	return (
		<>
			<SetBreadcrumb
				items={[
					{ name: "Dashboard", href: route.private.dashboard },
					{ name: "Settings", isCurrent: true }
				]}
			/>
			<ComingSoon />
		</>
	);
}
