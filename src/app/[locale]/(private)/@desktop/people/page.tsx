import { SetBreadcrumb } from "@/providers/BreadcrumbProvider";
import { route } from "@/routes/routes";
import PeopleTemplate from "@/templates/Desktop/People/PeopleTemplate";

export default function People() {
	return (
		<>
			<SetBreadcrumb
				items={[
					{ name: "Dashboard", href: route.private.dashboard },
					{ name: "People", isCurrent: true }
				]}
			/>
			<PeopleTemplate />
		</>
	);
}
