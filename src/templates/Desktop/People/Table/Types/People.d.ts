interface PeopleApiSearchParams extends ApiSearchParams {}

interface PeopleInterface {
	id: string;
	userId: string;
	name: string | null;
	email: string;
	image: string | null;
	phone: string | null;
	connectedAt: string;
	createdAt: string;
	updatedAt: string;
}
