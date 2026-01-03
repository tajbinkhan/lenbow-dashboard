"use client";

import { useContext } from "react";

import { LendContext } from "@/templates/Desktop/Lend/Table/Provider/LendProvider";

export const useLend = () => {
	const context = useContext(LendContext);
	if (context === undefined) {
		throw new Error("useLend must be used within an lendContext");
	}
	return context;
};
