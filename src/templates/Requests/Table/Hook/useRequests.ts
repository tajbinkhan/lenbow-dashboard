"use client";

import { useContext } from "react";

import { RequestsContext } from "@/templates/Requests/Table/Provider/RequestsProvider";

export const useRequests = () => {
	const context = useContext(RequestsContext);
	if (context === undefined) {
		throw new Error("useRequests must be used within an requestsContext");
	}
	return context;
};
