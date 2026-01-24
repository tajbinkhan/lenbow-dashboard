import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithCSRF } from "@/lib/rtk-base-query";

import { apiRoute } from "@/routes/routes";

export const transactionHistoryApiSlice = createApi({
	reducerPath: "transactionHistoryApiReducer",
	keepUnusedDataFor: 60, // Cache for 60 seconds
	baseQuery: baseQueryWithCSRF,
	tagTypes: ["TransactionHistory"],
	endpoints: builder => ({
		getTransactionHistory: builder.query<
			ApiResponse<TransactionHistoryInterface[]>,
			Partial<HistoryApiSearchParams>
		>({
			query: params => ({
				url: apiRoute.transactionHistory,
				method: "GET",
				params
			}),
			providesTags: ["TransactionHistory"]
		})
	})
});

export const { useGetTransactionHistoryQuery, useLazyGetTransactionHistoryQuery } =
	transactionHistoryApiSlice;

export const transactionHistoryApiReducer = transactionHistoryApiSlice.reducer;
