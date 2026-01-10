import { SetBreadcrumb } from "@/providers/BreadcrumbProvider";
import { route } from "@/routes/routes";
import LendTemplate from "@/templates/Desktop/Lend/LendTemplate";

export default function Lend() {
	return (
		<>
			<SetBreadcrumb
				items={[
					{ name: "Dashboard", href: route.private.dashboard },
					{ name: "Lend", isCurrent: true }
				]}
			/>
			<LendTemplate />
		</>
	);
}
