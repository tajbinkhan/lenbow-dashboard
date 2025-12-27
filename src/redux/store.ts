import { configureStore } from "@reduxjs/toolkit";

import { transactionApiReducer, transactionApiSlice } from "@/redux/APISlices/TransactionAPISlice";
import {
	authenticationApiReducer,
	authenticationApiSlice
} from "@/templates/Authentication/Login/Redux/AuthenticationAPISlice";
import { authReducer } from "@/templates/Authentication/Login/Redux/AuthenticationSlice";

export const makeStore = () => {
	return configureStore({
		reducer: {
			authReducer,
			authenticationApiReducer,
			transactionApiReducer
		},
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware({
				serializableCheck: false
			}).concat([authenticationApiSlice.middleware, transactionApiSlice.middleware])
	});
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
