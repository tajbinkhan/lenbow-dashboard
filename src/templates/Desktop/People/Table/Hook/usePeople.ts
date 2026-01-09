"use client";

import { useContext } from "react";

import { PeopleContext } from "@/templates/Desktop/People/Table/Provider/PeopleProvider";

export const usePeople = () => {
	const context = useContext(PeopleContext);
	if (context === undefined) {
		throw new Error("usePeople must be used within an peopleContext");
	}
	return context;
};
