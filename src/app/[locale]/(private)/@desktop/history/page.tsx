import { SetBreadcrumb } from "@/providers/BreadcrumbProvider";
import { route } from "@/routes/routes";
import HistoryTemplate from "@/templates/Desktop/History/HistoryTemplate";

export default function History() {
	return (
		<>
			<SetBreadcrumb
				items={[
					{ name: "Dashboard", href: route.private.dashboard },
					{ name: "History", isCurrent: true }
				]}
			/>
			<HistoryTemplate />
		</>
	);
}
