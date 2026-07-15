"use client";

import Link from "next/link";
import React from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface BreadcrumbHeaderProps {
	name: string;
	url: string;
}

interface Props {
	items: BreadcrumbHeaderProps[];
}

export default function BreadcrumbHeader({ items }: Props) {
	const list = items.map((item, index) => {
		const isLast = index === items.length - 1;

		return (
			<React.Fragment key={item.name}>
				<BreadcrumbItem>
					{isLast ? (
						<BreadcrumbPage>{item.name}</BreadcrumbPage>
					) : (
						<BreadcrumbLink asChild>
							<Link href={item.url}>{item.name}</Link>
						</BreadcrumbLink>
					)}
				</BreadcrumbItem>
				{!isLast && <BreadcrumbSeparator className="hidden md:block" />}
			</React.Fragment>
		);
	});

	return (
		<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 justify-between">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>
				<Breadcrumb>
					<BreadcrumbList>{list}</BreadcrumbList>
				</Breadcrumb>
			</div>
		</header>
	);
}
