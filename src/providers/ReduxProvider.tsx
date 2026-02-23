"use client";

import { useState } from "react";
import { Provider } from "react-redux";

import { makeStore } from "@/redux/store";
import {
	setAuthCheckComplete,
	setUser
} from "@/templates/Authentication/Login/Redux/AuthenticationSlice";

interface ReduxProviderProps {
	children: React.ReactNode;
	user: User | null;
}

export default function ReduxProvider({ children, user }: ReduxProviderProps) {
	const [store] = useState(() => {
		// Create store
		const newStore = makeStore();

		// Initialize with server-fetched user data
		if (user) {
			newStore.dispatch(setUser(user));
		} else {
			// No user, just stop loading
			newStore.dispatch(setAuthCheckComplete());
		}

		return newStore;
	});

	return <Provider store={store}>{children}</Provider>;
}
