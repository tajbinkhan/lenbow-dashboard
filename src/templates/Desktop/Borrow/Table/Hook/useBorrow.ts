"use client";

import { useContext } from "react";

import { BorrowContext } from "@/templates/Desktop/Borrow/Table/Provider/BorrowProvider";

export const useBorrow = () => {
	const context = useContext(BorrowContext);
	if (context === undefined) {
		throw new Error("useBorrow must be used within an borrowContext");
	}
	return context;
};
