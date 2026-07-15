"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type LucideIcon } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

interface NavItemProps {
	title: string;
	url: string;
	icon: LucideIcon;
}

export function NavItem({ title, url, icon: Icon }: NavItemProps) {
	const pathname = usePathname();
	const isActive = pathname === url;

	return (
		<div className="relative flex w-full min-w-0 flex-col pl-2 pt-2">
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton tooltip={title} isActive={isActive} asChild>
						<Link href={url}>
							{Icon && <Icon />}
							<span>{title}</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</div>
	);
}
