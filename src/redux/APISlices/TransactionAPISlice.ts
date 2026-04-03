import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithCSRF } from "@/lib/rtk-base-query";

import { apiRoute } from "@/routes/routes";
import {
	CreateRequestsSchema,
	UpdatePendingRequestsSchema,
	ValidateUpdateStatusTransactionSchema
} from "@/templates/Desktop/Requests/Validation/Requests.schema";

type TransactionListResponse = ApiResponse<TransactionInterface[]>;
type OptimisticPatch = { undo: () => void };

const ACTIVE_LOAN_STATUSES: TransactionStatusType[] = [
	"accepted",
	"partially_paid",
	"requested_repay"
];

const findTransactionIndex = (
	transactions: TransactionInterface[] | undefined,
	transactionId: string
) => {
	if (!transactions) return -1;

	return transactions.findIndex(
		transaction => transaction.id === transactionId || transaction.publicId === transactionId
	);
};

const updateTransactionInDraft = (
	draft: TransactionListResponse,
	transactionId: string,
	updater: (transaction: TransactionInterface) => void
) => {
	if (!draft.data) return false;

	const index = findTransactionIndex(draft.data, transactionId);
	if (index === -1) return false;

	updater(draft.data[index]);
	return true;
};

const removeTransactionFromDraft = (draft: TransactionListResponse, transactionId: string) => {
	if (!draft.data) return false;

	const previousLength = draft.data.length;
	draft.data = draft.data.filter(
		transaction => transaction.id !== transactionId && transaction.publicId !== transactionId
	);

	const removedCount = previousLength - draft.data.length;
	if (removedCount > 0 && draft.pagination?.totalItems !== undefined) {
		draft.pagination.totalItems = Math.max(0, draft.pagination.totalItems - removedCount);
	}

	return removedCount > 0;
};

function patchBorrowAndLendCaches(
	dispatch: any,
	getState: () => any,
	updater: (draft: TransactionListResponse) => void
) {
	const patches: OptimisticPatch[] = [];
	const state = getState();

	for (const args of transactionApiSlice.util.selectCachedArgsForQuery(
		state,
		"transactionBorrowList"
	)) {
		patches.push(
			dispatch(
				transactionApiSlice.util.updateQueryData("transactionBorrowList", args, draft => {
					updater(draft as TransactionListResponse);
				})
			)
		);
	}

	for (const args of transactionApiSlice.util.selectCachedArgsForQuery(
		state,
		"transactionLendList"
	)) {
		patches.push(
			dispatch(
				transactionApiSlice.util.updateQueryData("transactionLendList", args, draft => {
					updater(draft as TransactionListResponse);
				})
			)
		);
	}

	return patches;
}

function patchRequestCaches(
	dispatch: any,
	getState: () => any,
	updater: (draft: TransactionListResponse) => void
) {
	const patches: OptimisticPatch[] = [];
	const state = getState();

	for (const args of transactionApiSlice.util.selectCachedArgsForQuery(
		state,
		"transactionRequestsList"
	)) {
		patches.push(
			dispatch(
				transactionApiSlice.util.updateQueryData("transactionRequestsList", args, draft => {
					updater(draft as TransactionListResponse);
				})
			)
		);
	}

	return patches;
}

const undoOptimisticPatches = (patches: OptimisticPatch[]) => {
	for (const patch of patches.reverse()) {
		patch.undo();
	}
};

export const transactionApiSlice = createApi({
	reducerPath: "transactionApiReducer",
	baseQuery: baseQueryWithCSRF,
	tagTypes: ["Transaction"],
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
			onQueryStarted: async ({ transactionId, body }, { dispatch, getState, queryFulfilled }) => {
				const optimisticPatches = patchRequestCaches(dispatch, getState, draft => {
					updateTransactionInDraft(draft, transactionId, transaction => {
						transaction.amount = Number(body.amount);
						transaction.dueDate = body.dueDate ? new Date(body.dueDate).toISOString() : null;
						transaction.updatedAt = new Date().toISOString();
					});
				});

				try {
					await queryFulfilled;
				} catch {
					undoOptimisticPatches(optimisticPatches);
				}
			},
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
			onQueryStarted: async ({ transactionId, body }, { dispatch, getState, queryFulfilled }) => {
				const optimisticPatches: OptimisticPatch[] = [];
				const now = new Date().toISOString();

				switch (body.status) {
					case "requested_repay": {
						optimisticPatches.push(
							...patchBorrowAndLendCaches(dispatch, getState, draft => {
								updateTransactionInDraft(draft, transactionId, transaction => {
									transaction.status = "requested_repay";
									if ("reviewAmount" in body) {
										transaction.reviewAmount = Number(body.reviewAmount);
									}
								});
							})
						);
						break;
					}

					case "accepted": {
						optimisticPatches.push(
							...patchRequestCaches(dispatch, getState, draft => {
								removeTransactionFromDraft(draft, transactionId);
							})
						);

						optimisticPatches.push(
							...patchBorrowAndLendCaches(dispatch, getState, draft => {
								updateTransactionInDraft(draft, transactionId, transaction => {
									transaction.status = "accepted";
									transaction.acceptedAt = now;
									transaction.rejectedAt = null;
								});
							})
						);
						break;
					}

					case "rejected": {
						optimisticPatches.push(
							...patchRequestCaches(dispatch, getState, draft => {
								removeTransactionFromDraft(draft, transactionId);
							})
						);

						optimisticPatches.push(
							...patchBorrowAndLendCaches(dispatch, getState, draft => {
								removeTransactionFromDraft(draft, transactionId);
							})
						);
						break;
					}

					case "completed": {
						optimisticPatches.push(
							...patchBorrowAndLendCaches(dispatch, getState, draft => {
								removeTransactionFromDraft(draft, transactionId);
							})
						);
						break;
					}

					case "partially_paid": {
						optimisticPatches.push(
							...patchBorrowAndLendCaches(dispatch, getState, draft => {
								updateTransactionInDraft(draft, transactionId, transaction => {
									transaction.status = "partially_paid";
									transaction.reviewAmount = 0;
								});
							})
						);
						break;
					}
				}

				try {
					await queryFulfilled;
				} catch {
					undoOptimisticPatches(optimisticPatches);
				}
			},
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
			onQueryStarted: async ({ transactionIds }, { dispatch, getState, queryFulfilled }) => {
				const optimisticPatches = patchRequestCaches(dispatch, getState, draft => {
					for (const transactionId of transactionIds) {
						removeTransactionFromDraft(draft, transactionId);
					}
				});

				try {
					await queryFulfilled;
				} catch {
					undoOptimisticPatches(optimisticPatches);
				}
			},
			invalidatesTags: ["Transaction"]
		}),

		transactionBorrowList: builder.query<
			ApiResponse<TransactionInterface[]>,
			Partial<ApiSearchParams>
		>({
			query: params => ({
				url: apiRoute.transactions,
				method: "GET",
				params: {
					...params,
					type: "borrow",
					status: "accepted,partially_paid,requested_repay"
				}
			}),
			providesTags: ["Transaction"]
		}),

		transactionLendList: builder.query<
			ApiResponse<TransactionInterface[]>,
			Partial<ApiSearchParams>
		>({
			query: params => ({
				url: apiRoute.transactions,
				method: "GET",
				params: {
					...params,
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
			onQueryStarted: async ({ transactionId }, { dispatch, getState, queryFulfilled }) => {
				const now = new Date().toISOString();

				const optimisticPatches = patchBorrowAndLendCaches(dispatch, getState, draft => {
					if (!draft.data) return;

					const index = findTransactionIndex(draft.data, transactionId);
					if (index === -1) return;

					const transaction = draft.data[index];
					const reviewAmount = Number(transaction.reviewAmount || 0);
					const remainingAmount = Number(transaction.remainingAmount || 0);
					const nextRemainingAmount = Math.max(0, remainingAmount - reviewAmount);

					if (nextRemainingAmount <= 0) {
						removeTransactionFromDraft(draft, transactionId);
						return;
					}

					transaction.amountPaid = Number(transaction.amountPaid || 0) + reviewAmount;
					transaction.remainingAmount = nextRemainingAmount;
					transaction.reviewAmount = 0;
					transaction.status = "partially_paid";
					transaction.completedAt = null;
					transaction.updatedAt = now;
				});

				try {
					await queryFulfilled;
				} catch {
					undoOptimisticPatches(optimisticPatches);
				}
			},
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
			onQueryStarted: async ({ transactionId }, { dispatch, getState, queryFulfilled }) => {
				const now = new Date().toISOString();

				const optimisticPatches = patchBorrowAndLendCaches(dispatch, getState, draft => {
					updateTransactionInDraft(draft, transactionId, transaction => {
						transaction.status =
							Number(transaction.remainingAmount) === Number(transaction.amount)
								? "accepted"
								: "partially_paid";
						transaction.reviewAmount = 0;
						transaction.updatedAt = now;
					});
				});

				try {
					await queryFulfilled;
				} catch {
					undoOptimisticPatches(optimisticPatches);
				}
			},
			invalidatesTags: ["Transaction"]
		}),

		lenderRepaymentTransaction: builder.mutation<
			ApiResponse<TransactionInterface>,
			{ transactionId: string; body: { amount: number } }
		>({
			query: ({ transactionId, body }) => ({
				url: apiRoute.lenderRepaymentTransaction(transactionId),
				method: "PUT",
				body
			}),
			onQueryStarted: async ({ transactionId, body }, { dispatch, getState, queryFulfilled }) => {
				const now = new Date().toISOString();

				const optimisticPatches = patchBorrowAndLendCaches(dispatch, getState, draft => {
					if (!draft.data) return;

					const index = findTransactionIndex(draft.data, transactionId);
					if (index === -1) return;

					const transaction = draft.data[index];
					if (!ACTIVE_LOAN_STATUSES.includes(transaction.status)) return;

					const settledAmount = Math.min(
						Number(body.amount || 0),
						Number(transaction.remainingAmount || 0)
					);

					if (settledAmount <= 0) return;

					const nextRemainingAmount = Math.max(
						0,
						Number(transaction.remainingAmount || 0) - settledAmount
					);

					if (nextRemainingAmount <= 0) {
						removeTransactionFromDraft(draft, transactionId);
						return;
					}

					transaction.amountPaid = Number(transaction.amountPaid || 0) + settledAmount;
					transaction.remainingAmount = nextRemainingAmount;
					transaction.reviewAmount = 0;
					transaction.status = "partially_paid";
					transaction.updatedAt = now;
				});

				try {
					await queryFulfilled;
				} catch {
					undoOptimisticPatches(optimisticPatches);
				}
			},
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
	useRejectRequestRepaymentTransactionMutation,
	useLenderRepaymentTransactionMutation
} = transactionApiSlice;

export const transactionApiReducer = transactionApiSlice.reducer;
