import DataColumns from "@/templates/Requests/Table/Components/DataColumns";
import { useRequests } from "@/templates/Requests/Table/Hook/useRequests";

export default function RequestsTable() {
	const { tableData } = useRequests();
	return <DataColumns data={tableData} />;
}
