"use client";

import { Badge } from "@/components/ui/badge";

interface LoanDetailsContentProps {
	data: TransactionInterface | TransactionHistoryInterface;
}

const formatLabel = (value: string) => {
	return value
		.split("_")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

const formatDateValue = (value: Date | string | null | undefined) => {
	if (!value) {
		return null;
	}

	const parsedDate = value instanceof Date ? value : new Date(value);

	if (Number.isNaN(parsedDate.getTime())) {
		return null;
	}

	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit"
	}).format(parsedDate);
};

const formatAmount = (amount: number, symbol: string) => {
	const formattedValue = new Intl.NumberFormat("en-US", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	}).format(amount);

	return `${symbol}${formattedValue}`;
};

const getStatusClassName = (status: TransactionStatusType) => {
	switch (status) {
		case "completed":
			return "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300";
		case "rejected":
			return "border-red-300 bg-red-100 text-red-800 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-300";
		case "partially_paid":
			return "border-cyan-300 bg-cyan-100 text-cyan-800 dark:border-cyan-500/30 dark:bg-cyan-500/15 dark:text-cyan-300";
		case "requested_repay":
			return "border-orange-300 bg-orange-100 text-orange-800 dark:border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-300";
		case "accepted":
			return "border-blue-300 bg-blue-100 text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-300";
		default:
			return "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300";
	}
};

const SummaryTile = ({
	label,
	value,
	accentClass
}: {
	label: string;
	value: string;
	accentClass: string;
}) => (
	<div className={`rounded-xl border p-3 ${accentClass}`}>
		<p className="text-xs text-slate-600 dark:text-slate-400">{label}</p>
		<p className="text-base font-semibold text-slate-900 dark:text-slate-100">{value}</p>
	</div>
);

const PartyCard = ({
	label,
	name,
	email,
	accentClass
}: {
	label: string;
	name: string | null;
	email: string;
	accentClass: string;
}) => (
	<div className={`rounded-xl border p-3 ${accentClass}`}>
		<p className="text-xs text-slate-600 dark:text-slate-400">{label}</p>
		<p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{name || "Unknown"}</p>
		<p className="text-xs wrap-break-word text-slate-600 dark:text-slate-400">{email}</p>
	</div>
);

const TimelineItem = ({ label, value }: { label: string; value: string }) => (
	<div className="flex items-start justify-between gap-3 border-b py-2 last:border-b-0">
		<div className="flex items-center gap-2">
			<span className="h-2 w-2 rounded-full bg-cyan-400/80" />
			<p className="text-xs text-slate-600 dark:text-slate-400">{label}</p>
		</div>
		<p className="text-right text-sm font-medium text-slate-900 dark:text-slate-100">{value}</p>
	</div>
);

export function LoanDetailsContent({ data }: LoanDetailsContentProps) {
	const statusLabel = formatLabel(data.status);
	const typeLabel = formatLabel(data.type);
	const amount = formatAmount(data.amount, data.currency.symbol);
	const amountPaid = formatAmount(data.amountPaid, data.currency.symbol);
	const remainingAmount = formatAmount(data.remainingAmount, data.currency.symbol);
	const reviewAmount = formatAmount(data.reviewAmount, data.currency.symbol);
	const summaryItems = [
		{
			label: "Loan Amount",
			value: amount,
			accentClass:
				"border-emerald-300 bg-emerald-100/50 dark:border-emerald-500/20 dark:bg-emerald-500/5"
		},
		{
			label: "Paid",
			value: amountPaid,
			accentClass: "border-sky-300 bg-sky-100/50 dark:border-sky-500/20 dark:bg-sky-500/5"
		},
		{
			label: "Remaining",
			value: remainingAmount,
			accentClass: "border-amber-300 bg-amber-100/50 dark:border-amber-500/20 dark:bg-amber-500/5"
		},
		...(data.reviewAmount > 0
			? [
					{
						label: "Under Review",
						value: reviewAmount,
						accentClass:
							"border-orange-300 bg-orange-100/50 dark:border-orange-500/20 dark:bg-orange-500/5"
					}
				]
			: [])
	];

	const requestDate = formatDateValue(data.requestDate);
	const dueDate = formatDateValue(data.dueDate);
	const acceptedAt = formatDateValue(data.acceptedAt);
	const completedAt = formatDateValue(data.completedAt);
	const rejectedAt = formatDateValue(data.rejectedAt);

	const timelineItems = [
		requestDate ? { label: "Requested", value: requestDate } : null,
		dueDate ? { label: "Due", value: dueDate } : null,
		acceptedAt ? { label: "Accepted", value: acceptedAt } : null,
		completedAt ? { label: "Completed", value: completedAt } : null,
		rejectedAt ? { label: "Rejected", value: rejectedAt } : null
	].filter((item): item is { label: string; value: string } => Boolean(item));

	const hasDescription = Boolean(data.description?.trim());
	const hasRejectionReason = Boolean(data.rejectionReason?.trim());
	const historyAction = "action" in data ? formatLabel(data.action) : null;

	return (
		<div className="space-y-5 px-4 pb-2 text-slate-900 md:px-1 dark:text-slate-100">
			<section className="dark:via-background dark:to-background rounded-2xl border border-sky-200 bg-linear-to-br from-sky-50 via-white to-white p-4 dark:border-blue-500/20 dark:from-blue-500/10">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div>
						<p className="text-xs tracking-wide text-slate-600 uppercase dark:text-slate-400">
							Loan Summary
						</p>
						<p className="mt-1 text-2xl leading-tight font-semibold">{amount}</p>
						<p className="text-xs text-sky-700 dark:text-sky-300">{data.currency.code}</p>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="secondary" className={getStatusClassName(data.status)}>
							{statusLabel}
						</Badge>
						<Badge
							variant="outline"
							className="border-sky-300 bg-sky-100 text-sky-800 dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-200"
						>
							{typeLabel}
						</Badge>
						{historyAction && (
							<Badge
								variant="outline"
								className="border-indigo-300 bg-indigo-100 text-indigo-800 dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-200"
							>
								{historyAction}
							</Badge>
						)}
					</div>
				</div>
				<div
					className={`mt-4 grid gap-3 sm:grid-cols-2 ${summaryItems.length > 3 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
				>
					{summaryItems.map(item => (
						<SummaryTile
							key={item.label}
							label={item.label}
							value={item.value}
							accentClass={item.accentClass}
						/>
					))}
				</div>
			</section>

			<section className="grid gap-3 sm:grid-cols-2">
				<PartyCard
					label="Borrower"
					name={data.borrower.name}
					email={data.borrower.email}
					accentClass="border-cyan-300 bg-cyan-100/50 dark:border-cyan-500/20 dark:bg-cyan-500/5"
				/>
				<PartyCard
					label="Lender"
					name={data.lender.name}
					email={data.lender.email}
					accentClass="border-emerald-300 bg-emerald-100/50 dark:border-emerald-500/20 dark:bg-emerald-500/5"
				/>
			</section>

			{timelineItems.length > 0 && (
				<section className="rounded-xl border border-cyan-300 bg-cyan-100/40 p-3 dark:border-cyan-500/20 dark:bg-cyan-500/5">
					<p className="mb-1 text-xs tracking-wide text-slate-600 uppercase dark:text-slate-400">
						Timeline
					</p>
					{timelineItems.map(item => (
						<TimelineItem key={item.label} label={item.label} value={item.value} />
					))}
				</section>
			)}

			{(hasDescription || hasRejectionReason) && (
				<section className="space-y-3">
					{hasDescription && (
						<div className="rounded-xl border border-indigo-300 bg-indigo-100/40 p-3 dark:border-indigo-500/20 dark:bg-indigo-500/5">
							<p className="text-xs tracking-wide text-slate-600 uppercase dark:text-slate-400">
								Description
							</p>
							<p className="text-sm leading-relaxed whitespace-pre-wrap">{data.description}</p>
						</div>
					)}
					{hasRejectionReason && (
						<div className="rounded-xl border border-red-300 bg-red-100/40 p-3 dark:border-red-500/25 dark:bg-red-500/5">
							<p className="text-xs tracking-wide text-slate-600 uppercase dark:text-slate-400">
								Rejection Reason
							</p>
							<p className="text-sm leading-relaxed whitespace-pre-wrap">{data.rejectionReason}</p>
						</div>
					)}
				</section>
			)}

			{!hasDescription && !hasRejectionReason && (
				<div className="rounded-xl border border-dashed border-slate-300 bg-slate-100/50 p-3 text-sm text-slate-700 dark:border-slate-500/40 dark:bg-slate-500/5 dark:text-slate-300">
					No additional notes available for this loan.
				</div>
			)}
		</div>
	);
}
