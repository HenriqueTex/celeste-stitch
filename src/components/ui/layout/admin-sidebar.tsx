"use client";

import Link from "next/link";
import {
	BarChart3,
	CalendarDays,
	LayoutDashboard,
	Settings,
	Shield,
	Users,
	Wallet,
	Medal,
} from "lucide-react";
import * as React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/ui/layout/nav-user";
import { NavItem } from "@/components/ui/layout/nav-item";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useAdminAuth } from "@/components/AdminAuthContext";

export function AdminSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const { admin, adminLogout } = useAdminAuth();
	const navItems = [
		{
			title: "Dashboard",
			url: "/admin",
			icon: LayoutDashboard,
		},
		{
			title: "Financeiro",
			url: "/admin/financial",
			icon: BarChart3,
		},
		{
			title: "Pagamentos",
			url: "/admin/payments",
			icon: Wallet,
		},
		{
			title: "Prêmios",
			url: "/admin/prizes",
			icon: Medal,
		},
		{
			title: "Partidas",
			url: "/admin/matches",
			icon: CalendarDays,
		},
		{
			title: "Times",
			url: "/admin/teams",
			icon: Shield,
		},
		{
			title: "Usuários",
			url: "/admin/users",
			icon: Users,
		},
		{
			title: "Configurações",
			url: "/admin/settings",
			icon: Settings,
		},
	];

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				{/* Logo */}
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							asChild
						>
							<Link href="/admin">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src="/brand/icon.svg"
									alt=""
									width={32}
									height={32}
									className="size-8 shrink-0"
								/>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">Bolão Celeste</span>
									<span className="truncate text-xs">Administração</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				{navItems.map((item) => (
					<NavItem
						key={item.url}
						title={item.title}
						url={item.url}
						icon={item.icon}
					/>
				))}
			</SidebarContent>

			<SidebarFooter>
				<NavUser
					user={{
						name: admin?.nickname ?? admin?.fullName ?? "Admin",
						email: admin?.email ?? "",
					}}
					onSignOut={() => void adminLogout()}
				/>
			</SidebarFooter>
		</Sidebar>
	);
}
