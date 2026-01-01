import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
	ConnectedContactList,
	useConnectedContactsListQuery,
	useLazyGetContactByIdQuery
} from "@/redux/APISlices/ContactAPISlice";
import { validateUUID } from "@/validators/commonRule";

interface FetchConnectedContactListProps {
	value?: string;
	onChange?: (value: string) => void;
	"aria-invalid"?: boolean;
	id?: string;
}

export default function FetchConnectedContactList({
	value: controlledValue = "",
	onChange,
	"aria-invalid": ariaInvalid,
	id
}: FetchConnectedContactListProps) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const { isLoading, data } = useConnectedContactsListQuery();

	const [newContact, { isLoading: isContactLoading, data: contactData }] =
		useLazyGetContactByIdQuery();

	const users: ConnectedContactList[] = useMemo(() => data?.data || [], [data?.data]);

	// Check if search has local matches
	const hasLocalMatch = useMemo(
		() =>
			search.length >= 3 &&
			users.some(
				user =>
					user.userId.toLowerCase().includes(search.toLowerCase()) ||
					user.email.toLowerCase().includes(search.toLowerCase()) ||
					(user.name && user.name.toLowerCase().includes(search.toLowerCase()))
			),
		[search, users]
	);

	// Check if search is invalid UUID (only when no local match and search >= 3 chars)
	const isInvalidUUID = useMemo(() => {
		if (search.length >= 3 && !hasLocalMatch) {
			const uuidValidation = validateUUID("User ID").safeParse(search);
			return !uuidValidation.success;
		}
		return false;
	}, [search, hasLocalMatch]);

	// Debounced search effect for fetching contact by ID
	useEffect(() => {
		if (search.length >= 3 && !hasLocalMatch) {
			// Validate if search is a valid UUID v4 before calling API
			const uuidValidation = validateUUID("User ID").safeParse(search);

			if (uuidValidation.success) {
				const timer = setTimeout(() => {
					newContact({ contactId: search });
				}, 500);

				return () => clearTimeout(timer);
			}
		}
	}, [search, newContact, hasLocalMatch]);

	// Combine connected contacts with searched contact if found
	const searchedContact = contactData?.data;
	const combinedUsers: ConnectedContactList[] = searchedContact
		? [...users, searchedContact].filter(
				(user, index, self) => self.findIndex(u => u.userId === user.userId) === index
			)
		: users;

	const selectedUser = combinedUsers.find(user => user.userId === controlledValue);

	return (
		<Popover open={open} onOpenChange={setOpen} modal={false}>
			<PopoverTrigger asChild>
				<Button
					id={id}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					aria-invalid={ariaInvalid}
					className="w-full justify-between"
				>
					{selectedUser ? (
						<span className="flex items-center gap-2 truncate">
							<Avatar className="size-6 shrink-0">
								<AvatarImage src={selectedUser.image || undefined} alt={selectedUser.name || ""} />
								<AvatarFallback>{selectedUser.name?.[0] || "U"}</AvatarFallback>
							</Avatar>
							<span className="truncate font-medium">
								{selectedUser.name || selectedUser.email}
							</span>
						</span>
					) : (
						<span className="text-muted-foreground font-normal">
							Select a contact or enter user id
						</span>
					)}

					<ChevronsUpDownIcon
						className="text-muted-foreground ml-2 size-4 shrink-0"
						aria-hidden="true"
					/>
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-[320px] p-0">
				<Command>
					<CommandInput
						placeholder="Search by name, email or id..."
						value={search}
						onValueChange={setSearch}
					/>

					{/* Scroll container */}
					<ScrollArea className="max-h-60 rounded-md" onWheelCapture={e => e.stopPropagation()}>
						<CommandList className="max-h-none">
							<CommandEmpty>
								{isLoading || isContactLoading
									? "Loading contacts..."
									: isInvalidUUID
										? "Invalid account ID format. Please enter a valid UUID."
										: search.length >= 3
											? "No contact found with this ID."
											: "Type at least 3 characters to search for a contact."}
							</CommandEmpty>

							<CommandGroup>
								{combinedUsers.map(user => (
									<CommandItem
										key={user.userId}
										value={user.userId}
										keywords={[user.name || "", user.email, user.userId]}
										onSelect={currentValue => {
											const newValue = currentValue === controlledValue ? "" : currentValue;
											onChange?.(newValue);
											setOpen(false);
										}}
										className="flex w-full items-center gap-2 pr-3"
									>
										{/* Left content */}
										<span className="flex min-w-0 flex-1 items-center gap-2">
											<Avatar className="size-7 shrink-0">
												<AvatarImage src={user.image || undefined} alt={user.name || ""} />
												<AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
											</Avatar>

											<span className="flex min-w-0 flex-col">
												<span className="truncate font-medium">{user.name || user.email}</span>
												<span className="text-muted-foreground truncate text-sm">{user.email}</span>
											</span>
										</span>

										{/* Reserved icon space */}
										<span className="ml-auto grid w-0.5 shrink-0 place-items-center">
											{controlledValue === user.userId && (
												<CheckIcon className="text-foreground size-4" />
											)}
										</span>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</ScrollArea>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
