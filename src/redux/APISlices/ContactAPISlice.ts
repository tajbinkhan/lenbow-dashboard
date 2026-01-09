import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithCSRF } from "@/lib/rtk-base-query";

import { apiRoute } from "@/routes/routes";

export interface ConnectedContact {
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
		getContactById: builder.query<ApiResponse<ConnectedContact>, { contactId: string }>({
			query: ({ contactId }) => ({
				url: apiRoute.contact(contactId),
				method: "GET"
			}),
			providesTags: ["Contact"]
		}),

		connectedContacts: builder.query<ApiResponse<ConnectedContact[]>, void>({
			query: () => ({
				url: apiRoute.connectedContacts,
				method: "GET"
			}),
			providesTags: ["Contact"]
		}),

		connectedContactList: builder.query<ApiResponse<PeopleInterface[]>, Partial<ApiSearchParams>>({
			query: params => ({
				url: apiRoute.contacts,
				method: "GET",
				params
			}),
			providesTags: ["Contact"]
		})
	})
});

// Export hooks
export const {
	useGetContactByIdQuery,
	useLazyGetContactByIdQuery,
	useConnectedContactsQuery,
	useConnectedContactListQuery
} = contactApiSlice;

export const contactApiReducer = contactApiSlice.reducer;
