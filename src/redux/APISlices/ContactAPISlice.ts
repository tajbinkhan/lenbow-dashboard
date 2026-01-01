import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithCSRF } from "@/lib/rtk-base-query";

import { apiRoute } from "@/routes/routes";

export interface ConnectedContactList {
	userId: string;
	name: string | null;
	email: string;
	image: string | null;
	phone: string | null;
	connectedAt: Date;
}

export const contactApiSlice = createApi({
	reducerPath: "contactApiReducer",
	keepUnusedDataFor: 0,
	baseQuery: baseQueryWithCSRF,
	tagTypes: ["Contact"],
	endpoints: builder => ({
		getContactById: builder.query<ApiResponse<ConnectedContactList>, { contactId: string }>({
			query: ({ contactId }) => ({
				url: apiRoute.contact(contactId),
				method: "GET"
			}),
			providesTags: ["Contact"]
		}),

		connectedContactsList: builder.query<ApiResponse<ConnectedContactList[]>, void>({
			query: () => ({
				url: apiRoute.connectedContacts,
				method: "GET"
			}),
			providesTags: ["Contact"]
		})
	})
});

// Export hooks
export const { useGetContactByIdQuery, useLazyGetContactByIdQuery, useConnectedContactsListQuery } =
	contactApiSlice;

export const contactApiReducer = contactApiSlice.reducer;
