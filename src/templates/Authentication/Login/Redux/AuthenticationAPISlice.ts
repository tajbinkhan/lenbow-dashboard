import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithCSRF } from "@/lib/rtk-base-query";

import { apiRoute } from "@/routes/routes";

export const authenticationApiSlice = createApi({
	reducerPath: "authenticationApiReducer",
	keepUnusedDataFor: 0,
	baseQuery: baseQueryWithCSRF,
	tagTypes: ["User", "Me"],
	endpoints: builder => ({
		login: builder.mutation<ApiResponse<User>, { email: string; password: string }>({
			query: credentials => ({
				url: apiRoute.login,
				method: "POST",
				body: credentials
			}),
			invalidatesTags: ["Me"]
		}),

		me: builder.query<ApiResponse<User>, void>({
			query: () => apiRoute.me,
			providesTags: ["Me"]
		}),

		logout: builder.mutation<ApiResponse<null>, void>({
			query: () => ({
				url: apiRoute.logout,
				method: "POST"
			}),
			invalidatesTags: ["User", "Me"]
		}),

		updateProfile: builder.mutation<ApiResponse<User>, { name: string; avatar?: string }>({
			query: data => ({
				url: apiRoute.updateProfile,
				method: "PUT",
				body: data
			}),
			invalidatesTags: ["Me"]
		}),

		updateProfileImage: builder.mutation<ApiResponse<User>, FormData>({
			query: formData => ({
				url: apiRoute.updateProfileImage,
				method: "PUT",
				body: formData
			}),
			invalidatesTags: ["Me"]
		}),

		updateEmailPreferences: builder.mutation<
			ApiResponse<User>,
			{ receiveTransactionEmails: boolean }
		>({
			query: data => ({
				url: apiRoute.updateEmailPreferences,
				method: "PUT",
				body: data
			}),
			invalidatesTags: ["Me"]
		}),

		unsubscribe: builder.mutation<ApiResponse<{ message: string }>, string>({
			query: token => ({
				url: apiRoute.unsubscribe(token),
				method: "GET"
			})
		})
	})
});

// Export hooks
export const {
	useLoginMutation,
	useMeQuery,
	useLogoutMutation,
	useUpdateProfileMutation,
	useUpdateProfileImageMutation,
	useUpdateEmailPreferencesMutation,
	useUnsubscribeMutation
} = authenticationApiSlice;

export const authenticationApiReducer = authenticationApiSlice.reducer;
