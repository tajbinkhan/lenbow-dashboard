import { SetBreadcrumb } from "@/providers/BreadcrumbProvider";
import { route } from "@/routes/routes";
import BorrowTemplate from "@/templates/Desktop/Borrow/BorrowTemplate";

export default function Borrow() {
	return (
		<>
			<SetBreadcrumb
				items={[
					{ name: "Dashboard", href: route.private.dashboard },
					{ name: "Borrow", isCurrent: true }
				]}
			/>
			<BorrowTemplate />
		</>
	);
}
