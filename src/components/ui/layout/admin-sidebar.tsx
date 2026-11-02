"use client";

import Link from "next/link";
import {
	BarChart3,
	CalendarDays,
	KeyRound,
	LayoutDashboard,
	Medal,
	ScrollText,
	Settings,
	Shield,
	UserCog,
	Users,
	Wallet,
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

/** `adminOnly` pages handle money, settings, staff or the audit trail. */
export const ADMIN_NAV = [
	{ title: "Dashboard", url: "/admin", icon: LayoutDashboard, adminOnly: true },
	{ title: "Financeiro", url: "/admin/financial", icon: BarChart3, adminOnly: true },
	{ title: "Pagamentos", url: "/admin/payments", icon: Wallet, adminOnly: false },
	{ title: "Prêmios", url: "/admin/prizes", icon: Medal, adminOnly: true },
	{ title: "Partidas", url: "/admin/matches", icon: CalendarDays, adminOnly: false },
	{ title: "Times", url: "/admin/teams", icon: Shield, adminOnly: false },
	{ title: "Usuários", url: "/admin/users", icon: Users, adminOnly: false },
	{ title: "Equipe", url: "/admin/staff", icon: UserCog, adminOnly: true },
	{ title: "Auditoria", url: "/admin/audit", icon: ScrollText, adminOnly: true },
	{ title: "Configurações", url: "/admin/settings", icon: Settings, adminOnly: true },
	{ title: "Segurança", url: "/admin/security", icon: KeyRound, adminOnly: false },
];

export function AdminSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const { admin, isAdmin, adminLogout } = useAdminAuth();
	const navItems = ADMIN_NAV.filter((item) => isAdmin || !item.adminOnly);

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
							<Link href={isAdmin ? "/admin" : "/admin/matches"}>
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
									<span className="truncate text-xs">
										{isAdmin ? "Administração" : "Operação"}
									</span>
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
