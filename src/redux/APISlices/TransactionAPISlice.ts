import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithCSRF } from "@/lib/rtk-base-query";

import { apiRoute } from "@/routes/routes";
import {
	CreateRequestsSchema,
	UpdatePendingRequestsSchema,
	ValidateUpdateStatusTransactionSchema
} from "@/templates/Desktop/Requests/Validation/Requests.schema";

export const transactionApiSlice = createApi({
	reducerPath: "transactionApiReducer",
	keepUnusedDataFor: 0,
	baseQuery: baseQueryWithCSRF,
	tagTypes: ["Transaction", "TransactionContacts", "TransactionContact"],
	endpoints: builder => ({
		transactionRequestsList: builder.query<
			ApiResponse<TransactionInterface[]>,
			Partial<ApiSearchParams>
		>({
			query: params => ({
				url: apiRoute.requestedTransactions,
				method: "GET",
				params
			}),
			providesTags: ["Transaction"]
		}),

		createTransactionRequest: builder.mutation<
			ApiResponse<TransactionInterface>,
			CreateRequestsSchema
		>({
			query: body => ({
				url: apiRoute.transactions,
				method: "POST",
				body
			}),
			invalidatesTags: ["Transaction"]
		}),

		getTransactionById: builder.query<ApiResponse<TransactionInterface>, { transactionId: string }>(
			{
				query: ({ transactionId }) => ({
					url: apiRoute.transaction(transactionId),
					method: "GET"
				}),
				providesTags: ["Transaction"]
			}
		),

		updateTransactionRequest: builder.mutation<
			ApiResponse<TransactionInterface>,
			{ transactionId: string; body: UpdatePendingRequestsSchema }
		>({
			query: ({ transactionId, body }) => ({
				url: apiRoute.updateTransactionRequest(transactionId),
				method: "PUT",
				body
			}),
			invalidatesTags: ["Transaction"]
		}),

		updateTransactionStatus: builder.mutation<
			ApiResponse<TransactionInterface>,
			{ transactionId: string; body: ValidateUpdateStatusTransactionSchema }
		>({
			query: ({ transactionId, body }) => ({
				url: apiRoute.updateTransactionStatus(transactionId),
				method: "PUT",
				body
			}),
			invalidatesTags: ["Transaction"]
		}),

		deleteTransactionRequest: builder.mutation<
			ApiResponse<string | null>,
			{ transactionIds: string[] }
		>({
			query: body => ({
				url: apiRoute.transactions,
				method: "DELETE",
				body
			}),
			invalidatesTags: ["Transaction"]
		}),

		transactionBorrowList: builder.query<ApiResponse<TransactionInterface[]>, void>({
			query: () => ({
				url: apiRoute.transactions,
				method: "GET",
				params: {
					type: "borrow",
					status: "accepted,partially_paid,requested_repay"
				}
			}),
			providesTags: ["Transaction"]
		}),

		transactionLendList: builder.query<ApiResponse<TransactionInterface[]>, void>({
			query: () => ({
				url: apiRoute.transactions,
				method: "GET",
				params: {
					type: "lend",
					status: "accepted,partially_paid,requested_repay"
				}
			}),
			providesTags: ["Transaction"]
		}),

		acceptRequestRepaymentTransaction: builder.mutation<
			ApiResponse<string | null>,
			{ transactionId: string }
		>({
			query: ({ transactionId }) => ({
				url: apiRoute.acceptRequestRepaymentTransaction(transactionId),
				method: "PUT"
			}),
			invalidatesTags: ["Transaction"]
		}),

		rejectRequestRepaymentTransaction: builder.mutation<
			ApiResponse<string | null>,
			{ transactionId: string }
		>({
			query: ({ transactionId }) => ({
				url: apiRoute.rejectRequestRepaymentTransaction(transactionId),
				method: "PUT"
			}),
			invalidatesTags: ["Transaction"]
		})
	})
});

// Export hooks
export const {
	useTransactionRequestsListQuery,
	useCreateTransactionRequestMutation,
	useGetTransactionByIdQuery,
	useLazyGetTransactionByIdQuery,
	useUpdateTransactionRequestMutation,
	useDeleteTransactionRequestMutation,
	useTransactionBorrowListQuery,
	useTransactionLendListQuery,
	useUpdateTransactionStatusMutation,
	useAcceptRequestRepaymentTransactionMutation,
	useRejectRequestRepaymentTransactionMutation
} = transactionApiSlice;

export const transactionApiReducer = transactionApiSlice.reducer;
