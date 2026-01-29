import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithCSRF } from "@/lib/rtk-base-query";

import { apiRoute } from "@/routes/routes";

export const authenticationApiSlice = createApi({
	reducerPath: "authenticationApiReducer",
	keepUnusedDataFor: 0,
	baseQuery: baseQueryWithCSRF,
	tagTypes: ["User", "Me"],
	endpoints: builder => ({
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
		})
	})
});

// Export hooks
export const {
	useMeQuery,
	useLogoutMutation,
	useUpdateProfileMutation,
	useUpdateProfileImageMutation
} = authenticationApiSlice;

export const authenticationApiReducer = authenticationApiSlice.reducer;
