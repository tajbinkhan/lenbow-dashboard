import { SetBreadcrumb } from "@/providers/BreadcrumbProvider";
import { route } from "@/routes/routes";
import RequestsTemplate from "@/templates/Requests/RequestsTemplate";

export default function Requests() {
	return (
		<>
			<SetBreadcrumb
				items={[
					{ name: "Dashboard", href: route.private.dashboard },
					{ name: "Requests", isCurrent: true }
				]}
			/>
			<RequestsTemplate />
		</>
	);
}
