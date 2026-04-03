"use client";

import { useEffect, useRef, useState } from "react";

import { DescriptionModal } from "@/components/custom-ui/description-modal";

interface TableDescriptionCellProps {
	description?: string | null;
}

export function TableDescriptionCell({ description }: TableDescriptionCellProps) {
	const textRef = useRef<HTMLParagraphElement | null>(null);
	const [isTruncated, setIsTruncated] = useState(false);

	useEffect(() => {
		const element = textRef.current;

		if (!element || !description) {
			return;
		}

		const checkTruncation = () => {
			setIsTruncated(
				element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight
			);
		};

		const frameId = requestAnimationFrame(checkTruncation);

		const resizeObserver = new ResizeObserver(checkTruncation);
		resizeObserver.observe(element);

		return () => {
			cancelAnimationFrame(frameId);
			resizeObserver.disconnect();
		};
	}, [description]);

	if (!description) {
		return <span className="text-muted-foreground text-xs">No description</span>;
	}

	return (
		<div className="max-w-50 space-y-1">
			<p ref={textRef} className="line-clamp-1 text-sm wrap-break-word">
				{description}
			</p>
			{isTruncated && (
				<DescriptionModal
					description={description}
					trigger={<button className="text-primary text-xs hover:underline">View details</button>}
				/>
			)}
		</div>
	);
}
