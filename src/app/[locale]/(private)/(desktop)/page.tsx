import { SectionCards } from "@/layout/section-cards";
import { SetBreadcrumb } from "@/providers/BreadcrumbProvider";

export default function Dashboard() {
	return (
		<>
			<SetBreadcrumb items={[{ name: "Dashboard", isCurrent: true }]} />
			<SectionCards />
		</>
	);
}
