import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithCSRF } from "@/lib/rtk-base-query";

import { apiRoute } from "@/routes/routes";
import { PartialRepayBorrowSchema } from "@/templates/Desktop/Borrow/Validation/Borrow.schema";
import {
	CreateRequestsSchema,
	RejectRequestsSchema,
	UpdatePendingRequestsSchema
} from "@/templates/Desktop/Requests/Validation/Requests.schema";

export const transactionApiSlice = createApi({
	reducerPath: "transactionApiReducer",
	keepUnusedDataFor: 0,
	baseQuery: baseQueryWithCSRF,
	tagTypes: ["Transaction", "TransactionContacts", "TransactionContact"],
	endpoints: builder => ({
		transactionRequestsList: builder.query<
			ApiResponse<RequestsInterface[]>,
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
			ApiResponse<RequestsInterface>,
			CreateRequestsSchema
		>({
			query: body => ({
				url: apiRoute.transactions,
				method: "POST",
				body
			}),
			invalidatesTags: ["Transaction"]
		}),

		getTransactionById: builder.query<ApiResponse<RequestsInterface>, { transactionId: string }>({
			query: ({ transactionId }) => ({
				url: apiRoute.transaction(transactionId),
				method: "GET"
			}),
			providesTags: ["Transaction"]
		}),

		updatePendingTransactionRequest: builder.mutation<
			ApiResponse<RequestsInterface>,
			{ transactionId: string; body: UpdatePendingRequestsSchema }
		>({
			query: ({ transactionId, body }) => ({
				url: apiRoute.updatePendingTransactionRequest(transactionId),
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

		approveTransactionRequest: builder.mutation<
			ApiResponse<RequestsInterface>,
			{ transactionId: string }
		>({
			query: ({ transactionId }) => ({
				url: apiRoute.approveTransactionRequest(transactionId),
				method: "PUT"
			}),
			invalidatesTags: ["Transaction"]
		}),

		rejectTransactionRequest: builder.mutation<
			ApiResponse<RequestsInterface>,
			{ transactionId: string; body: RejectRequestsSchema }
		>({
			query: ({ transactionId, body }) => ({
				url: apiRoute.rejectTransactionRequest(transactionId),
				method: "PUT",
				body
			}),
			invalidatesTags: ["Transaction"]
		}),

		transactionBorrowList: builder.query<ApiResponse<RequestsInterface[]>, void>({
			query: () => ({
				url: apiRoute.transactions,
				method: "GET",
				params: {
					type: "borrow",
					status: "accepted,partially_paid"
				}
			}),
			providesTags: ["Transaction"]
		}),

		completeRepayTransactionBorrow: builder.mutation<
			ApiResponse<string | null>,
			{ transactionIds: string[] }
		>({
			query: body => ({
				url: apiRoute.completeRepayTransactionBorrow,
				method: "PUT",
				body
			}),
			invalidatesTags: ["Transaction"]
		}),

		partialRepayTransactionRequest: builder.mutation<
			ApiResponse<string | null>,
			{ transactionId: string; body: PartialRepayBorrowSchema }
		>({
			query: ({ transactionId, body }) => ({
				url: apiRoute.partialRepayTransactionRequest(transactionId),
				method: "PUT",
				body
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
	useUpdatePendingTransactionRequestMutation,
	useDeleteTransactionRequestMutation,
	useApproveTransactionRequestMutation,
	useRejectTransactionRequestMutation,
	useTransactionBorrowListQuery,
	useCompleteRepayTransactionBorrowMutation,
	usePartialRepayTransactionRequestMutation
} = transactionApiSlice;

export const transactionApiReducer = transactionApiSlice.reducer;
