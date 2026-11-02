"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminAuthProvider, useAdminAuth } from "@/components/AdminAuthContext";
import { AdminSidebar } from "@/components/ui/layout/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { ADMIN_NAV } from "@/components/ui/layout/admin-sidebar";

/** Admin-only routes an operator gets bounced from. */
function adminOnly(pathname: string) {
	return ADMIN_NAV.some(
		(item) =>
			item.adminOnly &&
			(item.url === "/admin" ? pathname === "/admin" : pathname.startsWith(item.url)),
	);
}

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AdminAuthProvider>
			<div className="admin-root dark min-h-screen">
				<AdminLayoutInner>{children}</AdminLayoutInner>
			</div>
		</AdminAuthProvider>
	);
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
	const { isAdminLoggedIn, isAdmin, isLoading } = useAdminAuth();
	const router = useRouter();
	const pathname = usePathname();
	const isLoginPage = pathname === "/admin/login";

	useEffect(() => {
		if (!isLoading && !isAdminLoggedIn && !isLoginPage) {
			router.replace("/admin/login");
		} else if (isAdminLoggedIn && !isAdmin && adminOnly(pathname)) {
			router.replace("/admin/matches");
		}
	}, [isAdminLoggedIn, isAdmin, isLoading, isLoginPage, pathname, router]);

	if (isLoading) {
		return <div className="min-h-screen bg-background" />;
	}

	return (
		<SidebarProvider>
			{isAdminLoggedIn && !isLoginPage && <AdminSidebar />}
			<SidebarInset>
				{isAdminLoggedIn && !isLoginPage && (
					<header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<span className="text-sm text-muted-foreground font-medium">
							Bolão Celeste — Admin
						</span>
					</header>
				)}
				<main className={isLoginPage ? "flex-1" : "flex-1 p-4"}>{children}</main>
				<Toaster position="top-right" richColors />
			</SidebarInset>
		</SidebarProvider>
	);
}
