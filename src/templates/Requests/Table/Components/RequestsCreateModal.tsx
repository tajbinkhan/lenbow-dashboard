import { ChevronLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";

interface RequestsCreateModalProps {
	isCreateModalOpen: boolean;
	setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RequestsCreateModal({
	isCreateModalOpen,
	setIsCreateModalOpen
}: RequestsCreateModalProps) {
	return (
		<Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
			<DialogContent className="flex max-h-[min(600px,80vh)] flex-col gap-0 p-0 sm:max-w-md">
				<DialogHeader className="contents space-y-0 text-left">
					<DialogTitle className="border-b px-6 py-4">Create a loan request</DialogTitle>
					<DialogDescription asChild>
						<div className="p-6">
							<div className="[&_strong]:text-foreground space-y-4 [&_strong]:font-semibold">
								<div className="space-y-1">
									<p>
										<strong>Product Name:</strong> SuperTech 2000
									</p>
									<p>
										The SuperTech 2000 is a high-performance device designed for tech enthusiasts
										and professionals alike, offering superior functionality and innovative
										features.
									</p>
								</div>
								<div className="space-y-1">
									<p>
										<strong>Specifications:</strong>
									</p>
									<ul>
										<li>Processor: 3.6GHz Octa-Core</li>
										<li>Memory: 16GB RAM</li>
										<li>Storage: 1TB SSD</li>
										<li>Display: 15.6&rdquo; 4K UHD</li>
										<li>Battery Life: 12 hours</li>
										<li>Weight: 2.1kg</li>
									</ul>
								</div>
								<div className="space-y-1">
									<p>
										<strong>Key Features:</strong>
									</p>
									<ul>
										<li>Ultra-fast processing speed for intensive tasks</li>
										<li>Long battery life, perfect for on-the-go professionals</li>
										<li>Sleek and portable design</li>
										<li>Advanced cooling system</li>
										<li>Excellent build quality for durability</li>
									</ul>
								</div>
							</div>
						</div>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="bg-transparent px-8 pb-8 sm:justify-end">
					<DialogClose asChild>
						<Button variant="outline">
							<ChevronLeftIcon />
							Back
						</Button>
					</DialogClose>
					<Button type="button">Read More</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
