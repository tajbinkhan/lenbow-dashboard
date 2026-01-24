"use client";

import { useContext } from "react";

import { HistoryContext } from "@/templates/Desktop/History/Table/Provider/HistoryProvider";

export const useHistory = () => {
	const context = useContext(HistoryContext);
	if (context === undefined) {
		throw new Error("useHistory must be used within an historyContext");
	}
	return context;
};
