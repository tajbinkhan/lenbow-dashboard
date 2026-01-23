"use client";

import { useContext } from "react";

import { LendContext } from "@/templates/Mobile/Lend/Provider/LendProvider";

export const useLend = () => {
	const context = useContext(LendContext);
	if (context === undefined) {
		throw new Error("useLend must be used within a LendContext");
	}
	return context;
};
