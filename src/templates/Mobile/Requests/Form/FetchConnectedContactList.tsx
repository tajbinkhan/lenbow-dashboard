import { ChevronsUpDownIcon, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList
} from "@/components/ui/command";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

import {
	ConnectedContact,
	useConnectedContactsQuery,
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

	const { isLoading, data } = useConnectedContactsQuery();

	const [newContact, { isLoading: isContactLoading, data: contactData }] =
		useLazyGetContactByIdQuery();

	const users: ConnectedContact[] = useMemo(() => data?.data || [], [data?.data]);

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
			const uuidValidation = validateUUID("Account ID").safeParse(search);
			return !uuidValidation.success;
		}
		return false;
	}, [search, hasLocalMatch]);

	// Debounced search effect for fetching contact by ID
	useEffect(() => {
		if (search.length >= 3 && !hasLocalMatch) {
			// Validate if search is a valid UUID v4 before calling API
			const uuidValidation = validateUUID("Account ID").safeParse(search);

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
	const combinedUsers: ConnectedContact[] = searchedContact
		? [...users, searchedContact].filter(
				(user, index, self) => self.findIndex(u => u.userId === user.userId) === index
			)
		: users;

	const selectedUser = combinedUsers.find(user => user.userId === controlledValue);

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button
					id={id}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					aria-invalid={ariaInvalid}
					className="border-input/60 bg-background/50 h-12 w-full justify-between rounded-xl backdrop-blur-sm"
				>
					{selectedUser ? (
						<span className="flex items-center gap-3 truncate">
							<Avatar className="border-border size-6 shrink-0 border">
								<AvatarImage src={selectedUser.image || undefined} alt={selectedUser.name || ""} />
								<AvatarFallback className="text-[10px]">
									{selectedUser.name?.[0] || "U"}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col items-start overflow-hidden">
								<span className="truncate text-sm leading-none font-medium">
									{selectedUser.name || selectedUser.email}
								</span>
							</div>
						</span>
					) : (
						<span className="text-muted-foreground font-normal">Select contact or enter ID...</span>
					)}

					<ChevronsUpDownIcon
						className="text-muted-foreground ml-2 size-4 shrink-0"
						aria-hidden="true"
					/>
				</Button>
			</DrawerTrigger>

			<DrawerContent className="flex max-h-[85vh] flex-col">
				<DrawerHeader className="flex-none border-b pb-4">
					<DrawerTitle>Select Contact</DrawerTitle>
					<DrawerDescription>Search by name, email or paste an Account ID.</DrawerDescription>
				</DrawerHeader>

				<div className="flex flex-1 flex-col overflow-hidden">
					<div className="flex-none space-y-4 p-4">
						<div className="relative">
							<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
							<Input
								value={search}
								onChange={e => setSearch(e.target.value)}
								placeholder="Type to search..."
								className="bg-muted/40 border-border/60 h-11 pl-9"
							/>
						</div>
					</div>

					<Command className="flex-1 overflow-hidden" shouldFilter={false}>
						<CommandList className="h-full overflow-y-auto">
							<CommandEmpty className="text-muted-foreground flex flex-col items-center justify-center space-y-1 py-8 text-center text-sm">
								{isLoading || isContactLoading ? (
									<span>Searching...</span>
								) : (
									<>
										{search.length === 0 ? (
											<span>Type to search contacts</span>
										) : search.length < 3 ? (
											<span>Type at least 3 characters</span>
										) : isInvalidUUID ? (
											<div className="flex flex-col items-center gap-1">
												<span className="text-destructive font-medium">Invalid Account ID</span>
												<span className="text-muted-foreground max-w-[200px] text-xs leading-relaxed">
													The ID must be a valid UUID code. Check the format and try again.
												</span>
											</div>
										) : (
											<div className="flex flex-col items-center gap-1">
												<span className="text-foreground font-medium">No contacts found</span>
												<span className="text-muted-foreground text-xs">
													Try a different name or enter a valid Account ID to add them.
												</span>
											</div>
										)}
									</>
								)}
							</CommandEmpty>

							<CommandGroup heading="Suggestions">
								{combinedUsers
									.filter(user => {
										if (search.length < 3) return true; // Show all if search is short (or handle differently) - Actually CommandList handles display, we should filter based on search if manually controlled.
										// Since we set shouldFilter={false}, we MUST filter manually here to respect the search.
										const term = search.toLowerCase();
										return (
											user.userId.toLowerCase().includes(term) ||
											user.email.toLowerCase().includes(term) ||
											(user.name && user.name.toLowerCase().includes(term))
										);
									})
									.map(user => (
										<CommandItem
											key={user.userId}
											value={user.userId + "-" + (user.name || user.email)}
											onSelect={() => {
												onChange?.(user.userId);
												setSearch("");
												setOpen(false);
											}}
											className="data-[selected=true]:bg-accent flex cursor-pointer items-center gap-3 px-2 py-3"
										>
											<Avatar className="size-8 shrink-0">
												<AvatarImage src={user.image || undefined} alt={user.name || ""} />
												<AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
											</Avatar>
											<div className="flex min-w-0 flex-1 flex-col">
												<span className="truncate font-medium">{user.name || "Unknown"}</span>
												<span className="text-muted-foreground truncate text-xs">{user.email}</span>
											</div>
											{controlledValue === user.userId && (
												<div className="bg-primary h-2 w-2 rounded-full" />
											)}
										</CommandItem>
									))}
							</CommandGroup>
						</CommandList>
					</Command>
				</div>

				<DrawerFooter className="flex-none">
					<DrawerClose asChild>
						<Button variant="outline" className="w-full">
							Cancel
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
