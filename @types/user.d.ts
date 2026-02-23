interface User {
	id: string;
	name: string | null;
	email: string;
	password: string | null;
	emailVerified: boolean;
	image: string | null;
	is2faEnabled: boolean | null;
	currencyCode: string;
	phone: string | null;
	receiveTransactionEmails: boolean;
	createdAt: string;
	updatedAt: string;
}
